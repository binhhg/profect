module.exports = (joi, mongoose, {joi2MongoSchema, schemas}) => {
    const {ObjectId} = mongoose.Types
    const stateType = {
        PENDING: 1, // đang chờ
        COMPLETED: 2, // hoàn thành khi khách phản hồi
        REJECT: 3, // từ chối khi khách k phản hồi
        CANCEL: 4 // hủy khi khách quét qr hủy

    }
    const userJoi = joi.object({
        guestId: joi.string().required(),
        queueId: joi.string().required(),
        number: joi.number().required(),
        stt: joi.number().required(),
        state: joi.number().valid(...Object.values(stateType)).default(1)
    })
    const userSchema = joi2MongoSchema(userJoi, {
        queueId: {
            type: ObjectId,
            ref: 'Queue'
        }
    },{
        createdAt: {
            type: Number,
            default: () => Math.floor(Date.now() / 1000)
        }
    })
    userSchema.statics.validateObj = async (obj, config = {}) => {
        return userJoi.validate(obj, config)
    }
    const documentModel = mongoose.model('Qr', userSchema)
    documentModel.syncIndexes()
    return documentModel

}

