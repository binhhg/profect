module.exports = container => {
    const { schemas } = container.resolve('models')
    const { User } = schemas
    const addUser = (u) => {
        const user = new User(u)
        return user.save()
    }
    const login = ({
                       username,
                       password
                   }) => {
        return User.findOne({
            username,
            password
        }).select('-password')
    }
    const getUserById = (id) => {
        return User.findById(id).select('-password')
    }
    const getUserByUsername = username => {
        return User.findOne({ username }).select('-password')
    }
    const deleteUser = (id) => {
        return User.findByIdAndRemove(id, { useFindAndModify: false }).select('-password')
    }
    const updateUser = (id, user) => {
        return User.findByIdAndUpdate(id, user, {
            useFindAndModify: false,
            returnOriginal: false
        }).select('-password')
    }
    const checkIdExist = (id) => {
        return User.findOne({ id }).select('-password')
    }
    const getUser = async (pipe, limit, skip, sort = 1) => {
        const total = await User.countDocuments(pipe)
        const data = await User.find(pipe).limit(limit).skip(skip).sort({ _id: +sort ? 'desc' : 'asc' }).select('-password')
        return {
            total,
            data
        }
    }
    const findOne = (pipe) => {
        return User.findOne(pipe)
    }
    return {
        getUserByUsername,
        getUser,
        addUser,
        getUserById,
        deleteUser,
        updateUser,
        checkIdExist,
        login,
        findOne
    }
}
