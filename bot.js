const os = require('os');
const { RTMClient, LogLevel } = require('@slack/rtm-api');

const { parseCommand } = require('./lib/command_parse');
const { runCommand } = require('./lib/run_command');


const token = process.env.SLACK_BOT_TOKEN;
const hostname = os.hostname();

var globalChannel = null;
var globalCommands = {
  who: (args) => { say('Here!'); }
};

const rtm = new RTMClient(token, {
  logLevel: LogLevel.INFO
});

async function say(text, channel) {
  if (!channel) channel = globalChannel;
  try {
    const reply = await rtm.sendMessage(hostname + ': ' + text, channel)
    console.log(reply.ts, 'message sent:', reply.text, 'channel:', channel);
  } catch (error) {
    console.error('An error occurred', error);
  }
}

async function dispatch_command(command) {
  if (command.isFor(hostname)) {
    if (globalCommands[command.command]) {
      await globalCommands[command.command](command.args);
    }
  }
}

async function update_code() { await runCommand('git pull'); }

// Attach listeners to events by type. See: https://api.slack.com/events/message
rtm.on('message', (event) => {
  globalChannel = event.channel;
  console.log(event.ts + ' ' + event.type + ' recieved:', event.text);
  const command = parseCommand(event.text);
  if (command && command.isFor(hostname)) { dispatch_command(command); }
});

(async () => {
  await rtm.start();
})();
