const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const bodyParser = require('body-parser')
const session = require('express-session')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const api = require('../api')
const start = (container) => {
  return new Promise((resolve, reject) => {

    const options = {
      swaggerDefinition: {
        openapi: "3.0.0",
        info: {
          title: "Library API",
          version: "1.0.0",
          description: "A simple Express Library API",
        },
        components: {
          securitySchemes: {
            jwt: {
              type: "http",
              scheme: "bearer",
              in: "header",
              name: "x-access-token",
              bearerFormat: "JWT"
            },
          }
        }
        ,
        security: [{
          jwt: []
        }],
        servers: [
          {
            url: "http://localhost:8009",
          },
        ],
      },
      apis: ["src/api/*.js"],
    };
    const specs = swaggerJsDoc(options)

    const { serverSettings } = container.resolve('config')
    const { port } = serverSettings
    if (!port) {
      reject(new Error('The server must be started with an available port'))
    }
    const app = express()
    morgan.token('body', function (req) { return JSON.stringify(req.body) })
    app.use('/api-docs', swaggerUI.serve,swaggerUI.setup(specs))

    app.use(session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: {secure: false, maxAge: 86400000}
    }))
    app.use(morgan(':method :url :remote-addr :status :response-time ms - :res[content-length] :body - :req[content-length]'))
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(helmet())
    app.use(cors())
    app.use((err, req, res, next) => {
      reject(new Error('Something went wrong!, err:' + err))
      res.status(500).send('Something went wrong!')
      return next()
    })
    api(app, container)
    const server = app.listen(port, () => resolve(server))
  })
}
module.exports = { start }
