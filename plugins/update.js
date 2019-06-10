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

const helpPlugin = async (event) => {
  return 'Update the code for the bot from the git repository.';
}

module.exports = {
  isCapable,
  execPlugin,
  helpPlugin
}
