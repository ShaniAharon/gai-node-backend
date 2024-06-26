const authService = require('./auth.service')
const logger = require('../../services/logger.service')
const userService = require('../user/user.service')

async function login(req, res) {
    const { username, password } = req.body
    try {
        const user = await authService.login(username, password)
        const loginToken = authService.getLoginToken(user)
        // logger.info('User login: ', user.username)
        res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true })
        res.json(user)
    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(401).send({ err: 'Failed to Login' })
    }
}

async function verifyToken(req, res) {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer Token
    console.log('token', token)
    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    const user = authService.validateToken(token);
    if (!user) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }

    res.json({ success: true, user });
}

async function signup(req, res) {
    try {
        const credentials = req.body
        // Never log passwords
        // logger.debug(credentials)
        // console.log(credentials)
        const account = await authService.signup(credentials)
        // logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
        const user = await authService.login(credentials.username, credentials.password)
        logger.info('User signup:', user)
        const loginToken = authService.getLoginToken(user)
        res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true })
        res.json(user)
    } catch (err) {
        logger.error('Failed to signup ' + err)
        res.status(500).send({ err: 'Failed to signup' })
    }
}

async function googleLoginSignup(req, res) {
    try {
        const credentials = req.body
        // console.log(credentials)
        const isSignedUp = await userService.getByUsername(credentials.username)
        if (!isSignedUp) {
            await authService.signup(credentials)
        }
        const user = await authService.login(credentials.username, credentials.password)
        const loginToken = authService.getLoginToken(user)
        res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true })
        res.json(user)
        // console.log(user)
    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(401).send({ err: 'Failed to Login' })
    }
}

async function logout(req, res) {
    try {
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to logout' })
    }
}

module.exports = {
    login,
    signup,
    logout,
    googleLoginSignup,
    verifyToken
}
