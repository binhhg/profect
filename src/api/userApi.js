module.exports = (app, container) => {
    const {userController} = container.resolve('controller')
    const {checkAdmin} = container.resolve('middleware')

    /**
     * @swagger
     * components:
     *   schemas:
     *     User:
     *       type: object
     *       required:
     *         - name
     *         - username
     *         - password
     *       properties:
     *         _id:
     *           type: ObjectId
     *           description: id của CSDL mongodb
     *         name:
     *           type: String
     *           description: Tên của người dùng
     *         username:
     *           type: String
     *           description: Tên đăng nhập
     *         password:
     *           type: String
     *           description: Mật khẩu
     *         isAdministrator:
     *           type: Number
     *           description: Nhân một trong hai giá trị 1 là admin và 0 là nhân viên
     *       example:
     *         id: 61d117ef27bd9766c0d7b948
     *         name: Binhpt
     *         username: binhhg
     *         password: 123456
     *         isAdministrator: 1
     */

    /**
     * @swagger
     * /user:
     *   get:
     *     summary: trả về danh sách người dùng
     *     tags: [User]
     *     security:
     *      - jwt: [bearer]
     *     responses:
     *       200:
     *         description: danh sách người dung
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               example:
     *                  [
     *                   {
     *                        id: 61d117ef27bd9766c0d7b948,
     *                        name: Binhpt,
     *                        username: binhhg,
     *                        password: 123456,
     *                        isAdministrator: 1
     *                   }
     *                  ]
     *
     *
     */
    app.get("/user", userController.getUser)

    /**
     * @swagger
     * /user/login:
     *   post:
     *     summary: user đăng nhập với username/password
     *     tags: [User]
     *     requestBody:
     *       required: true
     *       type: object
     *       content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  example:
     *                      {
     *                          username: 'binhhg',
     *                          password: '123456'
     *                      }
     *     responses:
     *       200:
     *         description: SUCCESS
     *
     *       400:
     *         description: BAD_REQUEST
     */
    app.post('/user/login', userController.login)


    app.get("/user/logout", userController.logout)
    app.get("/user/refreshToken", userController.refreshToken)
    app.get("/user/:id", userController.getUserById)
    app.put("/user/changePassword", userController.changePassword)
    app.put("/user/:id", userController.updateUser)
    app.delete("/user/:id", checkAdmin, userController.deleteUser)
    app.post("/user", checkAdmin, userController.addUser)
}


