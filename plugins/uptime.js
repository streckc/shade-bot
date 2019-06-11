const { say } = require('../lib/slack');

const { runCommand } = require('../lib/run_command');

const isCapable = () => { return true; }

const execPlugin = async (args, event, config) => {
  const { stdout, stderr } = await runCommand('uptime');
  say(stdout, event.channel, config);
}

const helpPlugin = async (event) => {
  return 'Displays the uptime statistics for the bot host.';
}

module.exports = {
  isCapable,
  execPlugin,
  helpPlugin
}
