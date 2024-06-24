const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const data = require("../data/label.json");

const rooms = [];
const countdownTimers = [];
const queue = [];

const initSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: [
                "https://admin.socket.io",
                "*"
            ],
            credentials: true,
            methods: ["GET", "POST"],
        }
    })

    instrument(io, {
        auth: false,
        mode: "development",
    });

    const handleJoinRoom = (socket, room, password, player) => {

        const requiredRoom = rooms.find(lroom => lroom.id === room);
        console.log("🚀 ~ handleJoinRoom ~ requiredRoom:", requiredRoom)

        if (requiredRoom) {
            // Room exists, check for password and room size
            if (requiredRoom.password === password && requiredRoom.sockets.length < 4) {
                const newSocket = {
                    id: socket.id,
                    playerId: player.playerId,
                    name: player.name,
                    rank: player.rank,
                    level: player.level,
                    currentAvatar: player.currentAvatar,
                    isReady: false,
                    score: 0,
                    isAFK: false
                }
                requiredRoom.sockets.push(newSocket);
                socket.join(room);
                socket.emit('roomJoined', { room });
                console.log(`${socket.id} joined room ${room}`);
                console.log("🚀 ~ handleJoinRoom ~ rooms:", requiredRoom);
            } else {
                socket.emit('invalidOperation', 'Invalid operation: incorrect password or room is full');
            }
        } else {
            socket.emit('invalidOperation', 'Invalid operation: room does not exist');
        }
    };

    const handleCreateRoom = (socket, room, password, player) => {
        const roomData = {
            id: room,
            sockets: [
                {
                    id: socket.id,
                    playerId: player.playerId,
                    name: player.name,
                    rank: player.rank,
                    level: player.level,
                    currentAvatar: player.currentAvatar,
                    isReady: false,
                    score: 0,
                    isAFK: false
                }
            ],
            password,
            gameState: false,
            rounds: new Array(6).fill(false),
            drawFinish: new Array(6).fill(0)
        };
        console.log("🚀 ~ handleCreateRoom ~ roomData:", roomData)

        const match = rooms.some(room => room.id === roomData.id);

        if (match) {
            // Room already exists
            socket.emit('invalidOperation', 'Invalid operation: room already exists');
        } else {
            // Create a new room
            socket.join(room);
            // Store password with room
            rooms.push(roomData);
            socket.emit('roomCreated', { room });
            console.log(`Room ${room} created and joined by ${socket.id}`);
        }
    };

    const handleLeaveRoom = (socket, room) => {
        socket.leave(room);

        const requiredRoom = rooms.find(lroom => lroom.id === room);
        console.log("🚀 ~ handleLeaveRoom ~ requiredRoom:", requiredRoom)

        if (!requiredRoom)
            return;

        //findIndex of player who leave room and delete it

        const index = requiredRoom.sockets.findIndex(lsocket => lsocket.id === socket.id);
        if (index !== -1) {
            requiredRoom.sockets.splice(index, 1);
        }

        // if room don't have player, then delete
        if (requiredRoom.sockets.length === 0) {
            const indexRoom = rooms.findIndex(room => room.id === requiredRoom.id);
            console.log("🚀 ~ handleLeaveRoom ~ indexRoom:", indexRoom)
            if (indexRoom !== -1) {
                rooms.splice(indexRoom, 1);
            }
            return;
        }

        io.to(requiredRoom.id).emit('foundRoom', requiredRoom);
    }

    const handleChangeIsReady = (socket, room) => {
        const requiredRoom = rooms.find(lroom => lroom.id === room);

        if (!requiredRoom)
            return;

        const index = requiredRoom.sockets.findIndex(lsocket => lsocket.id === socket.id);
        if (index !== -1) {
            requiredRoom.sockets[index].isReady = !requiredRoom.sockets[index].isReady
        }

        io.to(requiredRoom.id).emit('foundRoom', requiredRoom);

        const allReady = requiredRoom.sockets.every(s => s.isReady);
        console.log("🚀 ~ handleChangeIsReady ~ allReady:", allReady)

        if (allReady) {
            io.to(room).emit('startCountdown');
        } else {
            io.to(room).emit('resetCountdown');
        }
    }

    const handldeStartGame = (room) => {

        console.log("🚀 ~ handldeStartGame ~ room:", room)
        const requiredRoom = rooms.find(lroom => lroom.id === room);

        if (!requiredRoom)
            return;

        if (requiredRoom.gameState === true)
            return;

        requiredRoom.gameState = true;
        console.log("🚀 ~ handldeStartGame ~ requiredRoom:", requiredRoom);

        const randomKeywords = [];
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * data.names.length);
            randomKeywords.push(data.names[randomIndex]);
        }

        setTimeout(() => {
            io.to(room).emit('letsPlay', randomKeywords);
        }, 1000);
    }

    const handldeStartRound = (room, round) => {

        console.log("🚀 ~ handldeStartRoom ~ room:", room)
        const requiredRoom = rooms.find(lroom => lroom.id === room);

        if (!requiredRoom)
            return;

        if (requiredRoom?.rounds[round] === true)
            return;

        requiredRoom.rounds[round] = true;
        console.log("🚀 ~ handldeStartRound ~ requiredRoom:", requiredRoom);

        countdownTimers[room] = setTimeout(() => {
            io.to(room).emit('get-score', requiredRoom);
            setTimeout(() => {
                io.to(room).emit('hide-result');
            }, 5000)
        }, 27000);
    }

    const handleSetScore = async (socket, room, score, round) => {
        console.log("🚀 ~ handleSetScore ~ room:", room)
        const requiredRoom = rooms.find(lroom => lroom.id === room);

        if (!requiredRoom)
            return;

        const index = requiredRoom.sockets.findIndex(lsocket => lsocket.id === socket.id);
        if (index !== -1) {
            requiredRoom.sockets[index].score = score;
            requiredRoom.drawFinish[round]++;
        }

        if (requiredRoom.drawFinish[round] === requiredRoom.sockets.length) {
            clearTimeout(countdownTimers[room]);
            io.to(room).emit('get-score', requiredRoom);
            setTimeout(() => {
                io.to(room).emit('hide-result');
            }, 5000);

            if (requiredRoom.rounds[5] === true) {
                // Done 6 rounds

                const indexOfRoom = rooms.indexOf(requiredRoom);

                // Call API
                const response = await fetch("http://188.166.185.29:3107/api/v1/log-test");
                const movies = await response.json();
                console.log(movies);

                if (indexOfRoom !== -1) {
                    requiredRoom.sockets.forEach(socket => {
                        io.sockets.sockets.get(socket.id)?.leave(requiredRoom.id);
                    })

                    console.log(`Delete room ${requiredRoom.id}`);
                    rooms.splice(indexOfRoom, 1);
                }
            }
        }
    }

    const handleFindMatch = (socket, player) => {
        queue.push({ socket, player });
        console.log(`${socket.id} join the queue`);

        if (queue.length >= 2) {
            // Create a room for the first two players in the queue
            const player1 = queue.shift();
            const player2 = queue.shift();

            const room = {
                id: `${player1.socket.id}-${player2.socket.id}`,
                sockets: [
                    {
                        id: player1.socket.id,
                        playerId: player1.player.playerId,
                        name: player1.player.name,
                        rank: player1.player.rank,
                        level: player1.player.level,
                        currentAvatar: player1.player.currentAvatar,
                        isReady: false,
                        score: 0,
                        isAFK: false
                    },
                    {
                        id: player2.socket.id,
                        playerId: player2.player.playerId,
                        name: player2.player.name,
                        rank: player2.player.rank,
                        level: player2.player.level,
                        currentAvatar: player2.player.currentAvatar,
                        isReady: false,
                        score: 0,
                        isAFK: false
                    }
                ],
                gameState: false,
                rounds: new Array(6).fill(false),
                drawFinish: new Array(6).fill(0)
            };

            player1.socket.join(room.id);
            player2.socket.join(room.id)
            rooms.push(room);

            // Notify both players of the match
            io.to(room.id).emit('matchFound', room);
            console.log("🚀 ~ handleFindMatch ~ matchFound:", room.id)
        }
    };

    const handleCancelFindMatch = (socket) => {
        const index = queue.findIndex(player => player.socket === socket);

        if (index !== -1) {
            queue.splice(index, 1);
            console.log(`${socket.id} left the queue`);
        }
    }

    const handleAccept = (socket, roomId) => {
        const requiredRoom = rooms.find(lroom => lroom.id === roomId);

        if (requiredRoom) {
            const player = requiredRoom.sockets.find(p => p.id === socket.id);
            if (player) {
                player.isReady = true;
            }

            // Check if all players are ready
            if (requiredRoom.sockets.every(p => p.isReady)) {
                handldeStartGame(requiredRoom.id); // Notify both players to start countdown
            }
        }
    };

    const handleDecline = (socket, roomId) => {
        const requiredRoom = rooms.find(lroom => lroom.id === roomId);

        if (requiredRoom) {

            const indexRoom = rooms.findIndex(room => room.id === requiredRoom.id);
            if (indexRoom !== -1) {
                rooms.splice(indexRoom, 1);
            }

            socket.leave(roomId);
            // Notify the other player and remove the room
            const otherPlayer = requiredRoom.sockets.find(p => p.id !== socket.id);

            if (otherPlayer) {
                io.to(otherPlayer.id).emit('matchCancelled', 'The other player declined the match');
                // Make the other player leave the room
                io.sockets.sockets.get(otherPlayer.id)?.leave(roomId);
            }
        }
    };

    const handleQuitGame = (socket, roomId) => {
        const requiredRoom = rooms.find(lroom => lroom.id === roomId);
        if (requiredRoom) {
            const player = requiredRoom.sockets.find(p => p.id === socket.id);
            if (player) {
                player.isAFK = true;
                player.score = 0;
            }
            io.sockets.sockets.get(player.id)?.leave(requiredRoom.id);
            io.to(requiredRoom.id).emit('notice-quit', 'Another player has quit the game');
            console.log(`Player ${socket.id} has quit the game in room ${roomId}`);

            const allLeave = requiredRoom.sockets.every(s => s.isAFK);

            if (allLeave) {
                // Call API

                //Delete room
                const indexRoom = rooms.findIndex(room => room.id === requiredRoom.id);
                if (indexRoom !== -1) {
                    rooms.splice(indexRoom, 1);
                }
            }
        }
    };

    const handleDisconnecting = (socket) => {
        const userRooms = [...socket.rooms]; // Lấy tất cả các phòng mà người dùng đang tham gia
        userRooms.forEach(roomId => {
            // Bỏ qua phòng mặc định là socket id
            if (roomId !== socket.id) {
                const requiredRoom = rooms.find(room => room.id === roomId);
                if (requiredRoom && !requiredRoom.gameState) {
                    const playerIndex = requiredRoom.sockets.findIndex(player => player.id === socket.id);
                    if (playerIndex !== -1) {
                        requiredRoom.sockets.splice(playerIndex, 1); // Xóa người chơi khỏi phòng
                    }

                    // Nếu phòng không còn người chơi nào, xóa phòng
                    if (requiredRoom.sockets.length === 0) {
                        const roomIndex = rooms.findIndex(room => room.id === roomId);
                        if (roomIndex !== -1) {
                            rooms.splice(roomIndex, 1);
                        }
                    } else {
                        // Cập nhật lại thông tin phòng
                        io.to(requiredRoom.id).emit('foundRoom', requiredRoom);
                    }

                    console.log(`Player ${socket.id} disconnected and removed from room ${roomId}`);
                }
                if (requiredRoom && requiredRoom.gameState) {
                    handleQuitGame(socket, roomId);
                }
            }
        });
    };

    io.on('connection', (socket) => {
        console.log(`🌞: ${socket.id} user just connected!`);

        socket.on('roomAction', (data) => {
            const { action, room, password, player } = data;

            if (action === 'join') {
                // Logic for joining room
                handleJoinRoom(socket, room, password, player);
            } else if (action === 'create') {
                // Logic for creating room
                handleCreateRoom(socket, room, password, player);
            }
        });

        socket.on('findRoom', (roomId) => {
            const requiredRoom = rooms.find(room => room.id === roomId);
            if (requiredRoom) {
                io.in(requiredRoom.id).emit('foundRoom', requiredRoom);
            } else {
                socket.emit('invalidOperation', 'Room not found');
            }
        })

        socket.on('leave-room', (data) => handleLeaveRoom(socket, data));

        socket.on('is-ready', (data) => handleChangeIsReady(socket, data));

        socket.on('startGame', (data) => handldeStartGame(data));

        socket.on('startRound', (data) => handldeStartRound(data.room, data.round));

        socket.on('set-score', (data) => handleSetScore(socket, data.room, data.score, data.round));

        socket.on('findMatch', (data) => handleFindMatch(socket, data));

        socket.on('cancelFindMatch', () => handleCancelFindMatch(socket));

        socket.on('acceptMatch', (roomId) => handleAccept(socket, roomId));

        socket.on('declineMatch', (roomId) => handleDecline(socket, roomId));

        socket.on('quitGame', (roomId) => handleQuitGame(socket, roomId));

        socket.on('disconnect', () => {
            handleCancelFindMatch(socket);
            socket.disconnect();
            console.log(`🔥: ${socket.id} disconnected`);
        });

        socket.on('disconnecting', () => handleDisconnecting(socket));

    });

    return io;
};

module.exports = initSocket;
