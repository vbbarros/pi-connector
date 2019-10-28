const express = require('express')
const http = require('http')
const routes = require('./routes')

const port = process.env.PORT || 3333

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.set('port', port)

app.use('/', routes)

const server = http.createServer(app)

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.log(`[HTTP] Porta ${port} requer privilégio`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.log(`[HTTP] Porta ${port} já em uso`)
      process.exit(1)
      break
    default:
      throw error
  }
}

const onListening = () => {
  let addr = server.address()
  console.log(`[HTTP] Servidor iniciado em ${addr.port}`)
}

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)


module.exports = app