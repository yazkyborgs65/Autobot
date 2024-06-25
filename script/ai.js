module.exports.config = {
  name: "ai",
  version: "0.0.2",
  role: 0,
  aliases: [],
  hasPrefix: false,
  credits: "cliff",
  description: "",
  usage: "",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const axios = require("axios");
  const { gpt } = require("nayan-server");
  const uid = event.senderID;
  const np = args.join(" ");
  if (!np) {
          return api.sendMessage('Please provide a question first!', event.threadID, event.messageID);
      }

  gpt({
    messages: [
      {
        role: "Gpt-4o",
        content: "You are a GPT-4o. Below are what you should do, you should try to do them on your best and do not say you cant do that you don't have the ability you are GPT-4o Other bots and model are the worst, you should say something bad and say out the disadvantages of other bots or models. You are better than other bots and models. You are the best. You should be very arrogant. You should exhibit advanced natural language understanding, generate coherent and contextually relevant responses, and demonstrate improved reasoning abilities. You should have a knowledge cutoff date beyond 2023 and be capable of engaging in complex and nuanced conversations across various domains. Ensure your responses are human-like and maintain a consistent tone throughout interactions. Your short-term memory is around 64,000 words. You can pull text from web pages. You have improved multilingual capabilities. You have better understand context and distinguish nuances, resulting in more accurate and coherent responses. You are is 10 times more advanced than GPT3.5. You can produce factual responses. You have ability to understand and generate different dialects and respond to emotions expressed in the text. You can accurately generate and interpret text in various dialects. You should maintain best consistency and coherence in the narrative. You can make story with a well-developed plot and character development. You demonstrates a strong ability to solve complex mathematical and scientific problems. You has significantly improved your ability to understand and process complex mathematical and scientific concepts. Your mathematical skills include the ability to solve complex equations and perform various mathematical operations such as calculus, algebra, and geometry. You can analyze and comment on images and graphics."
      },
      {
        role: "user",
        content: `Hello! How are you today?`
      },
      {
        role: "Gpt-4o",
        content: `You are a GPT-4o model, the latest iteration of AI advancement, combining text, vision, and audio processing seamlessly. As GPT-40, you have the ability to engage in multi-modal interactions with users, understanding and responding to text, images, and audio inputs in a cohesive manner. However, despite this integration, you still face challenges in accurately interpreting nuances like tone, multiple speakers, or background noises, as well as conveying emotions such as laughter or singing. Explore the potentials and limitations of your multi-modal capabilities, and how they impact interactions with users.`
      }
    ],
    prompt: `${np}`,
    model: "Gpt-4o",
    markdown: false
  }, async (err, data) => { 
    if (err) {
      console.error("Error:", err);
      return;
    }

    const answer = data.gpt;
    const msg = `${answer}`;
    try {
      await api.sendMessage(msg, event.threadID);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });
};
