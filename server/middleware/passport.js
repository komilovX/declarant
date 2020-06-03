const { Strategy, ExtractJwt } = require('passport-jwt')
const keys = require('../keys')

const Users = require('../models/user.model')

const option = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.JWT,
}

module.exports = new Strategy(option, async (payload, done) => {
  try {
    const condidate = await Users.findByPk(+payload.userId)
    if (condidate) {
      done(null, condidate)
    } else {
      done(null, false)
    }
  } catch (e) {
    console.error(e)
  }
})
