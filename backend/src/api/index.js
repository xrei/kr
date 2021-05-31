const {Router} = require('express')
const auth = require('./auth')
const user = require('./user')
const courses = require('./courses')

module.exports = () => {
  const app = Router()

  auth(app)
  user(app)
  courses(app)

  return app
}