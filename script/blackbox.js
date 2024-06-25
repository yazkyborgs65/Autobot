const axios = require('axios');

module.exports.config = {
  name: "blackbox",
  version: "9",
  role: 0,
  hasPrefix: false,
  credits: "Cliff",
  description: "AI powered by blackbox",
  aliases: ["black"],
  cooldowns: 0,
};

module.exports.run = async function ({api, event, args}) {
  if (!args[0]) {
    api.sendMessage("Please provide a question.", event.threadID, event.messageID);
    return;
  }

  const query = encodeURIComponent(args.join(" "));
  const apiUrl = `https://syuggcliff-rest-apitx-5.replit.app/blackbox?ask=${query}`;

  try {
    const response = await axios.get(apiUrl);
    const ans = response.data.Response;
    api.sendMessage(ans, event.threadID, event.messageID);
  } catch (error) {
    console.error("Error:", error);
    api.sendMessage("An error occurred while fetching the response.", event.threadID, event.messageID);
  }
};
