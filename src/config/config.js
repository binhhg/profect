const crypto = require("crypto");
const QRCode = require("qrcode");
const serverSettings = {
    port: 8009
}

const httpCode = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    TOKEN_EXPIRED: 409,
    UNKNOWN_ERROR: 520,
    FORBIDDEN: 403,
    UNAUTHORIZED: 401,
    ADMIN_REQUIRE: 406
}

const dbSettings = {
    db: process.env.DB || 'project3',
    user: process.env.DB_USER || 'binhpt',
    pass: process.env.DB_PASS || '20183693',
    repl: process.env.DB_REPLS || '',
    servers: (process.env.DB_SERVERS) ? process.env.DB_SERVERS.split(',') : [
        'sinno.soict.ai:27017'
    ]
}
const serverHelper = function () {
    const jwt = require('jsonwebtoken')
    const crypto = require('crypto')
    const QRCode = require('qrcode')
    const secretKey = process.env.SECRET_KEY || 'abcdxyz'

    function genQr(string){
        let img='';
        let qr=  QRCode.toDataURL(string);
        img = `<image src= " `+qr+ `" />`
        return img
    }

    function decodeToken(token) { // giải mã token
        return jwt.decode(token)
    }

    function genToken(obj) { // sinh token
        return jwt.sign(obj, secretKey, {expiresIn: '1d'})
    }

    function generateHash(str) {
        return crypto.createHash('md5').update(str).digest('hex')
    }

    function verifyToken(token) { // xác thực token
        return new Promise((resolve, reject) => {
            jwt.verify(token, secretKey, (err, decoded) => {
                err ? reject(new Error(err)) : resolve(decoded)
            })
        })
    }

    function isValidToken(token) { // xem token còn hạn không
        const user = decodeToken(token)
        const now = Date.now() / 1000
        if (user && user._id && user.exp > now) {
            return user
        }
        return null
    }

    function encryptPassword(password) { // hash mật khẩu
        return crypto.createHash('sha256').update(password, 'binary').digest('base64')
    }

    return {decodeToken, encryptPassword, verifyToken, genToken, generateHash, isValidToken, genQr}
}
module.exports = {dbSettings, serverHelper: serverHelper(), serverSettings, httpCode}
