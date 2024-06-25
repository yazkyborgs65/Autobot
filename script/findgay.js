const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "findgay",
  version: "1.2",
  author: "Samir Œ",
  cooldown: 5,
  role: 0,
  hasPrefix: false,
  description: "findgay meme (just for fun)",
  category: "𝗙𝗨𝗡",
};

module.exports.run = async function ({ event, api }) {  
  function getRandomUserID(ids) {
    const randomIndex = Math.floor(Math.random() * ids.length);
    return ids[randomIndex];
  }

  try {
    const groupId = event.threadID;
    const groupInfo = await api.getThreadInfo(groupId);

    const friends = groupInfo.participantIDs.filter(userId => !groupInfo.nicknames[userId]);

    if (friends.length === 0) {
      api.sendMessage("No eligible users found in this group.", event.threadID);
      return;
    }

    const randomUserID = getRandomUserID(friends);
    const userInfo = await api.getUserInfo(randomUserID);
    const realName = userInfo[randomUserID].name;
    const avatarURL = userInfo[randomUserID].thumbSrc;

    const pathSave = path.join(__dirname, "cache", `${randomUserID}_gay.png`);

    const response = await axios.get(avatarURL, { responseType: 'arraybuffer' });
    fs.writeFileSync(pathSave, response.data);

    api.sendMessage({
      body: `${realName} is found to be 💯 gay👇`,
      attachment: fs.createReadStream(pathSave)
    }, event.threadID, () => {
      fs.unlinkSync(pathSave);
    });

  } catch (error) {
    console.error("Error generating image:", error.message);
    api.sendMessage("An error occurred while generating the image.", event.threadID);
  }
};
