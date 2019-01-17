const { prefix } = require('../config/config.json');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const fs = require('fs');
const log = require('fancy-log');

module.exports = {
    name: 'pause',
    description: 'Pause the current music.',
    usage: '',
	cooldown: 2,
    execute(message, args) {
		if(message.channel.type === 'dm') {
			message.reply('you need to be in a server to let me add music to the queue.')
			return;
		}
		if(!global.music.song) {
			message.reply('there is no song currently playing.')
		}

		global.music.song.pause();
		message.reply('song paused.')
    },
};
