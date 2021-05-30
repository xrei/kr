
class Course {
  constructor({title, description, createdBy, status} = {}) {
    this.title = title
    this.description = description
    this.created_by = createdBy
    this.created_at = new Date().toISOString().replace('T', ' ').slice(0, -5)
    this.status = status
  }

  static create(data = {}) {
    return new Course(data)
  }
}

module.exports = Course
