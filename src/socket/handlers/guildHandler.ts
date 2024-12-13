import type { Socket } from 'socket.io';
import type Lavamusic from '@/structures/Lavamusic';
import type { JsonObject } from '@prisma/client/runtime/library';

export default function guildHandler(socket: Socket, client: Lavamusic) {
	socket.on('guild:guildDj', async (guildId: string) => {
		if (!guildId) {
			return socket.emit('guild:guildDj:error', 'No guildId provided');
		}

		socket.join(guildId);

		try {
			const guildDj = await client.dbNew.getGuildDj(guildId);
			return socket.emit('guild:guildDj:success', {
				mode: guildDj?.Mode ?? false,
				roles: guildDj?.Roles || [],
			});
		} catch (error) {
			return socket.emit('guild:guildDj:error', error instanceof Error ? error.message : 'Unknown error');
		}
	});

	socket.on('guild:guildConfig', async (guildId: string) => {
		if (!guildId) {
			return socket.emit('guild:guildConfig:error', 'No guildId provided');
		}

		socket.join(guildId);
		const player = client.manager.players.get(guildId);

		try {
			const guildConfig = await client.dbNew.getGuildConfig(guildId);
			const config = guildConfig?.Config as JsonObject;
			return socket.emit('guild:guildConfig:success', {
				authMode: config?.authMode as boolean ?? false,
				silentMode: player?.get('silentMode') ?? false
			});
		} catch (error) {
			return socket.emit('guild:guildConfig:error', error instanceof Error ? error.message : 'Unknown error');
		}
	});
}
