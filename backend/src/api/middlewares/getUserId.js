const getCurrentUserId = async (req, res, next) => {
  const uId = req.cookies?.user?.id
  console.log(req.cookies.user)

  req.currentUserId = uId
  return next()
}

module.exports = getCurrentUserId
