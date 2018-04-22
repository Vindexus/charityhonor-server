module.exports = function (promise, done) {
  promise.then((result) => {
    done(null, result)
  }).catch((err) => {
    done(err)
  })
}
