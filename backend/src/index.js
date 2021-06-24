const ADODB = require('node-adodb')
const express = require('express')
const routes = require('./api')
const cookieParser = require('cookie-parser')

const app = express()
const expressPort = 3020

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(function (req, res, next) {
  const origin = req.headers.origin
  const allowed = [
    'http://localhost:3000',
    'http://localhost:3020',
    'http://127.0,0,1:3000',
    'http://localhost:5000',
  ]
  console.log(origin)
  if (allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-type, Origin, X-Requested-With, Content-Type, Accept'
  )
  res.setHeader('Content-type', 'application/json; charset=utf-8')
  res.setHeader('Access-Control-Expose-Headers', 'CurrentUser')
  res.header('Access-Control-Allow-Credentials', true)
  next()
})
app.use('/api', routes())

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.json({
    errors: {
      message: err.message,
    },
  })
})

const main = () => {
  const connection = ADODB.open(
    'Provider=Microsoft.ACE.OLEDB.15.0;Data Source=db/Database111.accdb;Persist Security Info=False;'
  )
  console.log(connection)

  app.locals.dbCon = connection

  app.listen(expressPort, function () {
    console.log('Express is running on port', expressPort)
  })
}

main()
