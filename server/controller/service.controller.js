const Services = require('../models/service.model')
const ServiceDocument = require('../models/service_documents.model')
// service
module.exports.getAllDocument = async (req, res) => {
  try {
    const documents = await ServiceDocument.findAll({
      raw: true,
      order: [['number', 'ASC']],
    })
    res.json(documents)
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}

module.exports.createDocument = async (req, res) => {
  try {
    const document = await ServiceDocument.create(req.body)
    res.json(document)
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}

module.exports.deleteDocument = async (req, res) => {
  try {
    await ServiceDocument.destroy({ where: { id: req.params.id } })
    res.json({})
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}
// //////////
module.exports.createService = async (req, res) => {
  const { order_id, name, number, comment, currency } = req.body
  const price = !!req.body.price ? req.body.price : 0
  try {
    const service = await Services.create({
      user_id: req.user.id,
      user: req.user.name,
      order_id,
      name,
      number,
      currency,
      comment,
      price,
      total_price: price,
    })
    res.json(service)
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}
// task
module.exports.giveTask = async (req, res) => {
  const { order_id, name, number, declarant, declarant_id } = req.body
  try {
    const service = await Services.create({
      user_id: declarant_id,
      user: declarant,
      order_id,
      name,
      number,
      from: req.user.name,
      status: 'task',
    })
    res.json(service)
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

module.exports.doTask = async (req, res) => {
  try {
    const { comment, currency } = req.body
    const price = !!req.body.price ? req.body.price : 0
    await Services.update(
      {
        price,
        total_price: price,
        comment,
        currency,
        status: 'done',
      },
      { where: { order_id: +req.params.id } }
    )
    res.json(result)
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
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

module.exports.findAllByUserId = async (req, res) => {
  try {
    const services = await Services.findAll({
      where: { user_id: +req.user.id },
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
    await Services.update(req.body, { where: { id: req.params.id } })
    res.json({})
  } catch (e) {
    res.status(500).json(e)
    console.log(e)
  }
}
