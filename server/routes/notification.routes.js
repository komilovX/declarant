const passport = require('passport')
const { Router } = require('express')
const router = Router()

const {
  findAllById,
  createNotification,
  chageToWatched,
  deleteById,
} = require('../controller/notification.controller')

router.get('/', passport.authenticate('jwt', { session: false }), findAllById)

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  createNotification
)
router.put(
  '/',
  passport.authenticate('jwt', { session: false }),
  chageToWatched
)

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  deleteById
)

module.exports = router
