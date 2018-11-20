const Discord = require('discord.js')
const bot = new Discord.Client()
const ytdl = require('ytdl-core');
const config = require('./config/config.json');
const log = require('fancy-log');
const i18n = require('i18n');
const fs = require('fs')

i18n.configure({
	locales:['fr', 'en'],
	defaultLocale: config.defaultLocale,
	directory: __dirname + '/locales',
	objectNotation: true
});

bot.on('ready', function () {
	log.info(i18n.__('bot.ready'));
})

bot.login(config.token)
	.then(() => {
		log.info(i18n.__('bot.connection.success'));
	})
	.catch((err) => {
		log.warn(i18n.__('bot.connection.error'))
		log.error(err);
	});

var msgReg = "=";
var rawCommandList = [
	'help',
	'prefix',
	'join',
	'play',
	'stop',
	'next',
	'add',
	'quit',
	'playlists'
];
var playlists = require('./db/playlists.json');

var commandList = new Array();
rawCommandList.forEach((command) => {
	let obj = {
		name: command,
		description: i18n.__('command.'+ command +'.description', msgReg)
	};
	commandList.push(obj)
});

var audioConnection = false;
var currentSong = false;
var songQueue = new Array();

bot.on('message', message => {
	let contentArray = message.content.split(' ');
	let cmd = contentArray[0];
	if(!rawCommandList.indexOf(contentArray[0])) {
		message.reply(i18n.__('command.error.notfound'));
	}
	switch(cmd) {
		case msgReg+'help':
			let answer = i18n.__('command.help.info.commandlist') + "\n";
			commandList.forEach(function(command, index) {
				answer += '**' + msgReg + command.name + ' :** ' + command.description + "\n";
			});
			message.reply(answer);
		break;
		case msgReg+'prefix':
			if(contentArray[1]) {
				if(contentArray[1].length == 1) {
					msgReg = contentArray[1];
					message.reply(i18n.__('command.prefix.info.modified', msgReg))
				} else {
					message.reply(i18n.__('command.prefix.warning.toolong'))
				}
			} else {
				message.reply(i18n.__('command.prefix.warning.missing'))
			}
		break;
		case msgReg+'join':
			if(!audioConnection) {
				joinChannel(message)
			} else {
				message.reply(i18n.__('command.join.warning.alreadyconnected'))
			}
		break;
		case msgReg+'play':
			if(!audioConnection) {
				joinChannel(message).then(() => {
					currentSong = audioConnection.playArbitraryInput(ytdl(contentArray[1]), {filter: 'audioonly'});
					message.reply(i18n.__('command.play.info.letsgo'))
					playNextSong(currentSong, message);
				});
			} else {
				currentSong = audioConnection.playArbitraryInput(ytdl(contentArray[1]), {filter: 'audioonly'});
				message.reply(i18n.__('command.play.info.letsgo'))
				playNextSong(currentSong, message);
			}
		break;
		case msgReg+'stop':
			clearSongQueue();
			stopCurrentSong(message);
		break;
		case msgReg+'next':
			if(currentSong) {
				currentSong.end();
			} else {
				message.reply(i18n.__('command.next.warning.nocurrentsong'))
			}
		break;
		case msgReg+'quit':
			if(audioConnection) {
				stopCurrentSong(message);
				audioConnection.disconnect();
				audioConnection = false;
				clearSongQueue();
				message.reply(i18n.__('command.quit.info.disconnecting'))
			} else {
				message.reply(i18n.__('command.quit.warning.notconnected'))
			}
		break;
		case msgReg+'pause':
			pauseCurrentSong(message);
		break;
		case msgReg+'resume':
			resumeCurrentSong(message);
		break;
		case msgReg+'add':
			if(validateYouTubeUrl(contentArray[1])) {
				songQueue.push(contentArray[1]);
				message.reply(i18n.__('command.add.info.added'))
			} else {
				message.reply(i18n.__('command.add.warning.invalidurl'))
			}
		break;
		case msgReg+'playlists':
			if(!contentArray[1]) {
				let toReply = i18n.__('command.playlists.list.info.playlistintro') + "\n";
				playlists.forEach((playlist) => {
					toReply += i18n.__('command.playlists.list.info.playlist', {name: playlist.name, length: playlist.songs.length}) + "\n";
				});
				message.reply(toReply);
			} else {
				switch(contentArray[1]) {
					case 'create':
						if(contentArray[2]) {
							let alreadyExist = false;
							playlists.forEach((playlist) => {
								if(playlist.name == contentArray[2]) alreadyExist = true
							})
							if(!alreadyExist) {
								let playlist = {
									name: contentArray[2]
								};
								let songs = new Array();
								for(var i = 3; i < contentArray.length; i++) {
									if(validateYouTubeUrl(contentArray[i])) songs.push(contentArray[i]);
								}
								playlist.songs = songs;
								playlists.push(playlist);
								playlistsJSON = JSON.stringify(playlists);
								fs.writeFileSync('./db/playlists.json', playlistsJSON);
								message.reply(i18n.__('command.playlists.create.info.created', playlist.name));
							} else {
								message.reply(i18n.__('command.playlists.create.warning.alreadyexist', playlist.name));
							}
						} else {
							message.reply(i18n.__('command.playlists.create.warning.noname'));
						}
					break;
					case 'play':
						if(contentArray[2]) {
							let toPlaySong;
							playlists.forEach((playlist) => {
								if(playlist.name == contentArray[2]) {
									clearSongQueue();
									playlist.songs.forEach(song => {
										songQueue.push(song);
									});
									toPlaySong = songQueue[0];
									songQueue.splice(0, 1);
								}
							})
							if(!audioConnection) {
								joinChannel(message).then(() => {
									currentSong = audioConnection.playArbitraryInput(ytdl(toPlaySong), {filter: 'audioonly'});
									message.reply(i18n.__('command.play.info.letsgo'))
									playNextSong(currentSong, message);
								});
							} else {
								currentSong = audioConnection.playArbitraryInput(ytdl(toPlaySong), {filter: 'audioonly'});
								message.reply(i18n.__('command.play.info.letsgo'))
								playNextSong(currentSong, message);
							}
						} else {
							message.reply(i18n.__('command.playlists.play.warning.noname'));
						}
					break;
				}
			}
		break;
	}
})

function playNextSong(song, msg) {
	song.on('end', () => {
		if(songQueue.length > 0) {
			currentSong = audioConnection.playArbitraryInput(ytdl(songQueue[0]), {filter: 'audioonly'});
			msg.reply(i18n.__('command.play.info.nextsong', songQueue[0]))
			songQueue.splice(0, 1);
			playNextSong(currentSong, msg);
		} else {
			msg.reply(i18n.__('command.play.warning.emptyplaylist'))
		}
	});
}

function clearSongQueue() {
	songQueue = new Array();
}

function joinChannel(message) {
	return new Promise((resolve, reject) => {
		if(!message.guild) reject();
		if(message.member.voiceChannel) {
			message.member.voiceChannel.join()
				.then(connection => {
					audioConnection = connection;
					message.reply(i18n.__('command.join.info.connected', msgReg))
					//message.reply('Je suis désormais connecté à votre salon. Lancer une musique avec la commande "'+msgReg+'play".');
					resolve();
				})
				.catch((err) => {
					log.error(i18n.__('command.join.error.cantconnect'));
					log.error(err);
				});
		} else {
			reject();
			message.reply(i18n.__('command.join.warning.notinchannel'))
			//message.reply('Vous devez être dans un salon pour que je puisse vous rejoindre.');
		}
	});
}

async function awaitJoinChannel(message) {
	var j = await joinChannel(message);
}

function validateYouTubeUrl(url) {
	if (url != undefined || url != '') {
		var regExp = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/;
		var match = url.match(regExp);
		var isValid = false;
		if (match) {
			isValid = true;
		}
		return isValid;
	}
}

function stopCurrentSong(msg) {
	if(currentSong) {
		currentSong.end();
		currentSong = false;
		msg.reply(i18n.__('command.stop.info.end'))
		//msg.reply('Fin de l\'écoute.');
	} else {
		msg.reply(i18n.__('command.stop.warning.nocurrentsong'))
		//msg.reply('Aucune musique n\'est actuellement jouée.');
	}
}

function pauseCurrentSong(message) {
	if(currentSong) {
		currentSong.pause();
		message.reply(i18n.__('command.pause.info.paused'))
		//message.reply('Écoute en pause.');
	} else {
		message.reply(i18n.__('command.stop.warning.nocurrentsong'))
		//message.reply('Aucune musique n\'est actuellement jouée.');
	}
}

function resumeCurrentSong(message) {
	if(currentSong) {
		currentSong.resume();
		message.reply(i18n.__('command.resume.info.resumed'))
		//message.reply('Reprise de l\'écoute.');
	} else {
		message.reply(i18n.__('command.stop.warning.nocurrentsong'))
		//message.reply('Aucune musique n\'est actuellement jouée.');
	}
}
