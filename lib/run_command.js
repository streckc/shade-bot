const { execSync } = require('child_process');

const runCommand = (command) => {
  if (typeof(command) != 'string' || command.length < 1)
    return null;

  let stdout = '';
  let stderr = '';

  try {
    stdout = execSync(command, { stdio: 'pipe' });
  } catch(err) {
    stderr = err;
  }

  return { stdout, stderr };
}

module.exports = {
  runCommand
};
