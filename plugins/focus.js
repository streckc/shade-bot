const { say } = require('../lib/slack');
const { removeFromIgnoreList, addToIgnoreList } = require('../lib/commands');

const isCapable = () => { return true; }

const execPlugin = async (args, event, config, scope) => {
  if (!scope) scope = [];

  if (scope.length == 0 || scope[0].toLowerCase() == 'all') {
    //remove user to ignore list
    removeFromIgnoreList(event.user);
  } else if (scope.indexOf(config.hostname) < 0) {
    //add user to ignore list
    addToIgnoreList(event.user);
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
