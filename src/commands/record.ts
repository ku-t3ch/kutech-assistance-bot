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
import { createAudioResource, EndBehaviorType, joinVoiceChannel, StreamType, VoiceReceiver } from '@discordjs/voice';
import moment from 'moment';
import { createWriteStream } from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream';
import { opus } from 'prism-media';

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
		interaction.reply('Not implemented yet');
		// const { channel } = interaction.options.get('channel');
		// if (channel instanceof VoiceChannel) {
		// 	const connection = joinVoiceChannel({
		// 		channelId: channel.id,
		// 		guildId: channel.guild.id,
		// 		adapterCreator: channel.guild.voiceAdapterCreator, // Should be referring to the correct client
		// 		selfDeaf: false,
		// 		selfMute: false,
		// 	});

		// 	const { receiver } = connection;

		// 	const stopButton = new ButtonBuilder()
		// 		.setCustomId('stop-record')
		// 		.setLabel('StopRecord')
		// 		.setStyle(ButtonStyle.Danger);
		// 	const row = new ActionRowBuilder().addComponents(stopButton);

		// 	const controlInteraction = await interaction.reply({
		// 		content: 'Recording...',
		// 		components: [row as any],
		// 		fetchReply: true,
		// 	});

		// 	const joinTime = moment(new Date());

		// 	const collector = controlInteraction.createMessageComponentCollector({
		// 		componentType: ComponentType.Button,
		// 	});

		// 	const userId = '1198631513676328994';

		// 	const filename = `${userId}-${Date.now()}`;

		// 	const filepath = path.join(__dirname, '/clips', filename) + '.ogg';

		// 	const opusStream = connection.receiver.subscribe('1198631513676328994', {
		// 		// end: {
		// 		// 	behavior: EndBehaviorType.AfterSilence,
		// 		// 	duration: 5000,
		// 		// },
		// 		end: {
		// 			behavior: EndBehaviorType.AfterSilence,
		// 			duration: 100,
		// 		},
		// 	});

		// 	collector.on('collect', (interaction) => {
		// 		if (interaction.customId === 'stop-record') {
		// 			opusStream.destroy();
		// 			connection.destroy();

		// 			const duration = moment.duration(moment(new Date()).diff(joinTime));
		// 			const formattedDuration = moment.utc(duration.asMilliseconds()).format('HH:mm:ss');

		// 			interaction.update({
		// 				components: [],
		// 			});
		// 			controlInteraction.edit({
		// 				content: '',
		// 				components: [],
		// 				embeds: [
		// 					{
		// 						title: 'Record Ended',
		// 						description: `Recorded in ${formattedDuration}

		//                     Download
		//                     https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
		// 						color: 0x0099ff,
		// 					},
		// 				],
		// 			});
		// 		}
		// 	});

		// 	const oggWriter = new opus.OggLogicalBitstream({
		// 		opusHead: new opus.OpusHead({
		// 			channelCount: 2,
		// 			sampleRate: 48000,
		// 		}),
		// 		pageSizeControl: {
		// 			maxPackets: 10,
		// 		},
		// 	});

		// 	const out = createWriteStream(filepath);

		// 	// pipeline(opusStream, oggWriter, createWriteStream(filepath), callback);
		// 	pipeline(opusStream, oggWriter, out, (err) => {
		// 		if (!err) {
		// 			opusStream.destroy();
		// 			oggWriter.destroy();
		// 			console.log('Finished recording ');
		// 		}
		// 	});

		// 	// const resource = createAudioResource(opusStream, { inputType: StreamType.Opus });

		// 	// const rawAudio = opusStream.pipe(new opus.Decoder({ frameSize: 960, channels: 2, rate: 48000 }));

		// 	// rawAudio.pipe(createWriteStream(filepath));

		// 	// const oggStream = new opus.Decoder({
		// 	// 	rate: 48000,
		// 	// 	channels: 2,
		// 	// 	frameSize: 120,
		// 	// });

		// 	// const oggStream = new opus.pipeline(opusStream, oggStream, createWriteStream(filepath), (err) => {
		// 	// 	if (err) {
		// 	// 		console.error(err);
		// 	// 	}
		// 	// });
		// } else {
		// 	interaction.reply({
		// 		content: 'Not a voice channel',
		// 		ephemeral: true,
		// 	});
		// }
	},
} satisfies Command;
