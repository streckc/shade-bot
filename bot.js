const { RTMClient, LogLevel } = require('@slack/rtm-api');
const { readdirSync } = require('fs');

const { parseCommand } = require('./lib/command_parse');
const { runCommand } = require('./lib/run_command');
const { readConfig } = require('./lib/config');

const config = readConfig(['config.json', '/etc/bot-config.json']);
const globalCommands = {};

const loadPlugins = () => {
  const pluginDir = './plugins';

  readdirSync(pluginDir).forEach((file) => {
    if (file.match(/\.js$/) && !file.match(/\.test\.js$/)) {
      const name = file.replace(/\.js$/, '');
      try {
        const mod = require(pluginDir + '/' + name);
        if (mod.isCapable()) {
          globalCommands[name] = {
            exec: mod.execPlugin,
            help: mod.helpPlugin
          };
        }
        console.log('Plugin loaded ' + name);
      } catch(err) {
        console.log('Error loading ' + pluginDir + '/' + file);
        console.log('     ' + err);
      }
    }
  });
}

const rtm = new RTMClient(config.token, {
  logLevel: LogLevel.INFO
});

async function say(text, channel) {
  try {
    const reply = await rtm.sendMessage(config.hostname + ': ' + text, channel)
    console.log('message sent: ' + reply.text + ', channel: ' + channel);
  } catch (error) {
    console.error('An error occurred', error);
  }
}

rtm.on('message', async (event) => {
  const command = parseCommand(event.text);
  if (command && command.isFor(config.hostname)) {
    console.log('command ' + event.type + ': ' + event.text);
    if (globalCommands[command.command]) {
      await globalCommands[command.command].exec(command.args, event);
    }
  }
});

rtm.on('ready', async (event) => {
  loadPlugins();
});

(async () => {
  await rtm.start();
})();

module.exports = {
  say,
  globalCommands,
  config
}
