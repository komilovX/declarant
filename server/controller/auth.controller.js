const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Op = require('sequelize').Op
const Users = require('../models/user.model')
const keys = require('../keys')

module.exports.createUser = async (req, res) => {
  try {
    const condidate = await Users.findOne({ where: { login: req.body.login } })
    const checkName = await Users.findOne({ where: { name: req.body.name } })
    if (condidate) {
      res.status(409).json({ message: 'Этот логин уже занят' })
    } else if (checkName) {
      res.status(409).json({ message: 'Этот имя уже занят' })
    } else {
      const salt = bcrypt.genSaltSync(10)
      const user = await Users.create({
        name: req.body.name,
        login: req.body.login,
        password: bcrypt.hashSync(req.body.password, salt),
        role: req.body.role,
        departments: req.body.departments || null,
      })
      res.status(201).json(user)
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

module.exports.loginSystem = async (req, res) => {
  try {
    const condidate = await Users.findOne({ where: { login: req.body.login } })
    if (condidate) {
      const isPasswordCorrect = bcrypt.compareSync(
        req.body.password,
        condidate.password
      )
      if (isPasswordCorrect) {
        const token = jwt.sign(
          {
            name: condidate.name,
            userId: condidate.id,
            role: condidate.role,
            departments: JSON.parse(condidate.departments),
          },
          keys.JWT,
          { expiresIn: 60 * 60 * 2 }
        )
        res.json(token)
      } else {
        res
          .status(404)
          .json({ message: 'Такой логин и/или пароль не существует!' })
      }
    } else {
      res
        .status(404)
        .json({ message: 'Такой логин и/или пароль не существует!' })
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

module.exports.findAll = async (req, res) => {
  try {
    const users = await Users.findAll({ raw: true })
    res.json(users)
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.findAllClients = async (req, res) => {
  try {
    const clients = await Users.findAll({
      raw: true,
      where: { role: 'client' },
      attributes: ['name'],
    })
    res.json(clients)
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.findAllDeclarants = async (req, res) => {
  try {
    const clients = await Users.findAll({
      raw: true,
      where: { role: 'declarant' },
    })
    res.json(clients)
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.updateById = async (req, res) => {
  try {
    const checkLogin = await Users.findOne({
      where: { login: req.body.login, id: { [Op.ne]: +req.params.id } },
    })
    const checkName = await Users.findOne({
      where: { name: req.body.name, id: { [Op.ne]: +req.params.id } },
    })
    if (checkLogin) {
      res.status(409).json({ message: 'этот логин уже зарегистрирован' })
    } else if (checkName) {
      res.status(409).json({ message: 'этот имя уже зарегистрирован' })
    } else {
      if (req.body.password) {
        const salt = bcrypt.genSaltSync(10)
        await Users.update(
          {
            name: req.body.name,
            login: req.body.login,
            password: bcrypt.hashSync(req.body.password, salt),
            role: req.body.role,
          },
          {
            where: { id: +req.params.id },
          }
        )
      } else {
        await Users.update(
          {
            name: req.body.name,
            login: req.body.login,
            role: req.body.role,
          },
          {
            where: { id: +req.params.id },
          }
        )
      }
      res.json({ message: 'Updated' })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}
module.exports.getById = async (req, res) => {
  try {
    const user = await Users.findByPk(+req.params.id)
    res.json(user)
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports.deleteById = async (req, res) => {
  try {
    await Users.destroy({ where: { id: +req.params.id } })
    res.json({ message: 'deleted' })
  } catch (e) {
    res.status(500).json(e)
  }
}
