const os = require('os');
const { RTMClient, LogLevel } = require('@slack/rtm-api');
const util = require('util');
const exec = util.promisify(require('child_process').exec);


const token = process.env.SLACK_BOT_TOKEN;
const hostname = os.hostname();

var global_channel = null;

const rtm = new RTMClient(token, {
  logLevel: LogLevel.INFO
});

async function say(text, channel) {
  if (!channel) channel = global_channel;
  try {
    const reply = await rtm.sendMessage(hostname + ': ' + text, channel)
    console.log(reply.ts, 'message sent:', reply.text);
  } catch (error) {
    console.error('An error occurred', error);
  }
}

async function dispatch_command(event) {
  //var command = parse_command(event.text);
  global_channel = event.channel;
  if (event.text.match(/^!who$/)) { say('Here!', event.channel); }
  else if (event.text.match(/^!update$/)) { update_code(); }
  else if (event.text.match(/^!uptime$/)) { uptime(); }
}

async function run_command(command) {
  const { stdout, stderr } = await exec(command);
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
  return { stdout, stderr };
}

async function update_code() { await run_command('git pull'); }
async function uptime() {
  const { stdout, stderr } =  await run_command('uptime');
  say(stdout);
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
