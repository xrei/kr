const {v4: uuidv4} = require('uuid')

class Product {
  constructor({courseId} = {}) {
    this.created_at = new Date().toISOString().replace('T', ' ').slice(0, -5)
    this.course_id = courseId
    this.uid = this.genUid()
  }

  static create(data = {}) {
    return new Product(data)
  }

  genUid() {
    let uid = Buffer.from(uuidv4().replace('-', ''), 'hex').toString('base64')

    return uid
  }
}

module.exports = Product
