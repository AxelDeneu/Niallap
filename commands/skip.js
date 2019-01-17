const { prefix } = require('../config/config.json');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const fs = require('fs');
const log = require('fancy-log');

module.exports = {
    name: 'skip',
    description: 'Skip the current song and play the next in the queue.',
	aliases: ['next'],
    usage: '',
	cooldown: 1,
    execute(message, args) {
		if(message.channel.type === 'dm') {
			message.reply('you need to be in a server to let me add music to the queue.')
			return;
		}

		global.music.song.end();
    },
};
