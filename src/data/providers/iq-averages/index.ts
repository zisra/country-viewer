import { ProviderReturnType } from '../../types';
import { nameToISOCode } from '../../util/normalize-iso';

function processData(data: string): {
	code: string;
	niq: number;
}[] {
	const rows = data.trim().split('\n');
	const result = [];

	// Process each row except the header
	for (let i = 1; i < rows.length; i++) {
		const row = rows[i].trim();

		const array = row.split(' ').filter((i) => i !== '');

		const niq = parseFloat(array[array.length - 2]);

		array.splice(0, 1);
		array.splice(array.length - 2, 2);
		const name = array.join(' ');

		result.push({
			code: nameToISOCode(name),
			niq,
		});
	}
	return result;
}

export const getIQAverages = async (): Promise<ProviderReturnType> => {
	const data = await import('./data.txt?raw');
	const processedData = processData(data.default);

	return {
		source: 'Jensen & Kirkegaard, 2024',
		url: 'https://osf.io/preprints/psyarxiv/bx86g',
		data: processedData.map((country) => ({
			code: country.code,
			statistics: {
				'National IQ': country.niq,
			},
		})),
	};
};
