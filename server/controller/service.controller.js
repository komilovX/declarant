const Services = require('../models/service.model')

module.exports.creatCervice = async (req, res) => {
  try {
    const service = await Services.create({ user_id: req.user.id, user: req.user.name, ...req.body })
    res.json(service)
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}

module.exports.findByUserAndOrder = async (req, res) => {
  try {
    const services = await Services.findAll({
      where: { order_id: +req.params.id, user_id: req.user.id },
      raw: true,
    })
    res.json(services)
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}
module.exports.findAllByOrderId = async (req, res) => {
  try {
    const services = await Services.findAll({
      where: { order_id: +req.params.id },
      raw: true,
    })
    res.json(services)
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}

module.exports.deleteById = async (req, res) => {
  try {
    await Services.destroy({
      where: { id: req.params.id },
    })
    res.json({})
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}

module.exports.updateServiceById = async (req, res) => {
  try {
    await Services.update( req.body,
      { where: {id: req.params.id} }
    )
    res.json({})
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}
