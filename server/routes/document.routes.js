const { Router } = require('express')
const router = Router()
const {
  findAll,
  createDocument,
  deleteById,
} = require('../controller/document.controller')

// api/document
router.get('/', findAll)

router.post('/', createDocument)

router.delete('/:id', deleteById)

module.exports = router
