
class User {
  constructor({fullName, email, password, role} = {}) {
    this.fullName = fullName
    this.email = email
    this.password = password
    this.createdAt = Date.now()
    this.currentRoleId = role
  }

  static create(data = {}) {
    return new User(data)
  }
}

module.exports = User
