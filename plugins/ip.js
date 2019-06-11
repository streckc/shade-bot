const { say } = require('../lib/slack');

const axios = require('axios');

const isCapable = () => {
  try {
    const installed = require.resolve('axios');
    if (installed) return true;
  } catch(err) {
    return false;
  }
  return false;
}

const execPlugin = async (args, event, config) => {
  const response = await axios.get('http://ip-api.com/json?fields=59350');
  // as, city, country, countryCode, isp, lat, lon, org, query, region,
  // regionName, status, timesone, zip
  let text = response.data.query;
  text += ': ' + response.data.isp;
  text += ' @ ' + response.data.city;
  text += ', ' + response.data.region;
  text += ', ' + response.data.countryCode;
  say(text, event.channel, config);
}

const helpPlugin = async (event) => {
  return 'Report on information that the bot is located at.';
}

module.exports = {
  isCapable,
  execPlugin,
  helpPlugin
}
