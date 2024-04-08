const express = require("express");
const { 
    registerUser, 
    loginUser,
    getAllUsersController,
    authToken
} = require("../controllers/auth");
const { verifyToken } = require("../midlewares/jwt");

const router = express.Router();

router.get("/", verifyToken, authToken);
router.get("/users", getAllUsersController);
router.post("/login", loginUser);
router.post("/register", registerUser);

module.exports = router;
