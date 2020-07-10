const { Router } = require('express')
const router = Router()
const passport = require('passport')
const Clients = require('../models/clients.model')

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const clients = await Clients.findAll({ raw: true })
      res.json(clients)
    } catch (r) {
      res.status(500).json(e)
    }
  }
)

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const client = await Clients.create({
        name: req.body.name,
      })
      res.json(client)
    } catch (r) {
      res.status(500).json(e)
    }
  }
)

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      await Clients.destroy({
        where: { id: req.params.id },
      })
      res.json({ message: 'deleted' })
    } catch (r) {
      res.status(500).json(e)
    }
  }
)
module.exports = router
