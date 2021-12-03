module.exports = (app, container) => {
    const { queueController } = container.resolve('controller')
    const { checkAdmin } = container.resolve('middleware')
    app.get("/queue", queueController.getQueue)
    app.get("/queue/qr", queueController.getQrAndQueue)
    app.get("/queue/:id", queueController.getQueueById)
    app.put("/queue/:id", queueController.updateQueue)
    app.delete("/queue/:id",checkAdmin, queueController.deleteQueue)
    app.post("/queue",checkAdmin, queueController.addQueue)
}
