const { Router } = require("express");
const router = Router();
const passport = require("passport");
const {
  getAllDocument,
  createDocument,
  deleteDocument,
  createService,
  findByUserAndOrder,
  findAllByOrderId,
  deleteById,
  updateServiceById,
} = require("../controller/service.controller");

router.get(
  "/document",
  passport.authenticate("jwt", { session: false }),
  getAllDocument
);

router.post(
  "/document",
  passport.authenticate("jwt", { session: false }),
  createDocument
);

router.delete(
  "/document/:id",
  passport.authenticate("jwt", { session: false }),
  deleteDocument
);

// api/services
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createService
);

router.get(
  "/user/:id",
  passport.authenticate("jwt", { session: false }),
  findByUserAndOrder
);

router.get(
  "/order/:id",
  passport.authenticate("jwt", { session: false }),
  findAllByOrderId
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  updateServiceById
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteById
);
module.exports = router;
