import axios from 'axios';
import type { Command } from './index.ts';
import { ApiResponeInterface } from '../interfaces/commands/ig/ApiResponeInterface.ts';
import { caching } from 'cache-manager';

export default {
	data: {
		name: 'ig',
		description: 'Lookup KUTech IG.',
	},
	async execute(interaction) {
		const loadingInteraction = await interaction.reply('Loading...');

		const { data } = await axios<ApiResponeInterface>(JSON.parse(process.env.RAPID_INSTAGRAM));
		loadingInteraction.edit({
			content: '',
			embeds: [
				{
					title: data.username,
					description: data.biography,
					thumbnail: {
						url: data.profile_pic_url_hd,
					},
					url: 'https://www.instagram.com/ku.t3ch',
					fields: [
						{
							name: 'Followers',
							value: `${data.edge_followed_by.count}`,
						},
						{
							name: 'Following',
							value: `${data.edge_follow.count}`,
						},
						{
							name: 'Media',
							value: `${data.edge_owner_to_timeline_media.count}`,
						},
					],
				},
			],
		});
	},
} satisfies Command;
