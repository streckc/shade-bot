const { config, say } = require('../bot.js');

const isCapable = () => { return true; }

const execPlugin = async (args, event) => {
  const response = config.quotes[Math.floor(Math.random()*config.quotes.length)];

  say(response, event.channel);
}

const helpPlugin = async (event) => {
  return 'Report with a phrase that the bot is active.';
}

module.exports = {
  isCapable,
  execPlugin,
  helpPlugin
}
