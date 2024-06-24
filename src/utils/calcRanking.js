export default function calculateRankings(players) {
    // Sắp xếp người chơi dựa trên score (cao đến thấp) và isAFK (false trước)
    players.sort((a, b) => {
        if (a.isAFK && !b.isAFK) return 1;
        if (!a.isAFK && b.isAFK) return -1;
        return b.score - a.score;
    });

    // Khởi tạo các phần thưởng dựa trên số lượng người chơi
    const rewards = {
        2: [
            { gainedBcoin: 150, gainedExp: 200, gainedScore: 100 },
            { gainedBcoin: 50, gainedExp: 100, gainedScore: -50 },
        ],
        3: [
            { gainedBcoin: 250, gainedExp: 200, gainedScore: 200 },
            { gainedBcoin: 150, gainedExp: 100, gainedScore: 100 },
            { gainedBcoin: 50, gainedExp: 100, gainedScore: -50 },
        ],
        4: [
            { gainedBcoin: 350, gainedExp: 300, gainedScore: 300 },
            { gainedBcoin: 250, gainedExp: 100, gainedScore: 200 },
            { gainedBcoin: 150, gainedExp: 100, gainedScore: 100 },
            { gainedBcoin: 50, gainedExp: 100, gainedScore: -50 },
        ],
    };

    // Lấy phần thưởng tương ứng với số lượng người chơi
    const numPlayers = players.length;
    const playerRewards = rewards[numPlayers] || [];

    // Gán phần thưởng cho từng người chơi dựa trên thứ hạng
    const rankedPlayers = [];
    let currentRank = 1;
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        let reward = playerRewards[currentRank - 1] || { gainedBcoin: 0, gainedExp: 0, gainedScore: 0 };

        // Điều chỉnh phần thưởng nếu người chơi không AFK nhưng có score = 0
        if (!player.isAFK && player.score === 0) {
            reward = {
                gainedBcoin: reward.gainedBcoin / 2,
                gainedExp: reward.gainedExp / 2,
                gainedScore: reward.gainedScore > 0 ? 0 : reward.gainedScore
            };
        }

        // Nếu người chơi là AFK, đặt phần thưởng là 0
        if (player.isAFK) {
            rankedPlayers.push({
                playerId: player.playerId,
                gainedBcoin: 0,
                gainedExp: 0,
                gainedScore: -50,
                top: currentRank.toString(),
                isAFK: player.isAFK,
            });
        } else {
            rankedPlayers.push({
                playerId: player.playerId,
                gainedBcoin: reward.gainedBcoin,
                gainedExp: reward.gainedExp,
                gainedScore: reward.gainedScore,
                top: currentRank.toString(),
                isAFK: player.isAFK,
            });
        }

        // Kiểm tra nếu điểm của người chơi tiếp theo bằng với người chơi hiện tại
        if (i < players.length - 1 && players[i].score !== players[i + 1].score) {
            currentRank++;
        }
    }

    return { listPlayer: rankedPlayers };
}

// Example input
// const players = [
//     {
//         id: 'fYqsewSImjcZWlGxAAAH',
//         playerId: 30,
//         name: 'Tien',
//         rank: {},
//         level: 0,
//         currentAvatar: 'https://res.cloudinary.com/dbfftqigf/image/upload/v1719194745/avatar-trang-2_byptft.jpg',
//         isReady: true,
//         score: 0,
//         isAFK: false
//     },
//     {
//         id: 'st1HVIzYQzXAwfBMAAAJ',
//         playerId: 29,
//         name: 'Toan',
//         rank: {},
//         level: 0,
//         currentAvatar: 'https://res.cloudinary.com/dbfftqigf/image/upload/v1719194745/avatar-trang-2_byptft.jpg',
//         isReady: true,
//         score: 0,
//         isAFK: true
//     },
//     {
//         id: 'st1mmmzYQzeewfBMAAAJ',
//         playerId: 50,
//         name: 'Tuan',
//         rank: {},
//         level: 0,
//         currentAvatar: 'https://res.cloudinary.com/dbfftqigf/image/upload/v1719194745/avatar-trang-2_byptft.jpg',
//         isReady: true,
//         score: 0,
//         isAFK: true
//     }
// ];

// // Example output
// const output = calculateRankings(players);
// console.log(output);
