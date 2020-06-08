const { Router } = require('express')
const router = Router()
const passport = require('passport')
const upload = require('../middleware/upload')
const ctr = require('../controller/orders.controller')
// api/orders

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  upload.fields([
    { name: 'files', maxCount: 20 },
    { name: 'file', maxCount: 1 }
  ]),
  ctr.createOrder
)

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  ctr.findAll
)

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  ctr.findById
)

router.get(
  '/:id/details',
  passport.authenticate('jwt', { session: false }),
  ctr.findByIdWithDetails
)

router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  upload.single('file'),
  ctr.updateOrderById
)

router.put(
  '/:id/delete',
  passport.authenticate('jwt', { session: false }),
  ctr.deleteOrderById
)

router.put(
  '/:id/status',
  passport.authenticate('jwt', { session: false }),
  ctr.changeStatus
)

router.put(
  '/:id/file',
  passport.authenticate('jwt', { session: false }),
  upload.single('file'),
  ctr.updateIncomingOrderFile
)

// decorated file
router.get(
  '/:id/decorated',
  passport.authenticate('jwt', { session: false }),
  ctr.findDecoratedDocumentsByOrderId
)

router.put(
  '/:id/decorated',
  passport.authenticate('jwt', { session: false }),
  upload.single('file'),
  ctr.updateDecoratedDocumentFile
)

router.post(
  '/:id/decorated',
  passport.authenticate('jwt', { session: false }),
  ctr.addDecoratedDocuments
)

router.delete(
  '/:id/decorated',
  passport.authenticate('jwt', { session: false }),
  ctr.deleteDecoratedDocument
)
// //////////////
// Declarant Documents
// api/orders/declarant
router.post(
  '/declarant/:id',
  passport.authenticate('jwt', { session: false }),
  ctr.addDeclarantDocuments
)

router.delete(
  '/declarant/:id',
  passport.authenticate('jwt', { session: false }),
  ctr.deleteDeclarantDocument
)

router.put(
  '/declarant/:id',
  passport.authenticate('jwt', { session: false }),
  ctr.updateDeclarantDocumentById
)

router.put(
  '/declarant/finish/:id',
  passport.authenticate('jwt', { session: false }),
  upload.single('file'),
  ctr.UpdateDeclarantToFinishById
)

router.get(
  '/:id/declarant',
  passport.authenticate('jwt', { session: false }),
  ctr.findDeclarantDocumentsByOrderId
)

router.get(
  '/declarant/all',
  passport.authenticate('jwt', { session: false }),
  ctr.findDeclarantDocumentsById
)
module.exports = router
