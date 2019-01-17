const { prefix } = require('../config/config.json');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const fs = require('fs');
const log = require('fancy-log');

module.exports = {
    name: 'play',
    description: 'Play a YouTube URL in the background.',
    usage: '[yt video url]',
	cooldown: 5,
    execute(message, args) {
		if(message.channel.type === 'dm') {
			message.reply('you need to be in a server to let me play music for you.')
			return;
		}
		if(!args.length) {
			message.member.voiceChannel.join()
				.then(connection => {
					global.music.voiceConnection = connection;
					playNextSong();
				})
				.catch((err) => {
					log.error(`Could not join the user channel of ${message.author.tag}`);
					log.error(err);
					message.reply('it seems like I can\t join your channel.');
				});
		} else {
			if(!ytdl.validateURL(args[0])) {
				message.reply('this is not a valid YouTube video URL.');
				return;
			}
			if(!message.member.voiceChannel) {
				message.reply('you need to be in a voice channel.');
				return;
			}

			message.member.voiceChannel.join()
				.then(connection => {
					global.music.voiceConnection = connection;
					const music = ytdl(args[0], {
						filter: 'audioonly',
						quality: 'highestaudio'
					});
					ytdl.getInfo(args[0], (err, info) => {
						if(err) {
							log.error(`Unable to get informations about the YouTube video : ${args[0]}`);
							log.error(err);
							message.reply('it seems like I can\'t play this music. See the logs for more informations.');
							return;
						}
						
						const embed = new Discord.RichEmbed()
							.setColor('#09bc8a')
							.setTitle(`Now Playing : ${info.title}`)
							.setURL(args[0]);
						message.channel.send(embed);

						const dispatcher = connection.playStream(music);
						global.music.song = dispatcher;
						dispatcher.on('end', () => {
							playNextSong();
						})
					})
				})
				.catch((err) => {
					log.error(`Could not join the user channel of ${message.author.tag}`);
					log.error(err);
					message.reply('it seems like I can\t join your channel.');
				});
		}

		function playNextSong() {
			if(global.music.queue.length) {
				if(!global.music.voiceConnection) return;

				const dispatcher = global.music.voiceConnection.playStream(global.music.queue[0]);
				global.music.song = dispatcher;
				global.music.queue.shift();
				global.music.song.on('end', () => {
					playNextSong();
				})
			} else {
				const embed = new Discord.RichEmbed()
					.setColor('#09bc8a')
					.setTitle(`No more songs in the queue.`)
				message.channel.send(embed);
			}
		}
    },
};
