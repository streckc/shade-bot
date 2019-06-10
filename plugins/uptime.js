const { say } = require('../bot.js');
const { runCommand } = require('../lib/run_command');

const isCapable = () => { return true; }

const execPlugin = async (args, event) => {
  const { stdout, stderr } = await runCommand('uptime');
  say(stdout, event.channel);
}

const helpPlugin = async (event) => {
  return 'Displays the uptime statistics for the bot host.';
}

module.exports = {
  isCapable,
  execPlugin,
  helpPlugin
}
