module.exports = (joi, mongoose, {joi2MongoSchema, schemas}) => {
    const {ObjectId} = mongoose.Types
    const queueJoi = joi.object({
        title: joi.string().required(), //ten hang doi
        isActive: joi.number().valid(0,1).default(0), // 0: nhận khách, 1: tạm thời k nhận thêm khách
        effect: joi.number().default(86400000), // hiệu lực, tạm thơi không xử lí để
        deleted: joi.number().valid(0,1).default(0)//  0: chưa xóa , 1: đã xóa
    })
    const queueSchema = joi2MongoSchema(queueJoi, {}, {
        createdAt: {
            type: Number,
            default: () => Date.now()
        }
    })
    queueSchema.statics.validateObj = async (obj, config = {}) => {
        return queueJoi.validate(obj, config)
    }
    const documentModel = mongoose.model('Queue', queueSchema)
    documentModel.syncIndexes()
    return documentModel

}

