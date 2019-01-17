const { prefix } = require('../config/config.json');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const fs = require('fs');
const log = require('fancy-log');

module.exports = {
    name: 'volume',
    description: 'Set the volume in percentage.',
	aliases: ['vol'],
    usage: '[volumne strengh (low|normal|strong)]',
	cooldown: 1,
    execute(message, args) {
		if(message.channel.type === 'dm') {
			message.reply('you need to be in a server to let me add music to the queue.');
			return;
		}
		if(!args.length) {
			message.reply('you need to give me a YouTube video url.');
			return;
		}
		if(!global.music.voiceConnection) {
			message.reply('I am currently not connected to a voice chat.');
			return;
		}
		if(!global.music.song) {
			message.reply('there is no music currently playing.');
			return;
		}
		if(args[0] <= 0 || args[0] > 100) {	
			message.reply('the volume must be a value between 1 and 100');
			return;
		}

		global.music.song.setVolume(args[0]/100);

		message.reply('volume set.')
    },
};
