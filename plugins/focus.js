const { say } = require('../lib/slack');
const { removeFromIgnoreList, addToIgnoreList } = require('../lib/commands');

const isCapable = () => { return true; }

const execPlugin = async (args, event, config, scope) => {
  const all = args;
  if (scope) {
    for(let x = 0; x < scope.length; x++) {
      all.push(scope[x]);
    }
  }

  if (all.length == 0 || all[0].toLowerCase() == 'all') {
    //remove user to ignore list
    removeFromIgnoreList(event.user);
  } else if (all.indexOf(config.hostname) < 0) {
    //add user to ignore list
    addToIgnoreList(event.user);
  } else {
    say('I am listening.', event.channel, config);
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
