module.exports.config = {
  name: "gemini",
  role: 0,
  credits: "cliff",
  description: "Talk to Gemini (conversational)",
  hasPrefix: false,
  version: "5.6.7",
  cooldown: 5,
  aliases: ["Gemini"],
  usage: "gemini [prompt]"
};

module.exports.run = async function ({ api, event, args }) {
  const axios = require("axios");
  let prompt = args.join(" "),
    uid = event.senderID,
    url;
  if (!prompt) return api.sendMessage(`Please enter a prompt.`, event.threadID);
  api.sendTypingIndicator(event.threadID);
  try {
    const geminiApi = `https://aemt.me/gemini`;
    if (event.type == "message_reply") {
      if (event.messageReply.attachments[0]?.type == "photo") {
        url = encodeURIComponent(event.messageReply.attachments[0].url);
        const res = (await axios.get(`${geminiApi}? gemini?text=${encodeURIComponent(prompt)}`)).data;
        return api.sendMessage(res.data.result, event.threadID);
      } else {
        return api.sendMessage('Please reply to an image.', event.threadID);
      }
    }
    const response = (await axios.get(`${geminiApi}?gemini?text=${encodeURIComponent(prompt)}`)).data;
    return api.sendMessage(response.data.result, event.threadID);
  } catch (error) {
    console.error(error);
    return api.sendMessage('❌ | An error occurred. You can try typing your query again or resending it. There might be an issue with the server that\'s causing the problem, and it might resolve on retrying.', event.threadID);
  }
};
