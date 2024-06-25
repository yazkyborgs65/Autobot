const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const url = require('url');

module.exports.config = {
  name: 'pinterest',
  version: '1.0.0',
  credits: 'Joshua Sy (Converted by Dymyrius)',
  role: 0,
  description: 'Image search',
  usages: '<query> - <amount>',
  cooldowns: 5,
  hasPrefix: false,
};

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cacheFolder = path.join(__dirname, 'cache');

async function ensureCacheFolderExists() {
  try {
    await fs.ensureDir(cacheFolder);
  } catch (error) {
    console.error('Error creating cache folder:', error);
  }
}

module.exports.run = async function ({ api, args, event, prefix }) {
  const { messageID, threadID } = event;
  const keySearch = args.join(' ');
  if (!keySearch.includes('-')) {
    return api.sendMessage(
      `Invalid usage!\nExample: ${prefix}pinterest Zoro - 10 (20 Limit).`,
      threadID,
      messageID
    );
  }
  const keySearchs = keySearch.substr(0, keySearch.indexOf('-')).trim();
  const numberSearch = keySearch.split('-').pop().trim() || 6;

  await ensureCacheFolderExists();

  await api.setMessageReaction("⏳", messageID);
  try {
    const res = await axios.get(`https://gpt4withcustommodel.onrender.com/api/pin?title=${encodeURIComponent(keySearchs)}&count=20`);
    const data = res.data.data;
    const imgData = [];
    for (let i = 0; i < parseInt(numberSearch); i++) {
      const filePath = path.join(cacheFolder, `${i + 1}.jpg`);
      const getDown = (await axios.get(data[i], { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(filePath, Buffer.from(getDown));
      imgData.push(fs.createReadStream(filePath));
    }
    await api.setMessageReaction("✅", messageID);
    await api.sendMessage(
      {
        attachment: imgData,
        body: `${numberSearch} Search results for keyword: ${keySearchs}`,
      },
      threadID,
      messageID
    );
    for (let i = 0; i < parseInt(numberSearch); i++) {
      fs.unlinkSync(path.join(cacheFolder, `${i + 1}.jpg`));
    }
  } catch (error) {
    console.error('Error during Pinterest search:', error);
    await api.setMessageReaction("❌", messageID);
    await api.sendMessage(
      `An error occurred while searching for images: ${error.message}`,
      threadID,
      messageID
    );
  }
};
