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
import { EndBehaviorType, joinVoiceChannel, VoiceReceiver } from '@discordjs/voice';
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
				selfDeaf: false,
				selfMute: false,
			});

			const { receiver } = connection;

			connection.on('');

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

			const joinTime = moment(new Date());

			const collector = controlInteraction.createMessageComponentCollector({
				componentType: ComponentType.Button,
			});

			collector.on('collect', (interaction) => {
				if (interaction.customId === 'stop-record') {
					connection.destroy();
					const duration = moment.duration(moment(new Date()).diff(joinTime));
					const formattedDuration = moment.utc(duration.asMilliseconds()).format('HH:mm:ss');

					interaction.update({
						components: [],
					});
					controlInteraction.edit({
						content: '',
						components: [],
						embeds: [
							{
								title: 'Record Ended',
								description: `Recorded in ${formattedDuration}

                            Download 
                            https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
								color: 0x0099ff,
							},
						],
					});
				}
			});

			const audioReceiveStream = connection.receiver.subscribe('1198631513676328994', {
				end: {
					behavior: EndBehaviorType.Manual,
				},
			});
		} else {
			interaction.reply({
				content: 'Not a voice channel',
				ephemeral: true,
			});
		}
	},
} satisfies Command;
