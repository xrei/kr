class CourseLesson {
  constructor({title, content, createdBy, courseId} = {}) {
    this.title = title
    this.content = content
    this.created_by = createdBy
    this.created_at = new Date().toISOString().replace('T', ' ').slice(0, -5)
    this.course_id = courseId
  }

  static create(data = {}) {
    return new CourseLesson(data)
  }
}

module.exports = CourseLesson
