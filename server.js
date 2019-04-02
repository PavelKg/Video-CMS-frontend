const cors = require('cors')
const express = require('express')
const history = require('connect-history-api-fallback')

const mode = process.env.NODE_ENV

//console.log(process.env);

let TYPESERVER = 'http'
let PORT = process.env.NODE_PORT
let HOST = 'localhost'

// RUN SERVER

const app = express()
app.use(cors())
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.use(
  history({
    verbose: true
  })
)

app.use(express.static('dist'))
require(TYPESERVER)
  .createServer(app)
  .listen(PORT, HOST)

console.log(`Start SERVER on ${mode} mode and on the ${HOST}:${PORT}`)
