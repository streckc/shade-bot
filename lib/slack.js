let globalRTM = null;
let globalWeb = null;

const saveConnections = (rtm, web) => {
  globalRTM = rtm;
  globalWeb = web;
}

const say = async (text, channel, config) => {
  try {
    const reply = await globalWeb.chat.postMessage({
      channel: channel,
      text: config.hostname + ': ' + text,
      as_user: true
    });
    console.log('sent: ' + reply.message.text);
  } catch (error) {
    console.error('An error occurred', error);
  }
}

module.exports = {
  saveConnections,
  say
}
