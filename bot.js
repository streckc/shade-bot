const os = require('os');
const { RTMClient, LogLevel } = require('@slack/rtm-api');

const token = process.env.SLACK_BOT_TOKEN;
const hostname = os.hostname();

const rtm = new RTMClient(token, {
  logLevel: LogLevel.INFO
});

async function introduce(event) {
  try {
    // Send a welcome message to the same channel where the new member just joined, and mention the user.
    const reply = await rtm.sendMessage(hostname + ' present!', event.channel)
    console.log('Message sent successfully', reply.ts);
  } catch (error) {
    console.log('An error occurred', error);
  }
}

// Attach listeners to events by type. See: https://api.slack.com/events/message
rtm.on('message', (event) => {
  console.log(event);
  if (event.text.match(/^!rollcall$/)) { introduce(event); }
});

(async () => {
  await rtm.start();
})();
