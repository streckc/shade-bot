#!/usr/bin/env nodemon

const { RTMClient, LogLevel } = require('@slack/rtm-api');
const { WebClient } = require('@slack/web-api');

const { readdirSync } = require('fs');

const { parseCommand } = require('./lib/command_parse');
const { runCommand } = require('./lib/run_command');
const { readConfig } = require('./lib/config');
const { loadPlugins, dispatchCommand } = require('./lib/commands');
const { say, saveConnections } = require('./lib/slack');

const config = readConfig(['config.json', '/etc/bot-config.json']);
let botID = null;

const rtm = new RTMClient(config.token, { logLevel: LogLevel.INFO });
const web = new WebClient(config.token);

saveConnections(rtm, web);

rtm.on('message', async (event) => {
  await dispatchCommand(event, config);
});

rtm.on('ready', async (event) => {
  const result = await web.im.list();
  if (result.ok) {
    result.ims.forEach((bot) => {
      if (bot.user == rtm.activeUserId) {
        botID = bot;
      }
    });
  }
  loadPlugins('./plugins', config);
  if (botID) {
    say('ready', '#bot_comm', config);
  }
});

(async () => { await rtm.start(); })();
