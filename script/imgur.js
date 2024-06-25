const axios = require('axios');

module.exports.config = {
  name: "imgur",
  version: "30.0.10",
  role: 0,
  credits: "cliff",
  description: "imgur upload",
  hasPrefix: false,
  usages: "[reply to image]",
  cooldown: 5,
  aliases: ["im"]
};

module.exports.run = async ({ api, event }) => {
  const uid = event.senderID;
  let link2;

  if (event.type === "message_reply" && event.messageReply.attachments.length > 0) {
    link2 = event.messageReply.attachments[0].url;
  } else if (event.attachments.length > 0) {
    link2 = event.attachments[0].url;
  } else {
    return api.sendMessage('No attachment detected. Please reply to an image.', event.threadID, event.messageID);
  }

  try {
    const res = await axios.get(`http://158.101.198.227:8609/imgur2?link=${encodeURIComponent(link2)}`);
    const link = res.data.uploaded.image;
    return api.sendMessage(`Here is the Imgur link for the image you provided:\n\n${link}`, event.threadID, event.messageID);
  } catch (error) {
    console.error("Error uploading image to Imgur:", error);
    return api.sendMessage("An error occurred while uploading the image to Imgur.", event.threadID, event.messageID);
  }
};
