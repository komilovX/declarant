const { Router } = require('express')
const router = Router()
const passport = require('passport')
const upload = require('../middleware/upload')
const ctr = require('../controller/orders.controller')
// api/orders

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  upload.array('files', 30),
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
router.put(
  '/:id/decorated',
  passport.authenticate('jwt', { session: false }),
  upload.single('file'),
  ctr.updateDecoratedDocumentFile
)
// //////////////
// Declarant Documents
// api/orders/declarant

router.put(
  '/declarant/:id',
  passport.authenticate('jwt', { session: false }),
  ctr.updateDeclarantDocumentById
)

router.put(
  '/declarant/status/:id',
  passport.authenticate('jwt', { session: false }),
  ctr.updateStatusDeclarantDocumentById
)

router.put(
  '/declarant/finish/:id',
  passport.authenticate('jwt', { session: false }),
  upload.single('file'),
  ctr.UpdateDeclarantToFinishById
)

router.get(
  '/declarant/all',
  passport.authenticate('jwt', { session: false }),
  ctr.findDeclarantDocumentsById
)
module.exports = router
