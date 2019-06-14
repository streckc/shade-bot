const { say } = require('../lib/slack');

const isCapable = () => { return true; }

const execPlugin = async (args, event, config) => {
  if (args.length > 0) {
    say(args[0], event.channel, config);
  }
}

const helpPlugin = async (event) => {
  return 'Echo the first argument.';
}

module.exports = {
  isCapable,
  execPlugin,
  helpPlugin
}
