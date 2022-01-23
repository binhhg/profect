module.exports = (joi, mongoose, {joi2MongoSchema, schemas}) => {
    const {ObjectId} = mongoose.Types
    const userJoi = joi.object({
        name:joi.string().required(),
        username: joi.string().required(),
        activate: joi.number().default(0),
        password: joi.string().min(6).required(),
        isAdministrator: joi.number().valid(0, 1).default(0), // cho nhân viên với admin, khach k can dang nhap
    })
    const userSchema = joi2MongoSchema(userJoi, {
        username: {
            type: String,
            unique: true,
            lowercase: true,
            index: true
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
    const documentModel = mongoose.model('User', userSchema)
    documentModel.syncIndexes()
    return documentModel

}

