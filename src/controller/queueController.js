module.exports = (container) => {
    const logger = container.resolve('logger')
    const ObjectId = container.resolve('ObjectId')
    const {
        schemaValidator,
        schemas: {
            Queue
        }
    } = container.resolve('models')
    const {httpCode, serverHelper} = container.resolve('config')
    const {queueRepo, qrRepo} = container.resolve('repo')
    const addQueue = async (req, res) => { // thêm hạng đợi, chỉ admin có quyền
        try {
            const body = req.body
            const {
                error,
                value
            } = await schemaValidator(body, 'Queue')
            if (error) {
                return res.status(httpCode.BAD_REQUEST).send({msg: error.message})
            }
            const data = await queueRepo.addQueue(value)
            res.status(httpCode.CREATED).send(data)
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).end()
        }
    }
    const deleteQueue = async (req, res) => { // xóa hạng đợi
        try {
            const {id} = req.params
            if (id) {
                await queueRepo.updateQueue(id, { deleted: 1})
                res.status(httpCode.SUCCESS).send({ok: true})
            } else {
                res.status(httpCode.BAD_REQUEST).end()
            }
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).send({ok: false})
        }
    }
    const getQueueById = async (req, res) => { // thông tin 1 hạng đợi
        try {
            const {id} = req.params
            if (id) {
                const queue = await queueRepo.getQueueById(id)
                res.status(httpCode.SUCCESS).send(queue)
            } else {
                res.status(httpCode.BAD_REQUEST).end()
            }
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).send({ok: false})
        }
    }
    const updateQueue = async (req, res) => { // chỉnh sửa hạng đợi
        try {
            const {id} = req.params
            if (id) {
                const data = await queueRepo.getQueueById(id)
                if(data.isActive === 0){
                    await queueRepo.updateQueue(id, { isActive: 1})
                    return res.status(httpCode.SUCCESS).send('đã khóa')
                } else {
                    await queueRepo.updateQueue(id, { isActive: 0})
                    return res.status(httpCode.SUCCESS).send('kích hoạt thành công')
                }
            } else {
                res.status(httpCode.BAD_REQUEST).end()
            }
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).send({ok: false})
        }
    }
    const getQueue = async (req, res) => { // danh sách hạng đợi
        try {
            const queue = await queueRepo.getQueueNoPaging({isActive: 0, deleted: 0})
            res.status(httpCode.SUCCESS).send(queue)
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).send({ok: false})
        }
    }
    const getQrAndQueue = async (req, res) => { // danh sách các qr của hạng đợi
        try {
            const {queueId} = req.query
            if (queueId){
                const data = await qrRepo.getQrNoPaging({queueId: queueId, state: 1})
                res.status(httpCode.SUCCESS).send(data)
            } else {
                res.status(httpCode.BAD_REQUEST).send({ok: false})
            }
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).send({ok: false})
        }
    }
    return {
        addQueue,
        getQueue,
        getQueueById,
        updateQueue,
        deleteQueue,
        getQrAndQueue
    }
}
