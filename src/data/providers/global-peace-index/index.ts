import { parse } from 'csv-parse/browser/esm';
import { iso31661Alpha3ToAlpha2 } from 'iso-3166';

import { ProviderReturnType } from '../../types';

export const getGlobalPeaceIndex = async (): Promise<ProviderReturnType> => {
	const data = await import('./peace_index.csv?raw');

	const parsedData: {
		iso3c: string;
		'2023': string;
	}[] = await new Promise((resolve) => {
		parse(
			data.default,
			{
				relaxColumnCount: true,
				delimiter: ';',
				columns: true,
			},
			(err, output) => {
				if (err) {
					throw err;
				}
				resolve(output);
			}
		);
	});

	return {
		source: 'Global Peace Index',
		url: 'https://www.visionofhumanity.org/reports',
		data: parsedData.map((row) => {
			return {
				code: iso31661Alpha3ToAlpha2[row['iso3c']],
				statistics: {
					'Global Peace Index': parseInt(row['2023'].replace(',', '')),
				},
			};
		}),
	};
};
