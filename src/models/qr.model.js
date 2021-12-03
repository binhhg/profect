module.exports = (joi, mongoose, {joi2MongoSchema, schemas}) => {
    const {ObjectId} = mongoose.Types
    const stateType = {
        PENDING: 1,
        COMPLETED: 2,
        REJECT: 3,
        CANCEL: 4

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

