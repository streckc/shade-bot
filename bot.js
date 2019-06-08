const os = require('os');
const { RTMClient, LogLevel } = require('@slack/rtm-api');
const util = require('util');
const exec = util.promisify(require('child_process').exec);


const token = process.env.SLACK_BOT_TOKEN;
const hostname = os.hostname();

const rtm = new RTMClient(token, {
  logLevel: LogLevel.INFO
});

async function say(text, channel) {
  if (!channel) return;
  try {
    const reply = await rtm.sendMessage(text, channel)
    console.log(reply.ts, 'message sent:', reply.text);
  } catch (error) {
    console.error('An error occurred', error);
  }
}

async function dispatch_command(event) {
  //var command = parse_command(event.text);
  if (event.text.match(/^!who$/)) { say(hostname + ' here!', event.channel); }
  else if (event.text.match(/^!update$/)) { update_code(); }
}

async function update_code() {
  const { stdout, stderr } = await exec('git pull');
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
}

// Attach listeners to events by type. See: https://api.slack.com/events/message
rtm.on('message', (event) => {
  console.log(event.ts + ' ' + event.type + ' recieved:', event.text);
  if (event.text && event.text.match(/^![a-z]+/)) { dispatch_command(event); }
});

//rtm.on('hello', (event) => {
//  //console.log(event);
//  console.log(Object.keys(rtm));
//  console.log(Object.getOwnPropertyNames(rtm));
//  //say('Hello from' + hostname + '!');
//  //console.log(im.list());
//});

(async () => {
  await rtm.start();
})();
