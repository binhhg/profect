module.exports = (app, container) => {
    const { genQrController } = container.resolve('controller')
    app.get("/genqr/register", genQrController.registerQr)
    app.get("/genqr/cancel", genQrController.cancelQr)

}
