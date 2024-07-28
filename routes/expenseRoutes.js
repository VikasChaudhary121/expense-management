const express = require("express");
const { body } = require("express-validator");
const {
  addExpense,
  getUserExpenses,
  getAllExpenses,
  downloadBalanceSheet,
} = require("../controllers/expenseController");
// const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post(
  "/expenses",
  [
    body("description").not().isEmpty(),
    body("amount").isNumeric(),
    body("paidBy").not().isEmpty(),
    body("splitMethod").isIn(["equal", "exact", "percentage"]),
  ],
  addExpense
);

router.get("/expenses/user/:userId", getUserExpenses);
router.get("/expenses", getAllExpenses);
router.get("/expenses/balance-sheet", downloadBalanceSheet);

module.exports = router;
