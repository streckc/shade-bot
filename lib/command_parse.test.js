const expect = require('chai').expect;

const { tokenizeText, parseTokens, parseCommand } = require('./command_parse');


describe('command parse', () => {
  describe('tokenizeText', () => {
    it('should return null', () => {
      expect(tokenizeText(null)).to.equal(null);
      expect(tokenizeText([ 'a', 'b' ])).to.equal(null);
      expect(tokenizeText({ 'a': 'b' })).to.equal(null);
    });

    it('should return empty list', () => {
      expect(tokenizeText('')).to.deep.equal([]);
      expect(tokenizeText('    ')).to.deep.equal([]);
    });

    it('should handle words', () => {
      expect(tokenizeText('abc')).to.deep.equal(['abc']);
      expect(tokenizeText('abc def')).to.deep.equal(['abc', 'def']);
    });

    it('should handle strings', () => {
      expect(tokenizeText('"abc"')).to.deep.equal(['abc']);
      expect(tokenizeText('"abc def"')).to.deep.equal(['abc def']);
    });

    it('should handle mixed', () => {
      expect(tokenizeText('"abc" def')).to.deep.equal(['abc', 'def']);
      expect(tokenizeText('abc "def ghi" jkl')).to.deep.equal(['abc', 'def ghi', 'jkl']);
    });
  });

  describe('parseTokens', () => {
    it('should return null', () => {
      expect(parseTokens(null)).to.equal(null);
      expect(parseTokens('ab')).to.equal(null);
      expect(parseTokens({ 'a': 'b' })).to.equal(null);
    });

    it('should return empty command', () => {
      expect(parseTokens([''])).to.deep.include({
        command: '',
        scope: [],
        args: []
      });
    });

    it('should return command and args', () => {
      expect(parseTokens(['abc'])).to.deep.include({
        command: 'abc',
        scope: [],
        args: []
      });
      expect(parseTokens(['abc', 'def ghi', 'jkl'])).to.deep.include({
        command: 'abc',
        scope: [],
        args: ['def ghi', 'jkl']
      });
      expect(parseTokens(['abc', 'def ghi', '@jkl'])).to.deep.include({
        command: 'abc',
        scope: ['jkl'],
        args: ['def ghi']
      });
      expect(parseTokens(['abc', '@123', 'def ghi', '@jkl'])).to.deep.include({
        command: 'abc',
        scope: ['123', 'jkl'],
        args: ['def ghi']
      });
    });
  });

  describe('parseCommand', () => {
    it('should return null', () => {
      expect(parseCommand(null)).to.equal(null);
      expect(parseCommand(['a', 'b'])).to.equal(null);
      expect(parseCommand({ 'a': 'b' })).to.equal(null);
      expect(parseCommand('')).to.equal(null);
      expect(parseCommand('!')).to.equal(null);
    });

    it('should return command', () => {
      expect(parseCommand('!a')).to.deep.include({
        command: 'a',
        scope: [],
        args: []
      });
      expect(parseCommand('!a b c')).to.deep.include({
        command: 'a',
        scope: [],
        args: ['b', 'c']
      });
      expect(parseCommand('!a b @z @y c')).to.deep.include({
        command: 'a',
        scope: ['z', 'y'],
        args: ['b', 'c']
      });
    });
  });

  describe('command.isFor', () => {
    const all = parseCommand('!a');
    const some = parseCommand('!a @bc @de');

    it('should return all false', () => {
      expect(all.isFor(null)).to.be.false;
      expect(all.isFor('')).to.be.false;
      expect(all.isFor([ 'a', 'b' ])).to.be.false;
      expect(all.isFor({ 'a': 'b' })).to.be.false;
    });
    it('should return all true', () => {
      expect(all.isFor('z')).to.be.true;
      expect(all.isFor('y')).to.be.true;
    });

    it('should return some false', () => {
      expect(some.isFor('ab')).to.be.false;
      expect(some.isFor('cd')).to.be.false;
    });
    it('should return some true', () => {
      expect(some.isFor('bc')).to.be.true;
      expect(some.isFor('de')).to.be.true;
    });
    it('should return some partial true', () => {
      expect(some.isFor('bcd')).to.be.true;
      expect(some.isFor('def')).to.be.true;
    });
  });
});
