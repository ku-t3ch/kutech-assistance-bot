import { ApplicationCommandOptionType } from 'discord.js';
import { runGemini } from '../util/GoogleGemini.ts';
import type { Command } from './index.ts';

export default {
	data: {
		name: 'ask',
		description: 'Ask with Gemini.',
		options: [
			{
				name: 'prompt',
				description: 'Your prompt',
				type: ApplicationCommandOptionType.String,
				required: true,
			},
			{
				name: 'length',
				description: 'The length of the output token. (Default: 2000 Max: 2000)',
				type: ApplicationCommandOptionType.Number,
				max_value: 2_000,
				min_value: 500,
				required: false,
			},
		],
	},
	async execute(interaction) {
		const prompt = interaction.options.get('prompt');
		const length = interaction.options.get('length');

		const loading = await interaction.reply({
			embeds: [
				{
					description: `**Loading...**`,
				},
			],
			fetchReply: true,
		});

		const result = await runGemini({
			prompt: prompt.value as string,
			generationConfig: {
				maxOutputTokens: length?.value as number,
			},
		});

		loading.edit({
			embeds: [
				{
					description: result.response.text(),
					footer: {
						text: 'Powered by Gemini Pro',
						icon_url: 'https://media.discordapp.net/attachments/1038013715464851518/1198365425700974752/Group_25.png',
					},
					color: 0x0099ff,
				},
			],
		});
	},
} satisfies Command;
