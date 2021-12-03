module.exports = container => {
    const { schemas } = container.resolve('models')
    const { Queue } = schemas
    const addQueue = (cate) => {
        const c = new Queue(cate)
        return c.save()
    }
    const getQueueById = (id) => {
        return Queue.findById(id)
    }
    const deleteQueue = (id) => {
        return Queue.findByIdAndRemove(id, { useFindAndModify: false })
    }
    const updateQueue = (id, n) => {
        return Queue.findByIdAndUpdate(id, n, {
            useFindAndModify: false,
            returnOriginal: false
        })
    }
    const checkIdExist = (id) => {
        return Queue.findOne({ id })
    }
    const getCount = (pipe = {}) => {
        return Queue.countDocuments(pipe)
    }
    const getQueueAgg = (pipe) => {
        return Queue.aggregate(pipe).sort({ length: 1})
    }
    const getQueue = (pipe, limit, skip, sort) => {
        return Queue.find(pipe).limit(limit).skip(skip).sort(sort)
    }
    const getQueueNoPaging = (pipe) => {
        return Queue.find(pipe).sort({ length: 1})
    }
    const removeQueue = (pipe) => {
        return Queue.deleteMany(pipe)
    }
    return {
        getQueueNoPaging,
        removeQueue,
        addQueue,
        getQueueAgg,
        getQueueById,
        deleteQueue,
        updateQueue,
        checkIdExist,
        getCount,
        getQueue
    }
}
