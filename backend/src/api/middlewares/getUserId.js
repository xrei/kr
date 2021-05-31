const getCurrentUserId = async (req, res, next) => {
  const uId = req.cookies?.user?.id

  req.currentUserId = uId
  return next()
}

module.exports = getCurrentUserId