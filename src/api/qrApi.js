module.exports = (app, container) => {
    const { qrController } = container.resolve('controller')
    app.get("/qr/list", qrController.getQr)
    app.get("/qr/addqr", qrController.addQr)
    app.get("/qr/deleteqr", qrController.deleteQr)
    app.get("/qr/:id", qrController.getQrById)
    app.put("/qr/:id",qrController.updateQr)
}
