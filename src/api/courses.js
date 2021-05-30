const {Router} = require('express')
const getCurrentUserId = require('./middlewares/getUserId')
const Course = require('../models/course')
const CourseLesson = require('../models/courseLesson')
const {createInsertQuery} = require('../lib/sqlMapper')
const route = Router()

module.exports = (app) => {
  app.use('/courses', route)

  // all published courses
  route.get('/list', async (req, res, next) => {
    const conn = req.app.locals.dbCon
    try {
      const data = await conn.query(
        `SELECT p.* from products AS p LEFT JOIN courses AS c ON p.course_id = c.id ORDER BY c.id;`
      )

      return res.json(data).status(200)
    } catch (err) {
      console.log(err)
      next(err)
    }
  })

  route.get('/:id', async (req, res, next) => {
    const id = +req.params.id
    const conn = req.app.locals.dbCon

    if (!id) return res.status(404).json('Not found')

    try {
      const data = await conn.query(`SELECT * FROM courses WHERE courses.id=${id}; `)

      if (!data[0]) return res.status(404).json({message: 'Course with provided id not found'})

      return res.json({course: data[0]}).status(200)
    } catch (err) {
      console.log(err)
      next(err)
    }
  })

  route.post('/', getCurrentUserId, async (req, res, next) => {
    // stupid checks yep
    if (!req.currentUserId) return res.status(403).json({message: 'Access denied'})
    if (!req.body) return res.status(400)

    const conn = req.app.locals.dbCon

    const {title, description} = req.body

    const courseData = Course.create({
      title,
      description,
      // from middleware 'getUserId'
      createdBy: req.currentUserId,
      status: 'draft',
    })
    console.log(courseData)

    try {
      console.log(createInsertQuery({table: 'courses', data: courseData}))
      const data = await conn.execute(
        createInsertQuery({table: 'courses', data: courseData}),
        `SELECT @@Identity as id`
      )
      console.log(data)
      const newCourse = await conn.query(`SELECT * FROM courses WHERE courses.id = ${data[0]?.id}`)

      return res.json(newCourse[0])
    } catch (err) {
      console.log(err)
      next(err)
    }
  })

  route.patch('/:courseId/publish', getCurrentUserId, async (req, res, next) => {
    // stupid checks yep
    if (!req.currentUserId) return res.status(403).json({message: 'Access denied'})
    const courseId = +req.params.courseId
    if (!courseId) return res.status(404).json({message: 'Course with provided id not found'})

    const conn = req.app.locals.dbCon
    try {
      await conn.execute(`UPDATE courses AS c SET status = 'published' WHERE c.id = ${courseId}`)
      const updated = await conn.query(`SELECT * FROM courses WHERE courses.id = ${courseId}`)

      return res.json(updated[0])
    } catch (err) {
      console.log(err)
      next(err)
    }
  })

  // LESSONS
  // create lesson into course
  route.post('/lessons/:courseId/', getCurrentUserId, async (req, res, next) => {
    // stupid checks yep
    if (!req.currentUserId) return res.status(403).json({message: 'Access denied'})
    const courseId = +req.params.courseId
    if (!courseId) return res.status(404).json({message: 'Course with provided id not found'})
    if (!req.body) return res.status(422).json({message: 'bad'})
    const {title, content} = req.body

    const conn = req.app.locals.dbCon
    const newLesson = CourseLesson.create({
      title,
      content,
      courseId,
      createdBy: req.currentUserId,
    })

    try {
      const data = await conn.execute(
        createInsertQuery({table: 'course_lessons', data: newLesson}),
        `SELECT @@Identity as id`
      )
      const createdLesson = await conn.query(
        `SELECT * FROM course_lessons AS cl WHERE cl.id = ${data[0]?.id}`
      )

      return res.json(createdLesson[0]).status(200)
    } catch (err) {
      console.log(err)
      next(err)
    }
  })
  // list lessons from course
  route.get('/lessons/:courseId/list', getCurrentUserId, async (req, res, next) => {
    const courseId = +req.params.courseId
    if (!courseId) return res.status(404).json({message: 'Course with provided id not found'})

    const conn = req.app.locals.dbCon

    try {
      const data = await conn.query(
        `SELECT * FROM course_lessons AS cl WHERE cl.course_id = ${courseId}`
      )
      console.log(data)

      return res.json(data).status(200)
    } catch (err) {
      console.log(err)
      next(err)
    }
  })
}
