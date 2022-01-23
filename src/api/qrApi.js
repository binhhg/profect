module.exports = (app, container) => {
    const { qrController } = container.resolve('controller')
    const { checkAccessToken} = container.resolve('middleware')
    /**
     * @swagger
     * components:
     *   schemas:
     *     Qr:
     *       type: object
     *       required:
     *         - guestId
     *         - queueId
     *         - number
     *         - stt
     *       properties:
     *         _id:
     *           type: ObjectId
     *           description: id of mongoose
     *         guestId:
     *           type: String
     *           description: id guest and using nanoid
     *         queueId:
     *           type: ObjectID
     *           description: id of queue
     *         number:
     *           type: Number
     *           description: guest number
     *         stt:
     *           type: Number
     *           description: order number in queue
     *         status:
     *           type: Number
     *           description: 1 is pending 2 is completed 3 is reject and 4 is cancel
     *       example:
     *         id: 61d123f08c7f5b666057c292
     *         guestId: QVMIwqociluhcHCx
     *         queueId: 61d1188a27bd9766c0d7b958
     *         number: 2
     *         stt: 4
     *         status: 1
     *
     */



    /**
     * @swagger
     * /qr/addqr:
     *   get:
     *     summary: thêm qr vào hạng đợi
     *     tags: [Qr]
     *     responses:
     *       200:
     *         description: SUCCESS
     *       400:
     *         description: BAD_REQUEST
     *
     *
     *
     */
    app.get("/qr/addqr", qrController.addQr)

    /**
     * @swagger
     * /qr/deleteqr:
     *   get:
     *     summary: xóa qr khỏi hạng đợi
     *     tags: [Qr]
     *     responses:
     *       200:
     *         description: SUCCESS
     *       400:
     *         description: BAD_REQUEST
     *
     *
     *
     */
    app.get("/qr/deleteqr", qrController.deleteQr)

    /**
     * @swagger
     * /qr/queue:
     *   get:
     *     summary: trả về danh sách các qr trong hạng đợi
     *     parameters:
     *       -  in: query
     *          name: queueId
     *          schema:
     *            type: ObjectId
     *          required: true
     *          description: Id của hạng đợi
     *     tags: [Qr]
     *
     *     responses:
     *       200:
     *         description: SUCCESS
     *       400:
     *         description: BAD_REQUEST
     *
     *
     *
     */
    app.get("/qr/queue", qrController.getQrAndQueue)
    app.get("/qr/:id", qrController.getQrById)


    /**
     * @swagger
     * /qr/complete/{id}:
     *   put:
     *     summary: xác nhận qr đã hoàn thành trong trường hợp khách đã hoàn thành giao dịch
     *     parameters:
     *       -  in: path
     *          name: id
     *          schema:
     *            type: ObjectId
     *          required: true
     *          description: Id của Qr
     *     tags: [Qr]
     *
     *     responses:
     *       200:
     *         description: SUCCESS
     *       400:
     *         description: BAD_REQUEST
     *
     *
     *
     */
    app.put("/qr/complete/:id",checkAccessToken,qrController.completedQr)

    /**
     * @swagger
     * /qr/reject/{id}:
     *   put:
     *     summary: từ chối Qr của khách trong trường hợi đợi k thấy khách
     *     parameters:
     *       -  in: path
     *          name: id
     *          schema:
     *            type: ObjectId
     *          required: true
     *          description: Id của Qr
     *     tags: [Qr]
     *
     *     responses:
     *       200:
     *         description: SUCCESS
     *       400:
     *         description: BAD_REQUEST
     *
     *
     *
     */
    app.put("/qr/reject/:id",checkAccessToken,qrController.rejectQr)
}
