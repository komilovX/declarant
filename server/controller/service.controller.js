const Services = require("../models/service.model");
const ServiceDocument = require("../models/service_documents.model");
// service
module.exports.getAllDocument = async (req, res) => {
  try {
    const documents = await ServiceDocument.findAll({ raw: true });
    res.json(documents);
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
};

module.exports.createDocument = async (req, res) => {
  try {
    const { number, name } = req.body;

    const document = await ServiceDocument.create({
      number,
      name,
    });
    res.json(document);
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
};

module.exports.deleteDocument = async (req, res) => {
  try {
    await ServiceDocument.destroy({ where: { id: req.params.id } });
    res.json({});
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
};
// //////////
module.exports.createService = async (req, res) => {
  try {
    const service = await Services.create({
      user_id: req.user.id,
      user: req.user.name,
      ...req.body,
    });
    res.json(service);
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
};

module.exports.findByUserAndOrder = async (req, res) => {
  try {
    const services = await Services.findAll({
      where: { order_id: +req.params.id, user_id: req.user.id },
      raw: true,
    });
    res.json(services);
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
};
module.exports.findAllByOrderId = async (req, res) => {
  try {
    const services = await Services.findAll({
      where: { order_id: +req.params.id },
      raw: true,
    });
    res.json(services);
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
};

module.exports.deleteById = async (req, res) => {
  try {
    await Services.destroy({
      where: { id: req.params.id },
    });
    res.json({});
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
};

module.exports.updateServiceById = async (req, res) => {
  try {
    console.log(req.body);
    await Services.update(req.body, { where: { id: req.params.id } });
    res.json({});
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
};
