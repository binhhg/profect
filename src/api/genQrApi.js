module.exports = (app, container) => {
    const { genQrController } = container.resolve('controller')


    /**
     * @swagger
     * /genqr/register:
     *   get:
     *     summary: tạo QrCode để đăng ký
     *     responses:
     *       200:
     *         description: SUCCESS
     *       400:
     *         description: BAD_REQUEST
     *
     *
     *
     */
    app.get("/genqr/register", genQrController.registerQr)


    /**
     * @swagger
     * /genqr/cancel:
     *   get:
     *     summary: tạo QrCode để hủy đăng ký
     *     responses:
     *       200:
     *         description: SUCCESS
     *       400:
     *         description: BAD_REQUEST
     *
     *
     *
     */
    app.get("/genqr/cancel", genQrController.cancelQr)

}
