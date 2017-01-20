var fs = require('fs')
var http = require('http')
var Koa = require('koa')
var path = require('path')
var views = require('koa-views')
var convert = require('koa-convert')
var json = require('koa-json')
var Bodyparser = require('koa-bodyparser')
var logger = require('koa-logger')
var koaStatic = require('koa-static-plus')
var koaOnError = require('koa-onerror')
var mongoose = require("mongoose")


/**
 * Config
 */
var config = require('./config')
console.log(config)

/**
 * Connect to database
 */
const dbConfig = config.db
const dbUrl = `${dbConfig.type}://${dbConfig.host}/${dbConfig.database}`
mongoose.connect(dbUrl)
const db = mongoose.connection
// mongoose.connect(config.mongo.url);
db.on("error", function(err) {
  console.log(err);
});
db.once('open', function() {
  console.log("mongoDB connected!")
});
mongoose.Promise = Promise;

/**
 * Load the models
 */
// var Demo = require('./models/demo')

// const modelsPath = config.app.root + "/src/models";
// const modelsPath = path.join(__dirname, './models');
// // console.log(process.cwd())
// // console.log(__dirname)
// fs.readdirSync(modelsPath).forEach(function(file) {
//   if (~file.indexOf("js")) {
//     require(modelsPath + "/" + file);
//   }
// });

/**
 * Server
 */
const app = new Koa()
const bodyparser = Bodyparser()


// middlewares
app.use(convert(bodyparser))
app.use(convert(json()))
app.use(convert(logger()))

// static
app.use(convert(koaStatic(path.join(__dirname, '../public'), {
  pathPrefix: ''
})))

// // web
// app.use(convert(koaStatic(path.join(__dirname, '../app/web'), {
//   pathPrefix: '/web'
// })))

// // views
// app.use(views(path.join(__dirname, '../views'), {
//   extension: 'jade'
// }))

// 500 error
koaOnError(app, {
  json: JSON.stringify({status:500,messages:"We're sorry, but something went wrong (500)"})
})

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// response router
app.use(async (ctx, next) => {
  await require('./routes').routes()(ctx, next)
})

// 404
app.use((ctx) => {
  ctx.status = 404
  ctx.body = JSON.stringify({status:404,messages:"The API you were looking for doesn't exist (404)"})
})

// error logger
app.on('error', async (err, ctx) => {
  console.log('error occured:', err)
})

const port = parseInt(config.port || '3000')
const server = http.createServer(app.callback())

server.listen(port)
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(port + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(port + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
})
server.on('listening', () => {
  console.log('Listening on port: %d', port)
})

process.on('uncaughtException', function(err) {
  console.error('Unexpected exception: ' + err)
  console.error('Unexpected exception stack: ' + err.stack)
  // Do something here: 
  // Such as send a email to admin 
  // process.exit(1)
})
module.exports = app
