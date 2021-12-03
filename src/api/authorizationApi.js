module.exports = (app, container) => {
  const { authorizationController } = container.resolve('controller')
  app.post("/authorization", authorizationController.authorization)
}
