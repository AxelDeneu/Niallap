const { prefix } = require('../config/config.json');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const fs = require('fs');
const log = require('fancy-log');

module.exports = {
    name: 'add',
    description: 'Add a music to the queue.',
    usage: '[yt video url]',
	cooldown: 2,
    execute(message, args) {
		if(message.channel.type === 'dm') {
			message.reply('you need to be in a server to let me add music to the queue.')
			return;
		}
		if(!args.length) {
			message.reply('you need to give me a YouTube video url.');
			return;
		}
		if(!ytdl.validateURL(args[0])) {
			message.reply('this is not a valid YouTube video URL.');
			return;
		}

		const music = ytdl(args[0], {
			filter: 'audioonly',
			quality: 'highestaudio'
		});
		ytdl.getInfo(args[0], (err, info) => {
			if(err) {
				log.error(`Unable to get informations about the YouTube video : ${args[0]}`);
				log.error(err);
				message.reply('it seems like I can\'t add this music to the queue.');
				return;
			}
			
			global.music.queue.push(music);
			const embed = new Discord.RichEmbed()
				.setColor('#09bc8a')
				.setTitle(`Added to queue : ${info.title}`)
				.setURL(args[0]);
			message.channel.send(embed);
		})
    },
};
