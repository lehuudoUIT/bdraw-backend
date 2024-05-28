import db from "../models/index"

let checkUsername = (username) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { username: username }
            })
            if (user) {
                resolve(user)
            }
            else {
                resolve(false)
            }
        }
        catch (e) {
            reject(e);
        }
    })
}
let handleUserLogin = (username, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let users = await checkUsername(username)
            if (users) {
                // User already exists
                let user = await db.User.findOne({
                    where: { username: username },
                    attributes: ['username', 'password', 'id'],
                    raw: true
                })
                if (user) {
                    let check;
                    if (user.password === password) {
                        check = 1;
                    }
                    else {
                        check = 0;
                    }
                    if (check) {

                        userData.errCode = 0
                        userData.errMessage = "Login success";
                        userData.user = users
                    }
                    else {
                        userData.errCode = 1;
                        userData.errMessage = "Wrong password!";
                    }
                }
                else {
                    userData.errCode = 1;
                    userData.errMessage = `Your username isn's exists in our system. Please try again!`;
                }
            }
            resolve(userData);
        }
        catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
}