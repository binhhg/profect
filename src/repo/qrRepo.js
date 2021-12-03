module.exports = container => {
    const { schemas } = container.resolve('models')
    const { Qr } = schemas
    const addQr = (cate) => {
        const c = new Qr(cate)
        return c.save()
    }
    const getQrById = (id) => {
        return Qr.findById(id)
    }
    const deleteQr = (id) => {
        return Qr.deleteOne(id)
    }
    const updateQr = (id, n) => {
        return Qr.update(id, n)
    }
    const checkIdExist = (id) => {
        return Qr.findOne({ id })
    }
    const getCount = (pipe = {}) => {
        return Qr.countDocuments(pipe)
    }
    const getQrAgg = (pipe) => {
        return Qr.aggregate(pipe)
    }
    const getQr = (pipe, limit, skip, sort) => {
        return Qr.find(pipe).limit(limit).skip(skip).sort(sort)
    }
    const getQrNoPaging = (pipe) => {
        return Qr.find(pipe)
    }
    const removeQr = (pipe) => {
        return Qr.deleteMany(pipe)
    }
    const findOne = (pipe) => {
        return Qr.findOne(pipe)
    }
    return {
        getQrNoPaging,
        removeQr,
        addQr,
        getQrAgg,
        getQrById,
        deleteQr,
        updateQr,
        checkIdExist,
        getCount,
        getQr,
        findOne
    }
}
