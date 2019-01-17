const Youtube = require('youtube-api');
const fs = require('fs');
const dbPath = __dirname + '/../db/youtube.json';
const { youtube } = require('../config/config.json');
const CREDENTIALS = youtube;

function loadDb(path) {
	try {
		global.db = JSON.parse(fs.readFileSync(path, 'utf8'));
	} catch (err) {
		console.log(err);
	}
}

function saveDb(path) {
	try {
		fs.writeFileSync(path, JSON.stringify(global.db))
	} catch (err) {
		console.error(err)
	}
}

function getChannelId(channelUrl) {
	var regex = new RegExp('^(https?:\/\/)?(www\.)?youtube\.com/(user/)?([a-z\-_0-9]+)/?([\?#]?.*)', 'i');
	var matches = channelUrl.match(regex);

	if(matches) {
		return matches[5];
	}
	return false;
}

function saveChannel(channelId) {
	loadDb(dbPath);
	Youtube.channels.list({
		key: youtube.key,
		id: channelId,
		part: "snippet",
	}, function(err, response) {
		global.db[channelId] = {};
		global.db[channelId].name = response.items[0].snippet.title;
		saveDb(dbPath)
	});
}

saveChannel(getChannelId('https://www.youtube.com/channel/UCvuACILbubOXV_OMBWqLM2g'));

