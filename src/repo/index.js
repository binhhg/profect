const repo = (container) => {
    const userRepo = require('./userRepo')(container)
    const queueRepo = require('./queueRepo')(container)
    const qrRepo = require('./qrRepo')(container)
    const sessionRepo = require('./sessionRepo')(container)
    return { userRepo, queueRepo, qrRepo, sessionRepo }
}
const connect = (container) => {
    const dbPool = container.resolve('db')
    if (!dbPool) throw new Error('Connect DB failed')
    return repo(container)
}

module.exports = { connect }
