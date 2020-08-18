const Op = require('sequelize').Op

const Orders = require('../models/orders.model')
const IncomingOrders = require('../models/incoming_documents.model')
const DecoratedOrders = require('../models/decorated_documents.model')
const DeclarantOrders = require('../models/declarant_documents.model')
const Documents = require('../models/documents.model')

module.exports.createOrder = async (req, res) => {
  try {
    const file = req.files.file
    const files = req.files.files
    const {
      date,
      client_company,
      product,
      client,
      declarant,
      inv,
      inv_price,
      container,
      post_number,
    } = req.body

    const order = await Orders.create({
      creator: req.user.name,
      creator_id: req.user.id,
      date: new Date(date),
      inv,
      inv_price,
      inv_file: file ? file[0].filename : null,
      client_company,
      container,
      post_number,
      product,
      client,
      declarant,
    })

    const incomingDocuments = JSON.parse(req.body.fileDocuments)
    var counter = -1

    incomingDocuments.forEach(async (f, index) => {
      await IncomingOrders.create({
        order_id: order.id,
        number: f.number,
        name: f.name,
        file: !!f.file ? files[++counter].filename : null,
      })
    })
    res.json(order)
  } catch (e) {
    console.log('e', e)
    res.status(500).json(e)
  }
}

module.exports.findAll = async (req, res) => {
  try {
    let daysCount = new Date(new Date().getTime() - 90 * 24 * 60 * 60 * 1000)
    if (req.query.client) {
      const orders = await Orders.findAll({
        raw: true,
        where: {
          client_id: +req.user.id,
          status: 'done',
          date: { [Op.gte]: daysCount },
        },
        order: [['id', 'DESC']],
      })

      res.json(orders)
    } else if (req.query.archive) {
      const orders = await Orders.findAll({
        raw: true,
        where: {
          date: { [Op.gte]: daysCount },
          status: 'done',
        },
        order: [['id', 'DESC']],
      })
      res.json(orders)
    } else {
      const orders = await Orders.findAll({
        raw: true,
        where: {
          date: { [Op.gte]: daysCount },
          status: 'active',
        },
        order: [['id', 'DESC']],
      })
      res.json(orders)
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.findById = async (req, res) => {
  try {
    const order = await Orders.findByPk(+req.params.id)
    const incoming_documents = await IncomingOrders.findAll({
      where: { order_id: +req.params.id },
      raw: true,
    })
    res.json({ order, incoming_documents })
  } catch (e) {
    console.log(e)
  }
}
module.exports.findByIdWithDetails = async (req, res) => {
  try {
    const order = await Orders.findByPk(+req.params.id)
    const incoming_documents = await IncomingOrders.findAll({
      where: { order_id: +req.params.id },
      raw: true,
    })
    const declarant_documents = await DeclarantOrders.findAll({
      where: { order_id: +req.params.id },
      raw: true,
    })
    const decorated_documents = await DecoratedOrders.findAll({
      where: { order_id: +req.params.id },
      raw: true,
    })
    res.json({
      order,
      incoming_documents,
      declarant_documents,
      decorated_documents,
    })
  } catch (e) {
    console.log(e)
  }
}

module.exports.updateOrderById = async (req, res) => {
  try {
    await Orders.update(
      {
        inv_file: req.file ? req.file.filename : null,
        ...req.body,
      },
      { where: { id: req.params.id } }
    )
    const document = await IncomingOrders.findByPk(+req.params.id)
    res.json(document)
  } catch (e) {
    console.log(e)
  }
}

module.exports.deleteOrderById = async (req, res) => {
  try {
    await Orders.update({ deleted: true }, { where: { id: req.params.id } })
    res.json({ message: 'updated' })
  } catch (e) {
    console.log(e)
  }
}

module.exports.changeStatus = async (req, res) => {
  try {
    await Orders.update(
      { status: req.body.status },
      { where: { id: req.params.id } }
    )
    res.json({ message: 'updated' })
  } catch (e) {
    console.log(e)
  }
}
// //////////////////////////////////////////
// Icoming Documents
module.exports.updateIncomingOrderFile = async (req, res) => {
  try {
    await IncomingOrders.update(
      {
        file: req.file.filename,
      },
      { where: { id: req.params.id } }
    )
    const document = await IncomingOrders.findByPk(+req.params.id)
    res.json(document)
  } catch (e) {
    console.log(e)
  }
}

module.exports.addIncomingDocument = async (req, res) => {
  try {
    const { number, name } = req.body
    const document = await IncomingOrders.create({
      order_id: req.params.id,
      number: number,
      name: name,
      file: !!req.file ? req.file.filename : null,
    })
    res.json(document)
  } catch (e) {
    console.log(e)
  }
}

/////////////////////////////////////////////////////////////////
////////////// Declarant Documents /////////////////////////////
module.exports.addDeclarantDocuments = async (req, res) => {
  try {
    const { name, number, comment, currency } = req.body
    const price = !!req.body.price ? req.body.price : 0
    const file = req.file ? req.file.filename : req.body.file_name || null
    const result = await DeclarantOrders.create({
      order_id: +req.params.id,
      name,
      number,
      declarant_id: req.user.id,
      declarant: req.user.name,
      price,
      total_price: price,
      comment,
      currency,
      file,
    })
    res.json(result)
    await updateOrderPercent(+req.params.id)
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

module.exports.giveTask = async (req, res) => {
  try {
    const { order_id, name, number, declarant, declarant_id } = req.body
    const result = await DeclarantOrders.create({
      order_id,
      name,
      number,
      declarant_id,
      declarant,
      from: req.user.name,
      status: 'task',
    })
    res.json(result)
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

module.exports.doTask = async (req, res) => {
  try {
    const { comment, currency } = req.body
    const price = !!req.body.price ? req.body.price : 0
    await DeclarantOrders.update(
      {
        price,
        total_price: price,
        comment,
        currency,
        file: req.file ? req.file.filename : null,
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

module.exports.deleteDeclarantDocument = async (req, res) => {
  try {
    const document = await DeclarantOrders.findByPk(+req.params.id)
    await DeclarantOrders.destroy({
      where: { id: +req.params.id },
    })
    res.send('OK')
    await updateOrderPercent(document.order_id)
  } catch (e) {
    console.log(e)
  }
}

module.exports.updateDeclarantDocumentById = async (req, res) => {
  try {
    if (req.file) {
      await DeclarantOrders.update(
        {
          file: req.file.filename,
          ...req.body,
        },
        {
          where: { id: +req.params.id },
        }
      )
    } else {
      await DeclarantOrders.update(req.body, {
        where: { id: +req.params.id },
      })
    }
    let result = await DeclarantOrders.findByPk(+req.params.id)
    res.json(result)
    if (!req.query.file) {
      await updateOrderPercent(result.order_id)
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.findDeclarantDocumentsById = async (req, res) => {
  try {
    const orders = await DeclarantOrders.findAll({
      where: { declarant_id: req.user.id },
      raw: true,
    })
    res.json(orders)
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

module.exports.findDeclarantDocumentsByOrderId = async (req, res) => {
  try {
    const result = await DeclarantOrders.findAll({
      where: { order_id: req.params.id },
      raw: true,
    })
    res.json(result)
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

async function updateOrderPercent(order_id) {
  try {
    const documents = await Documents.findAll({
      where: { type: 'declarant' },
      raw: true,
    })
    const orderDocuments = await DeclarantOrders.findAll({
      raw: true,
      where: { order_id },
    })
    const percent = (orderDocuments.length / documents.length) * 100
    await Orders.update(
      {
        percent,
      },
      { where: { id: order_id } }
    )
  } catch (e) {
    throw e
  }
}

// Decorated Documents
// api/orders/decorated/id
module.exports.addDecoratedDocuments = async (req, res) => {
  try {
    /* Oldin kop dokumentla qo'shilgan hamma dokumentla documents da kegan
      req.body.documents
      hozir bitta bitta qo'shilganiga o'zgardi
    */
    const { name, number } = req.body
    const document = await DecoratedOrders.create({
      order_id: +req.params.id,
      creator_id: req.user.id,
      name: name,
      number: number,
      file: req.file ? req.file.filename : null,
    })
    res.json(document)
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

module.exports.updateDecoratedDocumentFile = async (req, res) => {
  try {
    await DecoratedOrders.update(
      {
        file: req.file.filename,
      },
      { where: { id: req.params.id } }
    )
    const document = await DecoratedOrders.findByPk(+req.params.id)
    res.json(document)
  } catch (e) {
    console.log(e)
  }
}
module.exports.deleteDecoratedDocument = async (req, res) => {
  try {
    await DecoratedOrders.destroy({
      where: { id: +req.params.id },
    })
    res.send('OK')
  } catch (e) {
    console.log(e)
  }
}

module.exports.findDecoratedDocumentsByOrderId = async (req, res) => {
  try {
    const result = await DecoratedOrders.findAll({
      where: { order_id: req.params.id },
      raw: true,
    })
    res.json(result)
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}
