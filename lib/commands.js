const { readdirSync } = require('fs');

const { parseCommand } = require('./command_parse');

const globalCommands = {};

const loadPlugins = (pluginDir) => {
  let count = 0;
  if (!pluginDir) pluginDir = './plugins';

  readdirSync(pluginDir).forEach((file) => {
    if (file.match(/\.js$/) && !file.match(/\.test\.js$/)) {
      const name = file.replace(/\.js$/, '');
      try {
        const mod = require('.' + pluginDir + '/' + name);
        if (mod.isCapable()) {
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
  if (command && command.isFor(config.hostname)) {
    console.log('command ' + event.type + ': ' + event.text);
    if (globalCommands[command.command]) {
      await globalCommands[command.command].exec(command.args, event, config);
    }
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
  getCommandList,
  getCommandHelp
}
