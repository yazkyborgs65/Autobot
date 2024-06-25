const axios = require('axios');
const fs = require('fs');

module.exports.config = {
  name: "stream",
  version: "1.0",
  hasPrefix: false,
  hasPermission: 0,
  usePrefix: false,
  commandCategory: "media",
  author: "Cliff",
  description: "Send video from URL",
  longDescription: "Send a video from a URL using fs module.",
  category: "𝗠𝗘𝗗𝗜𝗔",
  guide: "{prefix}stream <video URL>",
  usages: "{prefix}stream <video URL>",
  cooldown: 5,
  usage: "{prefix}stream <video URL>",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const videoURL = args[0];

  if (!videoURL) {
    return api.sendMessage("Please provide the URL of the video.", event.threadID);
  }

  try {
    const response = await axios.get(videoURL, { responseType: 'stream' });

    const videoStream = fs.createWriteStream('video.mp4');
    response.data.pipe(videoStream);

    await new Promise((resolve, reject) => {
      videoStream.on('finish', resolve);
      videoStream.on('error', reject);
    });

    await api.sendMessage({
      attachment: fs.createReadStream('video.mp4')
    }, event.threadID);

    fs.unlinkSync('video.mp4');

  } catch (error) {
    console.error(error);
    return api.sendMessage("Failed to send the video.", event.threadID);
  }
};
