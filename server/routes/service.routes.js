const { Router } = require('express')
const router = Router()
const passport = require('passport')
const {
  creatCervice,
  findByUserAndOrder,
  findAllByOrderId,
  deleteById,
  updateServiceById
} = require('../controller/service.controller')

// api/services

router.post('/', passport.authenticate('jwt', { session: false }), creatCervice)

router.get(
  '/user/:id',
  passport.authenticate('jwt', { session: false }),
  findByUserAndOrder
)
router.get(
  '/order/:id',
  passport.authenticate('jwt', { session: false }),
  findAllByOrderId
)

router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  updateServiceById
)

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  deleteById
)
module.exports = router
