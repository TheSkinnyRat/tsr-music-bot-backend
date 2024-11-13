import { PrismaClient } from '../../prisma/prisma.client.new';
import type { Dj, GuildConfig, Histories } from '../../prisma/prisma.client.new';
// import { env } from '../env';

export default class ServerData {
	private prisma: PrismaClient;

	constructor() {
		this.prisma = new PrismaClient();
	}

	public async getGuildConfig(guildId: string): Promise<GuildConfig | null> {
		return this.prisma.guildConfig.findUnique({ where: { GuildId: guildId } });
	}

	public async createGuildConfig(guildId: string, config: GuildConfig['Config']): Promise<GuildConfig> {
		return this.prisma.guildConfig.create({ data: { GuildId: guildId, Config: config as any } });
	}

	public async updateGuildConfig(guildId: string, config: GuildConfig['Config']): Promise<GuildConfig> {
		return this.prisma.guildConfig.update({ where: { GuildId: guildId }, data: { Config: config as any } });
	}

	public async getGuildDj(guildId: string): Promise<Dj | null> {
		return this.prisma.dj.findUnique({ where: { Guild: guildId } });
	}

	public async createGuildDj(guildId: string, dj: Pick<Dj, 'Mode' | 'Roles'>): Promise<Dj> {
		return this.prisma.dj.create({ data: { Guild: guildId, ...dj } });
	}

	public async updateGuildDj(guildId: string, dj: Pick<Dj, 'Mode' | 'Roles'>): Promise<Dj> {
		return this.prisma.dj.update({ where: { Guild: guildId }, data: dj });
	}

	public async deleteGuildDj(guildId: string): Promise<void> {
		await this.prisma.dj.delete({ where: { Guild: guildId } });
	}

	public async getGuildHistory(guildId: string): Promise<Histories | null> {
		return this.prisma.histories.findUnique({ where: { GuildId: guildId } });
	}

	public async getGuildPlaylists(guildId: string) {
		return this.prisma.guildPlaylist.findMany({
			where: { GuildId: guildId }
		});
	}

	public async createGuildPlaylist(guildId: string, name: string) {
		return this.prisma.guildPlaylist.create({
			data: {
				GuildId: guildId,
				PlaylistName: name,
				Playlist: [],
				CreatedOn: Math.floor(Date.now() / 1000)
			}
		});
	}

	public async getGuildPlaylist(guildId: string, playlistId: string) {
		return this.prisma.guildPlaylist.findFirst({
			where: {
				id: playlistId,
				GuildId: guildId
			}
		});
	}

	public async deleteGuildPlaylist(guildId: string, playlistId: string) {
		return this.prisma.guildPlaylist.delete({
			where: {
				id: playlistId,
				GuildId: guildId
			}
		});
	}

	public async addTrackToPlaylist(guildId: string, playlistId: string, track: any) {
		const playlist = await this.getGuildPlaylist(guildId, playlistId);
		const tracks = playlist?.Playlist as any[] || [];

		return this.prisma.guildPlaylist.update({
			where: {
				id: playlistId,
				GuildId: guildId
			},
			data: {
				Playlist: [...tracks, track]
			}
		});
	}

	public async removeTrackFromPlaylist(guildId: string, playlistId: string, trackId: string) {
		const playlist = await this.getGuildPlaylist(guildId, playlistId);
		const tracks = (playlist?.Playlist as any[]).filter(track => track.id !== trackId);

		return this.prisma.guildPlaylist.update({
			where: {
				id: playlistId,
				GuildId: guildId
			},
			data: {
				Playlist: tracks
			}
		});
	}

	public async addTracksToPlaylist(guildId: string, playlistId: string, newTracks: any[]) {
		const playlist = await this.getGuildPlaylist(guildId, playlistId);
		const existingTracks = playlist?.Playlist as any[] || [];

		return this.prisma.guildPlaylist.update({
			where: {
				id: playlistId,
				GuildId: guildId
			},
			data: {
				Playlist: [...existingTracks, ...newTracks]
			}
		});
	}
}
