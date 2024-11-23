// https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&per_page=300&mrv=1

import { iso31661 } from 'iso-3166';
import { ConditionalData, ProviderReturnType } from '../types';

type ApiResponse = [
	{
		page: number;
		pages: number;
		per_page: number;
		total: number;
		sourceid: string;
		lastupdated: string;
	},
	{
		indicator: {
			id: string;
			value: string;
		};
		country: {
			id: string;
			value: string;
		};
		countryiso3code: string;
		date: string;
		value: string;
	}[]
];

const indicators: Record<string, string> = {
	'SP.POP.TOTL': 'Population',
	'EN.POP.DNST': 'Population density',
	'NY.GDP.MKTP.CD': 'GDP ($)',
	'NY.GDP.PCAP.CD': 'GDP per capita ($)',
	'SP.DYN.LE00.IN': 'Life expectancy',
	'SL.UEM.TOTL.ZS': 'Unemployment rate',
	'FP.CPI.TOTL': 'Consumer Price Index',
};

function generateUrl(indicator: string) {
	const baseUrl = `https://api.worldbank.org/v2/country/all/indicator/${indicator}?format=json&per_page=300&mrv=1`;
	return baseUrl;
}

export const getWorldBankData = async (): Promise<ProviderReturnType> => {
	const rawData = await Promise.all(
		Object.keys(indicators).map(async (indicator) => {
			const url = generateUrl(indicator);
			const response = await fetch(url);
			const data: ApiResponse = await response.json();

			return data[1]
				.filter((country) => {
					const listOfCountries = iso31661.map((country) => country.alpha3);
					return listOfCountries.includes(country.countryiso3code);
				})
				.map((country) => ({
					code: country.country.id,
					indicator: indicators[indicator],
					value: country.value,
				}));
		})
	);

	const countryData: { [key: string]: ConditionalData } = {};

	rawData.flat().forEach((entry) => {
		if (!countryData[entry.code]) {
			countryData[entry.code] = {
				code: entry.code,
				statistics: {},
			};
		}

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		countryData[entry.code].statistics[entry.indicator] = entry.value;
	});

	return {
		source: 'World Bank',
		url: 'https://www.worldbank.org/',
		data: Object.values(countryData),
	};
};
