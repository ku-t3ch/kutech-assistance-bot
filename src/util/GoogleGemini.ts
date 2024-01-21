import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Part, GenerationConfig } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY;

type ImageData = {
	mimeType: string;
	data: string;
};

interface GeminiParametersInterface {
	prompt: string;
	imageData?: ImageData;
	generationConfig?: GenerationConfig;
}

async function runGemini(config: GeminiParametersInterface) {
	const genAI = new GoogleGenerativeAI(API_KEY);
	const MODEL_NAME = config.imageData ? 'gemini-pro-vision' : 'gemini-pro';
	const model = genAI.getGenerativeModel({ model: MODEL_NAME });

	const generationConfig: GenerationConfig = {
		temperature: config.generationConfig?.temperature ?? 0.9,
		topK: config.generationConfig?.topK ?? 1,
		topP: config.generationConfig?.topP ?? 1,
		maxOutputTokens: config.generationConfig?.maxOutputTokens ?? 2000,
	};

	const safetySettings = [
		{
			category: HarmCategory.HARM_CATEGORY_HARASSMENT,
			threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
		},
		{
			category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
			threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
		},
		{
			category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
			threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
		},
		{
			category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
			threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
		},
	];

	let parts: Part[] = [{ text: config.prompt }];

	if (config.imageData) {
		parts.push({
			inlineData: config.imageData,
		});
	}

	const result = await model.generateContent({
		contents: [{ role: 'user', parts }],
		generationConfig,
		safetySettings,
	});
	return result;
}

export { runGemini };
