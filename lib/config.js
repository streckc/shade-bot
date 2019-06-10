const fs = require('fs');
const os = require('os');

const readJSONFile = (filename) => {
  let result = {};

  if (!filename) return { error: 'no file requested' };

  try {
    const rawdata = fs.readFileSync(filename);  
    result = JSON.parse(rawdata);  
  } catch(err) {
    result.error = 'unable to read file: ' + filename;
    //console.error(err);
  }

  return result;
}

const readConfigFiles = (filenames) => {
  let configs = [];
  let config = {};

  if (filenames && Array.isArray(filenames)) {
    configs = filenames;
  } else if (filenames && typeof(filenames) == 'string') {
    configs.push(filenames);
  }

  for (let x = 0; x < configs.length; x++) {
    const data = readJSONFile(configs[x]);
    if (!data.error) {
      config = Object.assign(config, data);
    }
  }

  return config;
}

const getEnvironmentToken = (value) => {
  if (process.env.SLACK_BOT_TOKEN)
    return process.env.SLACK_BOT_TOKEN

  if (!value) return null;

  return value;
}

const loadVoice = (voiceDir, voice) => {
  let quotes = ['Here!'];

  const data = readJSONFile(voiceDir + '/' + voice + '.json');
  if (data && data.quotes && Array.isArray(data.quotes))
    quotes = data.quotes;

  return quotes;
}

const readConfig = (filenames) => {
  const config = readConfigFiles(filenames);
  
  config.hostname = os.hostname();
  config.token = getEnvironmentToken(config.token);
  config.quotes = loadVoice('./voices', config.voice);

  return config;
}

module.exports = {
  readJSONFile,
  readConfigFiles,
  getEnvironmentToken,
  loadVoice,
  readConfig
}