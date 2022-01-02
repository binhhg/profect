module.exports = (container) => {
    const authorizationController = require('./authorizationController')(container)
    const userController = require('./userController')(container)
    const queueController = require('./queueController')(container)
    const qrController = require('./qrController')(container)
    const genQrController = require('./genQrController')(container)
    return {
        authorizationController,userController,queueController,qrController,genQrController
    }
}
