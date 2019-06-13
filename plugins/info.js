const { say } = require('../lib/slack');
const { ignoreList } = require('../lib/commands');
const { isShellRunning } = require('./revshell');

const isCapable = () => { return true; }

const execPlugin = async (args, event, config) => {
  const used = process.memoryUsage();
  let isRevRunning = 'No';

  if (await isShellRunning()) isRevRunning = 'Yes';

  let text = '\n```  Voice : ' + config.voice;
  text += '\n  RevShell : ' + isRevRunning;
  text += '\n  Ignoring : ' + ignoreList.join(', ');
  text += '\n  Arch : ' + process.arch;
  text += '\n  Memory : ' + (Math.round(used.rss / 1024 / 1024 * 100) / 100) + ' MB';
  text += '```';

  say(text, event.channel, config);
}

const helpPlugin = async (event) => {
  return 'Show information about the bot.';
}

module.exports = {
  isCapable,
  execPlugin,
  helpPlugin
}
