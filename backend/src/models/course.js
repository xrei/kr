class Course {
  constructor({id, title, description, createdBy, status, createdAt, price} = {}) {
    const createdAtNew = new Date().toISOString().replace('T', ' ').slice(0, -5)

    this.title = title
    this.description = description
    this.created_by = createdBy
    this.created_at = createdAt || createdAtNew
    this.status = status
    this.price = price

    if (id) {
      this.id = id
    }
  }

  static create(data = {}) {
    return new Course(data)
  }
}

module.exports = Course
