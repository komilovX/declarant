const Documents = require('../models/documents.model')

module.exports.findAll = async (req, res) => {
  try {
    const type = req.query.type
    if (type) {
      const documents = await Documents.findAll({ where: { type }, raw: true })
      res.json(documents)
    } else {
      const documents = await Documents.findAll({ raw: true })
      res.json(documents)
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.createDocument = async (req, res) => {
  try {
    const document = await Documents.create(req.body)
    res.status(201).json(document)
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.deleteById = async (req, res) => {
  try {
    await Documents.destroy({
      where: { id: +req.params.id },
    })
    res.json({})
  } catch (e) {
    res.status(500).json(e)
  }
}
