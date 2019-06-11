const { say } = require('../lib/slack');

const { runCommand } = require('../lib/run_command');

const isCapable = () => { return true; }

const execPlugin = async (args, event, config) => {
  const { stdout, stderr } = await runCommand('git pull');
  if (stderr == '')
    say('Updated.', event.channel, config);
  else
    say('Error in update; ' + stderr, event.channel, config);
}

const helpPlugin = async (event) => {
  return 'Update the code for the bot from the git repository.';
}

module.exports = {
  isCapable,
  execPlugin,
  helpPlugin
}
