const { say } = require('../lib/slack');
const { getCommandList, getCommandHelp } = require('../lib/commands');

const isCapable = () => { return true; }

const execPlugin = async (args, event, config) => {
  if (args.length < 1) {
    say('Commands: ' + getCommandList().sort().join(', '), event.channel, config);
  } else {
    for (let x = 0; x < args.length; x++) {
      say(args[x] + ': ' + await getCommandHelp(args[x]), event.channel, config);
    }
  }
}

const helpPlugin = async (event) => {
  return 'Displays help for commands.';
}

module.exports = {
  isCapable,
  execPlugin,
  helpPlugin
}
