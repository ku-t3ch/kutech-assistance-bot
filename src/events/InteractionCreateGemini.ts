import { Events } from 'discord.js';
import { Event } from './index';
import { runGemini } from '../util/GoogleGemini';
import axios from 'axios';

export default {
	name: Events.MessageCreate,
	async execute(message) {
		if (message.mentions.has(message.client.user.id)) {
			const prompt = message.content.split(`${message.client.user.id}>`)[1];
			const loading = await message.reply({
				embeds: [
					{
						description: `**Loading...**`,
					},
				],
			});

			const { data } = await axios.get(message.attachments.first()!!.url, {
				responseType: 'arraybuffer',
			});

			const imageBase64 = Buffer.from(data).toString('base64');

			const result = await runGemini({
				prompt: prompt,
				imageData: {
					data: imageBase64,
					mimeType: message.attachments.first()!!.contentType as string,
				},
			});

			loading.edit({
				embeds: [
					{
						description: result.response.text(),
						footer: {
							text: 'Powered by Gemini Pro Vision',
							icon_url: 'https://media.discordapp.net/attachments/1038013715464851518/1198365425700974752/Group_25.png',
						},
						color: 0x0099ff,
					},
				],
			});
		}
	},
} satisfies Event<Events.MessageCreate>;
