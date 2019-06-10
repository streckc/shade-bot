const { say } = require('../bot.js');

const responses = [
  'Here!',
  'Present!',
  'Yes sir!?',
  'Did you need something?'
];

const isCapable = () => { return true; }

const execPlugin = async (args, event) => {
  const response = responses[Math.floor(Math.random()*responses.length)];

  say(response, event.channel);
}

const helpPlugin = async (event) => {
  return 'Report with a phraase that the bot is active.';
}

module.exports = {
  isCapable,
  execPlugin,
  helpPlugin
}
