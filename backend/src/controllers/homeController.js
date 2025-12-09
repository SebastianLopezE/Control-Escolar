const messageModel = require("../models/messageModel");

function getHome(_req, res) {
  const message = messageModel.getWelcomeMessage();
  res.status(200).json({
    page: "home",
    data: message,
  });
}

module.exports = { getHome };
