const { prefix } = require('../config/config.json');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const log = require('fancy-log');

module.exports = {
    name: 'clear',
    description: 'Clear the song queue.',
	aliases: ['wipe'],
    usage: '',
	cooldown: 5,
    execute(message, args) {
		if(global.music.queue && global.music.queue.length) {
			global.music.queue = new Array();
		} else {
			message.reply('there isn\'t any song in the queue.');
		}
    },
};
