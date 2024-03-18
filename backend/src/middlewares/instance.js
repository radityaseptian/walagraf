async function isInstanceOnline(req, res, next) {
  try {
    const { id } = req.query

    next()
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export { isInstanceOnline }
