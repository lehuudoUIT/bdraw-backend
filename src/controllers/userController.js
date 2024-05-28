import userService from '../services/userService'
// example login
let handleLogin = async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(500).json({
            errCode: 1,
            message: "Missing input parameter !"
        })
    }
    let userData = await userService.handleUserLogin(username, password)
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData : {}
    })
}
module.exports = {
    handleLogin: handleLogin,
}