const axios = require('axios');
const path = require('path');

module.exports.config = {
  name: "imgbb",
  version: "1.0.0",
  role: 0,
  hasPermission: 0,
  commandCategory: "image",
  credits: "cliff",
  hasPrefix: false,
  usePrefix: false,
  description: "Upload an image to imgbb",
  usage: "{pn} <attached image>",
  cooldowns: 5,
  usages: "{pn} <attached image>",
  cooldown: 5
};

module.exports.run = async function ({ api, event }) {
  try {
    let imageUrl;
    if (event.type === "message_reply" && event.messageReply.attachments.length > 0) {
      imageUrl = event.messageReply.attachments[0].url;
    } else if (event.attachments.length > 0) {
      imageUrl = event.attachments[0].url;
    } else {
      return api.sendMessage('No attachment detected. Please reply to an image.', event.threadID, event.messageID);
    }

    const uploadUrl = 'https://samirxpikachu.onrender.com/upload';
    const data = { file: imageUrl };

    const response = await axios.post(uploadUrl, data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const result = response.data;

    if (result && result.image && result.image.url) {
      const cleanImageUrl = result.image.url.split('-')[0];
      api.sendMessage({ body: `${cleanImageUrl}.jpg` }, event.threadID);
    } else {
      api.sendMessage("Failed to upload the image to imgbb.", event.threadID);
    }
  } catch (error) {
    console.error('Error:', error);
    api.sendMessage(`Error: ${error.message}`, event.threadID);
  }
};
