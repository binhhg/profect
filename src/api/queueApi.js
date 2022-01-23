module.exports = (app, container) => {
    const { queueController } = container.resolve('controller')
    const { checkAdmin } = container.resolve('middleware')
    /**
     * @swagger
     * components:
     *   schemas:
     *     Queue:
     *       type: object
     *       required:
     *         - title
     *       properties:
     *         _id:
     *           type: ObjectId
     *           description: id of mongoose
     *         title:
     *           type: String
     *           description: name of queue
     *         isActive:
     *           type: Number
     *           description: 0 is active and 1 is not active
     *         deleted:
     *           type: Number
     *           description: 0 is not deleted and 1 is deleted
     *         isAdministrator:
     *           type: Number
     *           description: 1 is admin and 0 is employee
     *       example:
     *         id: 61d1188a27bd9766c0d7b958
     *         title: test1
     *         isActive: 0
     *         deleted: 0
     */


    /**
     * @swagger
     * /queue:
     *   get:
     *     summary: trả về danh sách các hạng đợi
     *     tags: [Queue]
     *     responses:
     *       200:
     *         description: danh sách hạng đợi
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               example:
     *                  [
     *                   {
     *                        id: 61d1188a27bd9766c0d7b958,
     *                        title: test1,
     *                        isActive: 0,
     *                         deleted: 0,
     *                   }
     *                  ]
     *
     *
     */
    app.get("/queue", queueController.getQueue)

    /**
     * @swagger
     * /queue:
     *   post:
     *     summary: tạo hạng đợi mới. chỉ Amin mới có quyền
     *     tags: [Queue]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *            schema:
     *              type: object
     *              example:
     *                 {
     *                     title: 'hạng đợi 1'
     *                 }
     *     responses:
     *       200:
     *         description: SUCCESS
     *       400:
     *         description: BAD_REQUEST
     *
     *
     */
    app.post("/queue",checkAdmin, queueController.addQueue)

    /**
     * @swagger
     * /queue/{id}:
     *   delete:
     *     summary: xóa 1 hạng đợi
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: ObjectId
     *         required: true
     *         description: Id của hạng đợi
     *     tags: [Queue]
     *     responses:
     *       200:
     *         description: SUCCESS
     *       400:
     *         description: BAD_REQUEST
     *
     *
     */
    app.delete("/queue/:id",checkAdmin, queueController.deleteQueue)

    /**
     * @swagger
     * /queue/{id}:
     *   put:
     *     summary: kích hoạt hoặc khóa 1 hạng đợi để nhận qr hoặc dừng không nhận qr
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: ObjectId
     *         required: true
     *         description: Id của hạng đợi
     *     tags: [Queue]
     *     responses:
     *       200:
     *         description: SUCCESS
     *       400:
     *         description: BAD_REQUEST
     *
     *
     */
    app.put("/queue/:id", queueController.updateQueue)
    app.get("/queue/:id", queueController.getQueueById)
}
