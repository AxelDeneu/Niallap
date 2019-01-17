const { prefix } = require('../config/config.json');
const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '[command name]',
	cooldown: 5,
    execute(message, args) {
        const embed = new Discord.RichEmbed()
		const { commands } = message.client;

		if (!args.length) {
			embed.setColor('#09bc8a');
			embed.setTitle('Commands list');
			commands.map(command => {
				embed.addField(command.name, command.description);
			});
			embed.addBlankField();
			embed.addField('Specific help', `\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

			return message.author.send(embed)
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => {
					log.error(`Could not send help DM to ${message.author.tag}`);
					log.error(error);
					message.reply('it seems like I can\'t DM you!');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		embed.setColor('#09bc8a');
		embed.setTitle(`Informations about ${command.name}`);
		embed.addField('**Name:**', command.name, true);

		if (command.aliases) embed.addField('**Aliases:**', command.aliases.join(', '), true);
		if (command.description) embed.addField('**Description:**', command.description);
		if (command.usage) embed.addField('**Usage:**', `${prefix}${command.name} ${command.usage}`, true);

		embed.addField('**Cooldown:**', `${command.cooldown || 3} second(s)`);

		message.channel.send(embed);
    },
};
