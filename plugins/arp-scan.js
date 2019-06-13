const { say } = require('../lib/slack');

const { runCommand } = require('../lib/run_command');

let arpScanLock = false;

const isCapable = () => {
  const { stdout, stderr } = runCommand('sudo which arp-scan');

  if (!stdout) return false;

  return true;
}

const execPlugin = async (args, event, config) => {
  if (arpScanLock) {
    console.log('arp-scan locked');
    return;
  }

  arpScanLock = true;
  try {
    await say('Gathering data...', event.channel, config);
    const { stdout, stderr } = await runCommand('sudo arp-scan -lNg --ouifile ./support/mac-vendor.txt'); 
    await say('\n```' + stdout.toString() + '```', event.channel, config);
  } catch(err) {
    await say('Error gathering data.', event.channel, config);
    console.log('arp-scan error: ' + err);
  }
  arpScanLock = false;
}

const helpPlugin = async (event) => {
  return 'Displays arp infomation on local subnet.';
}

module.exports = {
  isCapable,
  execPlugin,
  helpPlugin
}
