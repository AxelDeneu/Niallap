const { prefix } = require('../config/config.json');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const log = require('fancy-log');

module.exports = {
    name: 'stop',
    description: 'Stop the currently playing video and wipe the queue.',
    usage: '',
	cooldown: 5,
    execute(message, args) {
		if(!global.music.song) {
			message.reply('there isn\'t any song currently played.');
			return;	
		}

		if(global.music.queue && global.music.queue.length) {
			global.music.queue = new Array();
		}
		
		global.music.song.end();
		global.music.song = false;
    },
};
