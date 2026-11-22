const router = require("express").Router();
const auth = require("../controllers/authController");
const {authenticateToken} = require("../middleware/authMiddleware");
router.post("/signup",auth.signup);
router.post("/login",auth.login);
router.get("/me",authenticateToken,auth.me);
module.exports = router;
