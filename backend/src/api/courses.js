const {Router} = require('express')
const getCurrentUserId = require('./middlewares/getUserId')
const Course = require('../models/course')
const CourseLesson = require('../models/courseLesson')
const Product = require('../models/product')
const {createInsertQuery, createUpdateQuery} = require('../lib/sqlBuilder')
const route = Router()

module.exports = (app) => {
  app.use('/courses', route)

  // all published courses
  route.get('/list', async (req, res, next) => {
    const conn = req.app.locals.dbCon
    try {
      const data = await conn.query(
        `SELECT p.*, c.title, c.description, c.status, c.price, 
        (SELECT u.full_name FROM users AS u WHERE u.id = c.created_by) AS author_name,
        (SELECT u.email FROM users AS u WHERE u.id = c.created_by) AS author_email
        FROM products AS p 
        INNER JOIN courses AS c ON p.course_id = c.id
        WHERE c.status = 'published';
        `
      )

      return res.json(data).status(200)
    } catch (err) {
      console.log(err)
      next(err)
    }
  })

  // get course product by id
  route.get('/:id', async (req, res, next) => {
    const id = +req.params.id
    const conn = req.app.locals.dbCon

    if (!id) return res.status(404).json('Not found')

    try {
      const data = await conn.query(`
        SELECT p.*, u.full_name AS author_name, u.email AS author_email, c.title, c.description, c.status, c.price
        FROM ((products AS p)
        LEFT JOIN courses AS c ON c.id = p.course_id)
        LEFT JOIN users AS u ON u.id = c.created_by
        WHERE c.id = ${id}
      `)

      if (!data[0]) return res.status(404).json({message: 'Course with provided id not found'})

      return res.json(data[0]).status(200)
    } catch (err) {
      console.log(err)
      next(err)
    }
  })

  // all author courses
  route.get('/author/:id', async (req, res, next) => {
    const id = +req.params.id
    if (!id) return res.status(404).json('Not found')

    const conn = req.app.locals.dbCon
    try {
      const data = await conn.query(
        `SELECT p.*, c.title, c.description, c.status, c.price, 
        (SELECT u.full_name FROM users AS u WHERE u.id = c.created_by) AS author_name,
        (SELECT u.email FROM users AS u WHERE u.id = c.created_by) AS author_email
        FROM products AS p 
        INNER JOIN courses AS c ON p.course_id = c.id
        WHERE c.created_by = ${id};
        `
      )

      return res.json(data).status(200)
    } catch (err) {
      console.log(err)
      next(err)
    }
  })
  // create new course
  route.post('/', getCurrentUserId, async (req, res, next) => {
    // stupid checks yep
    if (!req.currentUserId) return res.status(403).json({message: 'Access denied'})
    if (!req.body) return res.status(400)

    const conn = req.app.locals.dbCon

    const {title, description, price} = req.body

    const courseData = Course.create({
      title,
      description,
      price,
      // from middleware 'getCurrentUserId'
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
      const courseId = data[0]?.id

      await conn.execute(createInsertQuery({table: 'products', data: Product.create({courseId})}))

      const newCourse = await conn.query(`
        SELECT c.*, u.email AS author_email, u.full_name AS author_name, p.uid
        FROM ((courses AS c)
        LEFT JOIN users AS u ON u.id = c.created_by)
        LEFT JOIN products AS p ON p.course_id = c.id
        WHERE c.id = ${courseId}
      `)
      return res.json(newCourse[0])
    } catch (err) {
      console.log(err)
      next(err)
    }
  })
  route.patch('/:courseId', getCurrentUserId, async (req, res, next) => {
    if (!req.body) return res.status(400)
    // stupid checks yep
    if (!req.currentUserId) return res.status(403).json({message: 'Access denied'})
    const courseId = +req.params.courseId
    if (!courseId) return res.status(404).json({message: 'Course with provided id not found'})

    const {title, description, price} = req.body
    const conn = req.app.locals.dbCon
    try {
      const data = await conn.execute(
        createUpdateQuery({
          table: 'courses',
          data: omit({title, description, price}),
          conditions: {id: courseId},
        })
      )
      const updated = await conn.query(`SELECT * FROM courses AS c WHERE c.id = ${courseId}`)

      return res.json(updated[0]).status(200)
    } catch (err) {
      console.log(err)
      next(err)
    }
  })
  // publish draft course
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
  // unpublish course
  route.patch('/:courseId/unpublish', getCurrentUserId, async (req, res, next) => {
    // stupid checks yep
    if (!req.currentUserId) return res.status(403).json({message: 'Access denied'})
    const courseId = +req.params.courseId
    if (!courseId) return res.status(404).json({message: 'Course with provided id not found'})

    const conn = req.app.locals.dbCon
    try {
      await conn.execute(`UPDATE courses AS c SET status = 'draft' WHERE c.id = ${courseId}`)
      const updated = await conn.query(`SELECT * FROM courses WHERE courses.id = ${courseId}`)

      return res.json(updated[0])
    } catch (err) {
      console.log(err)
      next(err)
    }
  })

  // LESSONS
  // create lesson into course
  route.post('/:courseId/lessons/', getCurrentUserId, async (req, res, next) => {
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
  // list of course lessons
  route.get('/:courseId/lessons/list', getCurrentUserId, async (req, res, next) => {
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
  route.patch('/:courseId/lessons/:lessonId', getCurrentUserId, async (req, res, next) => {
    // stupid checks yep
    if (!req.currentUserId) return res.status(403).json({message: 'Access denied'})
    const courseId = +req.params.courseId
    const lessonId = +req.params.lessonId
    if (!courseId && !lessonId)
      return res.status(404).json({message: 'Course with provided id not found'})
    if (!req.body) return res.status(422).json({message: 'bad'})
    const {title, content, price} = req.body

    const conn = req.app.locals.dbCon

    try {
      const data = await conn.execute(
        createUpdateQuery({
          table: 'course_lessons',
          data: omit({title, content}),
          conditions: {id: lessonId, course_id: courseId},
        })
      )
      const updated = await conn.query(
        `SELECT * FROM course_lessons AS cl WHERE cl.id = ${lessonId}`
      )

      return res.json(updated[0]).status(200)
    } catch (err) {
      console.log(err)
      next(err)
    }
  })
  // delete lesson
  route.delete('/:courseId/lessons/:lessonId', getCurrentUserId, async (req, res, next) => {
    if (!req.currentUserId) return res.status(403).json({message: 'Access denied'})
    const courseId = +req.params.courseId
    const lessonId = +req.params.lessonId
    if (!courseId && !lessonId)
      return res.status(404).json({message: 'Course with provided id not found'})

    const conn = req.app.locals.dbCon

    try {
      await conn.execute(
        `DELETE FROM course_lessons AS cl WHERE cl.course_id = ${courseId} AND cl.id = ${lessonId}`
      )

      return res.json({ok: 1}).status(200)
    } catch (err) {
      console.log(err)
      next(err)
    }
  })
}

function omit(o) {
  let clone = {...o}
  Object.keys(clone).forEach((key) => clone[key] === undefined && delete clone[key])
  return clone
}
