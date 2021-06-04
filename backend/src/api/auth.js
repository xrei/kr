const {Router, Request, Response} = require('express')
const route = Router()

module.exports = (app) => {
  app.use('/auth', route)

  route.post('/signin', async (req, res, next) => {
    const conn = req.app.locals.dbCon
    const {email = 'rei@rei.com', password = 'kek'} = req.body || {}

    try {
      // the best security of all time
      const query = `
      SELECT users.id, users.full_name, users.email, r.role_name AS role
      FROM users
      LEFT JOIN role AS r ON r.id = users.current_role_id
      WHERE users.password = '${password}' AND users.email = '${email}';
      `
      const data = await conn.query(query)
      const user = data[0]

      if (!user) return res.status(403)

      res.set('CurrentUser', user.id)
      res.cookie('user', user, {
        maxAge: 365000 * 60 * 120,
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
      })
      return res.json(user).status(200)
    } catch (err) {
      console.log(err)
      next(err)
    }
  })
}
