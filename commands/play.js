const { prefix } = require('../config/config.json');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');

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
			message.reply('you need to give me a YouTube video url.');
			return;
		}
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
				const music = ytdl(args[0], {
					quality: 'highestaudio',
					filter: 'audioonly',
					highWaterMark: 12,
				});
				ytdl.getInfo(args[0], (err, info) => {
					if(err) {
						log.error(`Unable to get informations about the YouTube video : ${args[0]}`);
						log.error(err);
						message.reply('it seems like I can\'t play this music.');
						return;
					}
					
					const embed = new Discord.RichEmbed()
						.setColor('#09bc8a')
						.setTitle(`Now Playing : ${info.title}`)
						.setURL(args[0]);
					message.channel.send(embed);

					const dispatcher = connection.playStream(music);
					dispatcher.on('end', () => {
						message.member.voiceChannel.leave();
					})
				})
			})
			.catch((err) => {
				log.error(`Could not join the user channel of ${message.author.tag}`);
				message.reply('it seems like I can\t join your channel.');
			});
    },
};
