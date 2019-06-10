const { say } = require('../bot.js');

const isCapable = () => { return true; }

const responses = [
  'Here!',
  'Present!',
  'Yes sir!?',
  'Did you need something?'
];

const execPlugin = async (args, event) => {
  const response = responses[Math.floor(Math.random()*responses.length)];

  say(response, event.channel);
}

module.exports = {
  isCapable,
  execPlugin
}
