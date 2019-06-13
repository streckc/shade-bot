const { say } = require('../lib/slack');

const { runCommand } = require('../lib/run_command');

let revShellLock = false;
let sshPath = null;
let sshBaseCmd = null;
let sshRevCmd = null;

const isCapable = async (config) => {
  let res = null;

  if (!config.revshell || !config.revshell.target || !config.revshell.key) {
    console.log('reverse shell not configured');
    return false;
  }

  res = await runCommand('which ssh');
  if (!res.stdout) {
    console.log('reverse shell can not find ssh');
    return false;
  }
  sshPath = res.stdout.toString().trim();
  sshBaseCmd = [
    sshPath,
    '-p ' + config.revshell.port,
    '-i ' + config.revshell.key,
    config.revshell.target
  ];

  res = await runCommand(sshBaseCmd.join(' ') + ' date');
  if (!res.stdout) {
    console.log('reverse shell test connect did not work: ' + res.stderr);
    return false;
  }

  return true;
}

const execPlugin = async (args, event, config) => {
  let res = null;

  if (!sshBaseCmd) { return; }

  if (revShellLock) {
    console.log('revshell locked');
    return;
  }

  if (await isShellRunning()) {
    await say('A shell is already running', event.channel, config);
    return;
  }

  revShellLock = true;
  try {
    await say('Creating shell...', event.channel, config);

    const listenPort = await getListenPort();
    if (listenPort < 0) {
      await say('Unable to get listen port.', event.channel, config);
      return;
    }

    sshRevCmd = sshBaseCmd.slice(0, sshBaseCmd.length - 1);
    sshRevCmd.push('-fNT');
    sshRevCmd.push('-R ' + listenPort + ':127.0.0.1:22');
    sshRevCmd.push('-o UserKnownHostsFile=/dev/null');
    sshRevCmd.push('-o StrictHostKeyChecking=no');
    sshRevCmd.push(sshBaseCmd[sshBaseCmd.length - 1]);

    res = runCommand(sshRevCmd.join(' '), true);
    await say('Shell listening on ' + listenPort, event.channel, config);
  } catch(err) {
    await say('Error creating shell.', event.channel, config);
    console.log('revshell error: ' + err);
  }
  revShellLock = false;
}

const helpPlugin = async (event) => {
  return 'Creates a reverse shell if one is configured.';
}

const getListenPort = async (output) => {
  let basePort = 2202;

  if (!sshBaseCmd) return -1;

  const res = await runCommand(sshBaseCmd.join(' ') + ' ss -antlp');

  if (!res.stdout) {
    console.log('Unable to get port list from remote.');
  } else {
    for (let x = 0; x < 200 ; x++) {
      if (!res.stdout.toString().includes(':' + String(basePort + x) + ' ')) {
        return basePort + x;
      }
    }
    console.log('Unable to find open port');
  }

  return -1;
}

const isShellRunning = async () => {
  const res = await runCommand('ps ax'); 
  if (!sshBaseCmd) {
    console.log('revshell no base shell');
    return false;
  } else if (!res.stdout) {
    console.log('revshell unable to get processes');
    return true;
  } else if (res.stdout.toString().match(RegExp(sshBaseCmd.join(' ').substring(0,20)))) {
    console.log('revshell already exists');
    return true;
  }
  return false;
}

module.exports = {
  isCapable,
  execPlugin,
  helpPlugin,
  isShellRunning
}
