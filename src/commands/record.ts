import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ButtonBuilder,
	ButtonStyle,
	ComponentBuilder,
	ComponentType,
	VoiceChannel,
} from 'discord.js';
import type { Command } from './index.ts';
import { joinVoiceChannel } from '@discordjs/voice';
import moment from 'moment';

export default {
	data: {
		name: 'record',
		description: 'Voice recording',
		options: [
			{
				name: 'channel',
				description: 'Your prompt',
				type: ApplicationCommandOptionType.Channel,
				required: true,
			},
		],
	},
	async execute(interaction) {
		const { channel } = interaction.options.get('channel');
		if (channel instanceof VoiceChannel) {
			const connection = joinVoiceChannel({
				channelId: channel.id,
				guildId: channel.guild.id,
				adapterCreator: channel.guild.voiceAdapterCreator, // Should be referring to the correct client
			});

			const stopButton = new ButtonBuilder()
				.setCustomId('stop-record')
				.setLabel('StopRecord')
				.setStyle(ButtonStyle.Danger);
			const row = new ActionRowBuilder().addComponents(stopButton);

			const controlInteraction = await interaction.reply({
				content: 'Recording...',
				components: [row as any],
				fetchReply: true,
			});
			const joinTime = new Date();

			const collector = controlInteraction.createMessageComponentCollector({
				componentType: ComponentType.Button,
			});

			collector.on('collect', (interaction) => {
				if (interaction.customId === 'stop-record') {
					connection.destroy();
					const dulation = new Date().getTime() - joinTime.getTime();
					interaction.update({
						content: `Recorded in ${moment(dulation).format('HH:mm:ss')}`,
						components: [],
					});
				}
			});
		} else {
			interaction.reply({
				content: 'Not a voice channel',
				ephemeral: true,
			});
		}
	},
} satisfies Command;
