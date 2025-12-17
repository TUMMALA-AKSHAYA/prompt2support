const express = require("express");
const router = express.Router();
const queryController = require("../controllers/queryController");

router.post("/process", (req, res) =>
  queryController.processQuery(req, res)
);

module.exports = router;
