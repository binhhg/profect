module.exports = (app, container) => {
    const { checkAccessToken} = container.resolve('middleware')
    require('./qrApi')(app, container)
    app.use(checkAccessToken)
    require('./userApi')(app, container)
    require('./queueApi')(app, container)
    require('./authorizationApi')(app, container)

}
