const fs = require('fs');

module.exports.config = {
  name: "file",
  version: "2.4.3",
  credits: "cliff",
  cooldown: 0,
  hasPrefix: false,
  usage: "file {filename}",
  role: 2,
  
};

module.exports.run = async function ({ args, api, event }) {
  const pogi = "61557118090040";
   if (!pogi.includes(event.senderID))
   return api.sendMessage("This Command is only for AUTOBOT owner.", event.threadID, event.messageID);
  const fileName = args[0];
  if (!fileName) {
    return api.sendMessage("Please provide a file name.", event.threadID, event.messageID);
  }

  const filePath = __dirname + `./script/${fileName}.js`;
  if (!fs.existsSync(filePath)) {
    return api.sendMessage(`File not found: ${fileName}.js`, event.threadID, event.messageID);
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  api.sendMessage({ body: fileContent }, event.threadID);
};
