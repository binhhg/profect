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
    const addQueue = async (req, res) => {
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
    const deleteQueue = async (req, res) => {
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
    const getQueueById = async (req, res) => {
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
    const updateQueue = async (req, res) => {
        try {
            const {id} = req.params
            const queue = req.body
            const {
                error,
                value
            } = await schemaValidator(queue, 'Queue')
            if (error) {
                return res.status(httpCode.BAD_REQUEST).send({msg: error.message})
            }
            if (id && queue) {
                const sp = await queueRepo.updateQueue(id, value)
                res.status(httpCode.SUCCESS).send(sp)
            } else {
                res.status(httpCode.BAD_REQUEST).end()
            }
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).send({ok: false})
        }
    }
    const getQueue = async (req, res) => {
        try {
            const queue = await queueRepo.getQueueNoPaging({isActive: 0, deleted: 0})
            res.status(httpCode.SUCCESS).send(queue)
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).send({ok: false})
        }
    }
    const getQrAndQueue = async (req, res) => {
        try {
            const {queueId} = req.query
            if (queueId){
                const data = await qrRepo.getQueueNoPaging({queueId: queueId, state: 1})
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
