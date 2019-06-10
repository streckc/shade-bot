const { say } = require('../bot.js');
const { runCommand } = require('../lib/run_command');

const isCapable = () => { return true; }

const execPlugin = async (args, event) => {
  const { stdout, stderr } = await runCommand('uptime');
  say(stdout, event.channel);
}

module.exports = {
  isCapable,
  execPlugin
}
