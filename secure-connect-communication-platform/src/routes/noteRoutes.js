const router = require("express").Router();
const notes = require("../controllers/noteController");
const {authenticateToken} = require("../middleware/authMiddleware");
router.use(authenticateToken);
router.route("/").get(notes.list).post(notes.create);
router.route("/:id").get(notes.getOne).put(notes.update).delete(notes.remove);
module.exports = router;
