const Notifications = require('../models/notifications.model')
const Users = require('../models/user.model')

module.exports.findAllById = async (req, res) => {
  try {
    const notifications = await Notifications.findAll({
      where: { user_id: req.user.id },
      order: [['id', 'DESC']],
    })
    res.json(notifications)
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.createNotification = async (req, res) => {
  try {
    const { user_id, type = '', content = '' } = req.body
    if (type == 'declarant') {
      const declarants = await Users.findAll({
        where: { role: 'declarant' },
        raw: true,
      })
      declarants.forEach(async (declarant) => {
        await Notifications.create({
          user_id: declarant.id,
          content,
        })
      })
    } else {
      await Notifications.create({
        user_id,
        content,
      })
    }
    res.json({ message: 'OK' })
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.chageToWatched = async (req, res) => {
  try {
    await Notifications.update(
      { watched: true },
      { where: { user_id: req.user.id } }
    )
    res.json({ message: 'OK' })
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.deleteById = async (req, res) => {
  try {
    await Notifications.destroy({ where: { id: req.params.id } })
    res.json({ message: 'deleted' })
  } catch (e) {
    res.status(500).json(e)
  }
}
