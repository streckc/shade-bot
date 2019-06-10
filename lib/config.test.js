const expect = require('chai').expect;
const fs = require('fs');

const { readJSONFile, readConfigFiles, getEnvironmentToken, loadVoice, readConfig } = require('./config');

describe('config', () => {
  describe('readJSONFile', () => {
    it('should return error', () => {
      expect(readJSONFile(null)).to.deep.equal({ error: 'no file requested' });
      expect(readJSONFile(123)).to.deep.equal({ error: 'unable to read file: 123' });
      expect(readJSONFile('/tmp/spam_not_found')).to.deep.equal({ error: 'unable to read file: /tmp/spam_not_found' });
    });

    it('should read JSON file', () => {
      fs.writeFileSync('/tmp/is_json.txt', '{\n  "abc": "def"\n}');
      expect(readJSONFile('/tmp/is_json.txt')).to.deep.equal({ abc: 'def' });
      fs.unlinkSync('/tmp/is_json.txt');
    });

    it('should not read non-JSON file', () => {
      fs.writeFileSync('/tmp/not_json.txt', 'abc\ndef');
      expect(readJSONFile('/tmp/not_json.txt')).to.deep.equal({ error: 'unable to read file: /tmp/not_json.txt' });
      fs.unlinkSync('/tmp/not_json.txt');
    });
  });

  describe('readConfiFiles', () => {
    it('should return basic config', () => {
      expect(readConfigFiles()).to.deep.equal({ });
      expect(readConfigFiles(null)).to.deep.equal({ });
      expect(readConfigFiles(123)).to.deep.equal({ });
    });

    it('should read specified config file', () => {
      fs.writeFileSync('/tmp/is_json.txt', '{\n  "abc": "def"\n}');
      expect(readConfigFiles('/tmp/is_json.txt')).to.deep.equal({ abc: 'def' });
      fs.unlinkSync('/tmp/is_json.txt');
    });

    it('should read multiple specified config file', () => {
      fs.writeFileSync('/tmp/is_json_1.txt', '{\n  "abc": "def"\n}');
      fs.writeFileSync('/tmp/is_json_2.txt', '{\n  "ghi": "jkl"\n}');
      expect(readConfigFiles(['/tmp/is_json_1.txt', '/tmp/is_json_2.txt'])).to.deep.equal({ abc: 'def', ghi: 'jkl' });
      fs.unlinkSync('/tmp/is_json_2.txt');
      fs.unlinkSync('/tmp/is_json_1.txt');
    });

    it('should read last config file values takes priority', () => {
      fs.writeFileSync('/tmp/is_json_1.txt', '{\n  "abc": "def"\n}');
      fs.writeFileSync('/tmp/is_json_2.txt', '{\n  "abc": "jkl"\n}');
      expect(readConfigFiles(['/tmp/is_json_1.txt', '/tmp/is_json_2.txt'])).to.deep.equal({ abc: 'jkl' });
      fs.unlinkSync('/tmp/is_json_2.txt');
      fs.unlinkSync('/tmp/is_json_1.txt');
    });

    it('should not read non-JSON config file', () => {
      fs.writeFileSync('/tmp/not_json.txt', 'abc\ndef');
      expect(readConfigFiles('/tmp/not_json.txt')).to.deep.equal({ });
      fs.unlinkSync('/tmp/not_json.txt');
    });
  });

  describe('getEnvironmentToken', () => {
    it('should return passed value or null with no environment set', () => {
      expect(getEnvironmentToken()).to.equal(null);
      expect(getEnvironmentToken(null)).to.equal(null);
      expect(getEnvironmentToken('abc')).to.equal('abc');
    });

    it('should return passed value or null with no environment set', () => {
      process.env.SLACK_BOT_TOKEN = 'def';
      expect(getEnvironmentToken()).to.equal('def');
      expect(getEnvironmentToken(null)).to.equal('def');
      expect(getEnvironmentToken('abc')).to.equal('def');
      delete(process.env.SLACK_BOT_TOKEN);
    });
  });

  describe('loadVoice', (voiceDir, voice) => {
    it('should return default quotes', () => {
      expect(loadVoice()).to.deep.equal(['Here!']);
      expect(loadVoice(null)).to.deep.equal(['Here!']);
      expect(loadVoice('/tmp', 'voice_file_not_found')).to.deep.equal(['Here!']);
    });

    it('should return quotes if json has quotes', () => {
      fs.writeFileSync('/tmp/test_voice.json', '{\n  "quotes": [ "Space!" ]\n}');
      expect(loadVoice('/tmp', 'test_voice')).to.deep.equal(['Space!']);
      fs.unlinkSync('/tmp/test_voice.json');
    });

    it('should return default if json has no quotes', () => {
      fs.writeFileSync('/tmp/test_voice.json', '{\n  "no_quotes": [ "Space!" ]\n}');
      expect(loadVoice('/tmp', 'test_voice')).to.deep.equal(['Here!']);
      fs.unlinkSync('/tmp/test_voice.json');
    });

    it('should return default if json has non-array quotes', () => {
      fs.writeFileSync('/tmp/test_voice.json', '{\n  "quotes": { "1": "Space!" }\n}');
      expect(loadVoice('/tmp', 'test_voice')).to.deep.equal(['Here!']);
      fs.unlinkSync('/tmp/test_voice.json');
    });
  });

  describe('readConfig', () => {
    it('returns a default config', () => {
      const config = readConfig();
      expect(config.quotes).to.deep.equal(['Here!']);
      expect(config.token).to.equal(null);
    });
  });
});
