const { execSync } = require('child_process');

const runCommand = (command, detached) => {
  if (typeof(command) != 'string' || command.length < 1)
    return null;

  let options = {};
  let stdout = '';
  let stderr = '';

  try {
    if (detached)
      options = { stdio: 'ignore', detached: true };
    else
      options = { stdio: 'pipe', detached: false };

    stdout = execSync(command, options);
  } catch(err) {
    stderr = err;
  }

  return { stdout, stderr };
}

module.exports = {
  runCommand
};
