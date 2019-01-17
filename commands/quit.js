const { prefix } = require('../config/config.json');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const fs = require('fs');
const log = require('fancy-log');

module.exports = {
    name: 'quit',
    description: 'Quit the voice channel and stop the music.',
	aliases: ['disconnect'],
    usage: '',
	cooldown: 2,
    execute(message, args) {
		if(message.channel.type === 'dm') {
			message.reply('you need to be in a server to let me add music to the queue.')
			return;
		}
		if(!global.music.voiceConnection) {
			message.reply('i am currently not connected to a voice chat.')
		}
		if(global.music.song) {
			global.music.song.end();
			global.music.song = false;
		}
		if(global.music.queue && global.music.queue.length) {
			global.music.queue = new Array();
		}	

		global.music.voiceConnection.disconnect();
		message.reply('disconnection...')
    },
};
