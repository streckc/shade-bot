var os = require('os');

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

const getExternalAddress = async () => {
  const response = await axios.get('http://ip-api.com/json?fields=59350');
  // as, city, country, countryCode, isp, lat, lon, org, query, region,
  // regionName, status, timesone, zip
  let text = response.data.query;
  text += ': ' + response.data.isp;
  text += ' @ ' + response.data.city;
  text += ', ' + response.data.region;
  text += ', ' + response.data.countryCode;

  return text;
}

const getInternalAddresses = async () => {
  const ifaces = os.networkInterfaces();
  const results = [];

  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach((iface) => {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        results.push(iface.address + ': interface ' + ifname + ':' + alias);
      } else {
        // this interface has only one ipv4 adress
        results.push(iface.address + ': interface ' + ifname);
      }
      ++alias;
    });
  });

  return results;
}

const execPlugin = async (args, event, config) => {
  let text = await getExternalAddress();
  if (args.includes('all')) {
    const internal = await getInternalAddresses();
  console.log(internal);
    for (let x = 0; x < internal.length; x++) {
      text += '\n' + internal[x];
    }
    say('```' + text + '```', event.channel, config);
  } else {
    say(text, event.channel, config);
  }
}

const helpPlugin = async (event) => {
  return 'Report on information that the bot is located at.\n    all - include internal addresses';
}

module.exports = {
  isCapable,
  execPlugin,
  helpPlugin
}
