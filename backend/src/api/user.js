const {Router} = require('express')
const route = Router()

module.exports = (app) => {
  app.use('/users', route)

  route.get('/me', async (req, res, next) => {
    const conn = req.app.locals.dbCon
    const uId = req.cookies?.user?.id

    if (!uId) return res.json({error: 'Not logged in'}).status(401)

    try {
      const data = await conn.query(`SELECT * from users where users.id = ${uId};`)
      const user = data[0]

      return res.json(user).status(200)
    } catch (err) {
      console.log(err)
      next(err)
    }
  })
}