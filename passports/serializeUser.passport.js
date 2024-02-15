module.exports = function (data, done) {
    // Kiểm tra xem user.id có tồn tại không
    if (data) {
      done(null, data);
    } else {
        done(new Error('User or user id not found'));
    }
  }