const { say } = require('../lib/slack');

const isCapable = () => { return true; }

const execPlugin = async (args, event, config) => {
  if (args.length < 1) {
    say('Commands: ' + Object.keys(globalCommands).sort().join(', '), event.channel, config);
  } else {
    const cmd = args[0];
    if (globalCommands[cmd]) { 
      const text = await globalCommands[cmd].help();
      say(cmd + ': ' + text, event.channel, config);
    } else {
      say('No known help for ' + cmd, event.channel, config);
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
