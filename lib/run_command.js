const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function runCommand(command) {
  const { stdout, stderr } = await exec(command);
  return { stdout, stderr };
}

module.exports = {
  runCommand
};
