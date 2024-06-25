module.exports.config = {
  name: 'neuron',
  version: '1.1.1',
  hasPermssion: 0,
  role: 0,
  credits: "cliff",
  author: '',
  description: 'An AI powered Antarctic',
  usePrefix: false,
  hasPrefix: false,
  commandCategory: 'AI',
  usage: '[prompt]',
  cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
  const axios = require('axios');

  let user = args.join(' ');

  try {
      if (!user) {
          return api.sendMessage('Please provide a question first!', event.threadID, event.messageID);
      }

      const cliff = await new Promise(resolve => { api.sendMessage('🔍 Searching Please Wait....', event.threadID, (err, info1) => {
      resolve(info1);
     }, event.messageID);
    });

      const response = await axios.get(`http://158.101.198.227:8609/gpt11?ask=${encodeURIComponent(user)}`);

      const responseData = response.data.response;
      const baby = `𝗚𝗣𝗧-𝟰 (NEURONSPIKE)\n▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱\n${responseData}`;
      api.editMessage(baby, cliff.messageID);
  } catch (err) {
      console.error(err);
      return api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};