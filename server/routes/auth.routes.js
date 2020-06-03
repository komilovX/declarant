const passport = require('passport')
const { Router } = require('express')
const router = Router()

const {
  createUser,
  loginSystem,
  findAll,
  getById,
  updateById,
  deleteById,
  findAllClients,
  findAllDeclarants,
} = require('../controller/auth.controller')

router.post('/login', loginSystem)
router.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  createUser
)
router.get('/users', passport.authenticate('jwt', { session: false }), findAll)
router.get(
  '/users/clients',
  passport.authenticate('jwt', { session: false }),
  findAllClients
)
router.get(
  '/users/declarants',
  passport.authenticate('jwt', { session: false }),
  findAllDeclarants
)

router.get(
  '/user/:id',
  passport.authenticate('jwt', { session: false }),
  getById
)
router.put(
  '/user/:id',
  passport.authenticate('jwt', { session: false }),
  updateById
)
router.delete(
  '/user/:id',
  passport.authenticate('jwt', { session: false }),
  deleteById
)

module.exports = router
