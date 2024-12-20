import { Command, type Context, type Lavamusic } from '../../structures/index';
import { EmbedBuilder } from 'discord.js';
import { fetch } from 'undici';

export default class ActivePlayer extends Command {
	constructor(client: Lavamusic) {
		super(client, {
			name: 'active-player',
			description: {
				content: 'Get information about active players',
				examples: ['active-player'],
				usage: 'active-player',
			},
			category: 'dev',
			aliases: ['acp'],
			cooldown: 3,
			args: false,
			player: {
				voice: false,
				dj: false,
				active: false,
				djPerm: null,
			},
			permissions: {
				dev: true,
				client: ['SendMessages', 'ReadMessageHistory', 'ViewChannel', 'EmbedLinks'],
				user: [],
			},
			slashCommand: false,
			options: [],
		});
	}

	public async run(client: Lavamusic, ctx: Context): Promise<any> {
		const players = client.manager.players;
		if (!players.size) {
			const embed = new EmbedBuilder()
				.setDescription('No active players found')
				.setColor(client.color.main);
			return ctx.sendMessage({ embeds: [embed] });
		}

		let playerList = '';
		for (const [guildId, player] of players) {
			const guild = client.guilds.cache.get(guildId);
			const textChannel = client.channels.cache.get(player.textChannelId!) as any;
			const voiceChannel = client.channels.cache.get(player.voiceChannelId!) as any;

			playerList += `Guild Name: ${guild?.name || 'Unknown'}\n`;
			playerList += `Guild ID: ${guildId}\n`;
			playerList += `Text Channel: #${textChannel?.name || 'unknown'} (${player.textChannelId})\n`;
			playerList += `Voice Channel: #${voiceChannel?.name || 'unknown'} (${player.voiceChannelId})\n`;
			playerList += '------------------------\n\n';
		}

		const playerInfoEmbed = new EmbedBuilder()
			.setTitle('📊 Active Players Information')
			.setColor(client.color.main)
			.setTimestamp()
			.setFooter({ text: `Total Active Players: ${players.size}` });

		if (playerList.length > 2000) {
			try {
				const response = await fetch('https://hasteb.in/post', {
					method: 'POST',
					headers: {
						'Content-Type': 'text/plain',
					},
					body: playerList,
				});
				const json: any = await response.json();
				const hastebinUrl = `https://hasteb.in/${json.key}`;

				playerInfoEmbed.setDescription(`Player list is too long. View the full list here: ${hastebinUrl}`);
			} catch (error) {
				playerInfoEmbed.setDescription('Error creating Hastebin link. Too many players to display.');
			}
		} else {
			playerInfoEmbed.setDescription(playerList || 'No player information available');
		}

		return ctx.sendMessage({ embeds: [playerInfoEmbed] });
	}
}