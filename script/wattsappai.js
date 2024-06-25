const { get } = require('axios');

module.exports.config = {
  name: 'assistant',
  credits: "cliff",
  version: '1.0.0',
  role: 0,
  hasPermission: 0,
  aliases: [],
  cooldown: 0,
  hasPrefix: false,
  description: "Ai assitant from wattsapp Meta",
  usage: "{p}{n} <Your_questions>",
  cooldowns: 0,
  usePrefix: false,
  usages: "{p}{n} <Your_questions>",
  commandCategory: "GPT",
};

module.exports.run = async function ({ api, event, args }) {
  const question = args.join(' ');
  const uid = event.senderID;

  function sendMessage(msg) {
    api.sendMessage(msg, event.threadID, event.messageID);
  }

  async function getUserNames(api, uid) {
    try {
      const userInfo = await api.getUserInfo(uid);
      const userNames = Object.values(userInfo).map(user => user.name);
      return userNames;
    } catch (error) {
      console.error("Error fetching user names:", error);
      return ["Unknown User"];
    }
  }

  if (!question) return sendMessage("Please provide a question.");

  try {
    const response = await get(`https://aemt.me/openai-db?user=${uid}&text=${encodeURIComponent(question)}`);
    if (response.data) {
      const userNames = await getUserNames(api, uid);
      const responseMessage = `${response.data.result}\n\n👤 Question Asked by: [${userNames.join(', ')}]`;
      api.sendMessage(responseMessage, event.threadID);
    } else {
      sendMessage("Failed to get a valid response from the server.");
    }
  } catch (error) {
    sendMessage("An error occurred: " + error.message);
  }
};
