module.exports = (app, container) => {
    const { userController } = container.resolve('controller')
    const { verifyAccessToken } = container.resolve('middleware')
    app.get("/user", userController.getUser)
    app.get("/user/logout", userController.logout)
    app.get("/user/refreshToken", userController.refreshToken)
    app.post('/user/login', userController.login)
    app.get("/user/:id", userController.getUserById)
    app.put("/user/changePassword", userController.changePassword)
    app.put("/user/:id", userController.updateUser)
    app.delete("/user/:id",verifyAccessToken, userController.deleteUser)
    app.post("/user",verifyAccessToken, userController.addUser)
}
