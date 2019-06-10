const expect = require('chai').expect;

const { runCommand } = require('./run_command');

describe('run command', () => {
  describe('runCommand', () => {
    it('should return null', () => {
      expect(runCommand(null)).to.equal(null);
      expect(runCommand(123)).to.equal(null);
      expect(runCommand('')).to.equal(null);
      expect(runCommand([ 'a', 'b' ])).to.equal(null);
      expect(runCommand({ 'a': 'b' })).to.equal(null);
    });

    it('should return valid result', () => {
      const result = runCommand('ls');
      expect(result.stdout).to.match(/(plugins|run_command.test.js)/);
      expect(result.stderr).to.equal('');
    });

    it('should return error', () => {
      const result = runCommand('not_a_command');
      expect(result.stdout).to.equal('');
      expect(result.stderr).to.match(/not_a_command: command not found/);
    });
  });
});
