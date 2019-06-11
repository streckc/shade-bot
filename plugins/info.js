const { say } = require('../lib/slack');
const { ignoreList } = require('../lib/commands');

const isCapable = () => { return true; }

const execPlugin = async (args, event, config) => {
  const used = process.memoryUsage();
  let text = '\n  Name : ' + config.hostname;
  text += '\n  Voice : ' + config.voice;
  text += '\n  Ignoring : ' + ignoreList.join(', ');
  text += '\n  Version : ' + process.version;
  text += '\n  Arch : ' + process.arch;
  text += '\n  Memory : ' + (Math.round(used.rss / 1024 / 1024 * 100) / 100) + ' MB';

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
