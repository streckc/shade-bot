const { say } = require('../bot.js');
const { runCommand } = require('../lib/run_command');

const isCapable = () => { return true; }

const execPlugin = async (args, event) => {
  const { stdout, stderr } = await runCommand('git pull');
  if (stderr == '')
    say('Updated.', event.channel);
  else
    say('Error in update; ' + stderr, event.channel);
}

module.exports = {
  isCapable,
  execPlugin
}
