const { readdirSync } = require('fs');

const { parseCommand } = require('./command_parse');

const globalCommands = {};
const alwaysRun = ['focus', 'who'];
let ignoreList = [];

const loadPlugins = (pluginDir, config) => {
  let count = 0;
  if (!pluginDir) pluginDir = './plugins';

  readdirSync(pluginDir).forEach((file) => {
    if (file.match(/\.js$/) && !file.match(/\.test\.js$/)) {
      const name = file.replace(/\.js$/, '');
      try {
        const mod = require('.' + pluginDir + '/' + name);
        if (mod.isCapable(config)) {
          globalCommands[name] = {
            exec: mod.execPlugin,
            help: mod.helpPlugin
          };
          count = count + 1;
          console.log('Plugin loaded ' + name);
        }
      } catch(err) {
        console.log('Error loading ' + pluginDir + '/' + file);
        console.log('     ' + err);
      }
    }
  });
  return count;
}

const dispatchCommand = async (event, config) => {
  const command = parseCommand(event.text);
  if (command) {
    if (!globalCommands[command.command]) {
      console.log('command does not exist: ' + event.text);
    } else if (alwaysRun.indexOf(command.command) > -1) {
      console.log('command always runs: ' + event.text);
      await globalCommands[command.command].exec(command.args, event, config, command.scope);
    } else if (ignoreList.indexOf(event.user) > -1) {
      console.log('command is ignored: ' + event.text);
    } else if (command.isFor(config.hostname)) {
      console.log('command is for bot: ' + event.text);
      await globalCommands[command.command].exec(command.args, event, config, command.scope);
    }
  }
}

const addToIgnoreList = (user) => {
  if (user) {
    ignoreList.push(user);
  }
}

const removeFromIgnoreList = (user) => {
  if (user) {
    ignoreList = ignoreList.filter(name => name != user);
  }
}

const getCommandList = () => {
  return Object.keys(globalCommands);
}

const getCommandHelp = async (cmd) => {
  let text = 'No help for this command';

  if (globalCommands[cmd]) {
    text = await globalCommands[cmd].help();
  }

  return text;
}

module.exports = {
  loadPlugins,
  dispatchCommand,
  removeFromIgnoreList,
  addToIgnoreList,
  getCommandList,
  getCommandHelp,
  ignoreList
}
