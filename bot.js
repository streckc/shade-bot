const os = require('os');
const { RTMClient, LogLevel } = require('@slack/rtm-api');
const { readdirSync } = require('fs');

const { parseCommand } = require('./lib/command_parse');
const { runCommand } = require('./lib/run_command');


const token = process.env.SLACK_BOT_TOKEN;
const hostname = os.hostname();

const globalCommands = {
  who: async (args, event) => { await say('Here!', event.channel); }
};

const loadPlugins = () => {
  const pluginDir = './plugins';

  readdirSync(pluginDir).forEach((file) => {
    if (file.match(/\.js$/)) {
      const name = file.replace(/\.js$/, '');
      try {
        const mod = require(pluginDir + '/' + name);
        if (mod.isCapable()) {
          globalCommands[name] = mod.execPlugin;
        }
        console.log('Loaded ' + name);
      } catch(err) {
        console.log('Error loading ' + pluginDir + '/' + file);
        console.log('     ' + err);
      }
    }
  });
}

const rtm = new RTMClient(token, {
  logLevel: LogLevel.INFO
});

async function say(text, channel) {
  try {
    const reply = await rtm.sendMessage(hostname + ': ' + text, channel)
    console.log(reply.ts, 'message sent:', reply.text, 'channel:', channel);
  } catch (error) {
    console.error('An error occurred', error);
  }
}

rtm.on('message', async (event) => {
  console.log(event.ts + ' ' + event.type + ' recieved:', event.text);
  const command = parseCommand(event.text);
  if (command && command.isFor(hostname)) {
    if (globalCommands[command.command]) {
      await globalCommands[command.command](command.args, event);
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
  say
}
