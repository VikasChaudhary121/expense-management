const Expense = require("../models/expense");
const { validationResult } = require("express-validator");
const { Parser } = require("json2csv");
const mongoose = require("mongoose");

const addExpense = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { description, amount, paidBy, participants, splitMethod } = req.body;

  const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

  if (!isValidObjectId(paidBy)) {
    return res.status(400).json({ error: `'paidBy' must be a valid ObjectId` });
  }

  for (const participant of participants) {
    if (!isValidObjectId(participant.user)) {
      return res
        .status(400)
        .json({ error: `'${participant.user}' must be a valid ObjectId` });
    }
  }

  // Validate and calculate amounts based on splitMethod
  if (splitMethod === "equal") {
    const eachAmount = amount / participants.length;
    participants.forEach((participant) => {
      participant.amount = eachAmount;
    });
  } else if (splitMethod === "exact") {
    const total = participants.reduce((sum, p) => sum + p.amount, 0);
    if (total !== amount) {
      return res.status(400).json({
        error: `Total of exact amounts (${total}) does not match the total amount (${amount})`,
      });
    }
  } else if (splitMethod === "percentage") {
    const totalPercentage = participants.reduce((sum, p) => sum + p.amount, 0);
    if (totalPercentage !== 100) {
      return res.status(400).json({
        error: `Total percentage (${totalPercentage}%) must be 100%`,
      });
    }
    participants.forEach((participant) => {
      participant.amount = (participant.amount / 100) * amount;
    });
  } else {
    return res.status(400).json({ error: "Invalid split method" });
  }

  try {
    const expense = new Expense({
      description,
      amount,
      paidBy: new mongoose.Types.ObjectId(paidBy),
      participants: participants.map((participant) => ({
        user: new mongoose.Types.ObjectId(participant.user),
        amount: participant.amount,
      })),
      splitMethod,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      "participants.user": req.params.userId,
    }).populate("participants.user");
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate("participants.user");
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const downloadBalanceSheet = async (req, res) => {
  try {
    const expenses = await Expense.find().populate("participants.user paidBy");

    const fields = [
      { label: "Description", value: "description" },
      { label: "Amount", value: "amount" },
      {
        label: "Paid By",
        value: (row) => (row.paidBy ? row.paidBy.name : "Unknown"),
      },
      { label: "Split Method", value: "splitMethod" },
      {
        label: "Participants",
        value: (row) =>
          row.participants
            .map((p) => `${p.user ? p.user.name : "Unknown"}: Rs.${p.amount}`)
            .join(", "),
      },
    ];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(expenses);

    res.header("Content-Type", "text/csv");
    res.attachment("balance_sheet.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addExpense,
  getAllExpenses,
  getUserExpenses,
  downloadBalanceSheet,
};
