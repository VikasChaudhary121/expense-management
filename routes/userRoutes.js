const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/userController");

const router = express.Router();

router.post(
  "/users",
  [
    body("email").isEmail(),
    body("name").not().isEmpty(),
    body("mobile").not().isEmpty(),
  ],
  userController.createUser
);

router.get("/users/:id", userController.getUser);

router.get("/users/", userController.getAllUsers);

module.exports = router;
