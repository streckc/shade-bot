const { say, globalCommands } = require('../bot.js');

const isCapable = () => { return true; }

const execPlugin = async (args, event) => {
  if (args.length < 1) {
    say('Commands: ' + Object.keys(globalCommands).sort().join(', '), event.channel);
  } else {
    const cmd = args[0];
    if (globalCommands[cmd]) { 
      say(await globalCommands[cmd].help(), event.channel);
    } else {
      say('No known help for ' + cmd, event.channel);
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
