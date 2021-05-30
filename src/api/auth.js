const { Router, Request, Response } = require('express')
const route = Router()

module.exports = (app) => {
  app.use('/auth', route)

  route.post('/signin', async (req, res, next) => {
    const conn = req.app.locals.dbCon
    const {fullName, email, password} = req.body || {}

    try {
      // the best security of all time
      const query = `SELECT * from users WHERE users.password = '${password}' AND users.full_name = '${fullName}'`
      const data = await conn.query(query)
      const user = data[0]

      if (!user) return res.status(403)

      res.set('CurrentUser', user.id)
      res.cookie('user', user, {maxAge: 365000 * 60 * 120})
      return res.json({ user: user }).status(200)
    } catch (err) {
      console.log(err)
      next(err)
    }
  })
}