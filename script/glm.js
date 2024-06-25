const { get } = require('axios');

module.exports.config = {
  name: 'glm',
  credits: "cliff",
  version: '1.0.0',
  role: 0,
  hasPermission: 0,
  aliases: [],
  cooldown: 0,
  hasPrefix: false,
  description: "",
  usage: "{p}{n} <Your_questions>",
  cooldowns: 0,
  usePrefix: false,
  usages: "{p}{n} <Your_questions>",
  commandCategory: "GLM",
};

module.exports.run = async function({ api, event, args }) {
  const search = args.join(" ");

  if (!search) {
    return api.sendMessage('Please provide a question first!', event.threadID, event.messageID);
  }

  try {
    const syugg = await api.sendMessage('🔍 Searching, please wait...', event.threadID);

    const response = await get(`http://158.101.198.227:8609/glm/gpt9/x1?search=${encodeURIComponent(search)}`);

    if (response.data && response.data.content) {
      api.sendMessage(response.data.content, event.threadID, event.messageID);
    api.unsendMessage(syugg.messageID);
    } else {
      api.sendMessage('❌ Sorry, I could not retrieve an answer. Please try again later.', event.threadID, event.messageID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage('❌ An error occurred while processing your request. Please try again later.', event.threadID, event.messageID);
  }
};
