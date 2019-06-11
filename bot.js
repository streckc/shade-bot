const { RTMClient, LogLevel } = require('@slack/rtm-api');
const { WebClient } = require('@slack/web-api');

const { readdirSync } = require('fs');

const { parseCommand } = require('./lib/command_parse');
const { runCommand } = require('./lib/run_command');
const { readConfig } = require('./lib/config');
const { loadPlugins, dispatchCommand } = require('./lib/commands');
const { say, saveConnections } = require('./lib/slack');

const config = readConfig(['config.json', '/etc/bot-config.json']);

const rtm = new RTMClient(config.token, { logLevel: LogLevel.INFO });
const web = new WebClient(config.token);

saveConnections(rtm, web);

rtm.on('message', async (event) => {
  await dispatchCommand(event, config);
});

rtm.on('ready', async (event) => {
  loadPlugins('./plugins');
  say('ready', '#bot_comm', config);
});

(async () => { await rtm.start(); })();
