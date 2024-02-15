const { User } = require("../models/index");

module.exports = async function (data, done) {
    try {
      let user, created;
      if (data.email === process.env.USER_ADMIN) {
        user = data
      } else if (data.provider !== "local") {
        [user, created] = await User.findOrCreate({
          where: { email: data.email },
          defaults: { 
            name: data.displayName, 
            email: data.email
          }
        });
      } else {
        user = await User.findByPk(data.id);
      }
      
      done(null, user);
      } catch (err) {
          done(err);
      }
}