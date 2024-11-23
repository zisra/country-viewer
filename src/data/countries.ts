import { iso31661 } from 'iso-3166';

import { CountryStructure, ProviderReturnType } from './types';
import { getIQAverages } from './providers/iq-averages';
import { getPassportIndex } from './providers/passport-index';
import { getWorldBankData } from './providers/world-bank';
import { getGlobalPeaceIndex } from './providers/global-peace-index';

const countries = iso31661;

export const loadConditionalData = async (): Promise<ProviderReturnType[]> => {
	return Promise.all([
		getIQAverages(),
		getPassportIndex(),
		getWorldBankData(),
		getGlobalPeaceIndex(),
	]);
};

export const applyConditionalData = (
	data: ProviderReturnType[]
): CountryStructure => {
	const countriesData = getData();
	data.forEach((providerData) => {
		providerData.data.forEach((conditionalData) => {
			const country = countriesData.countries.find(
				(country) => country.ISO31161Data.alpha2 === conditionalData.code
			);
			if (country) {
				if (!country.conditionalData) {
					country.conditionalData = [];
				}
				country.conditionalData.push(conditionalData);
			}
		});
	});
	return countriesData;
};

export const getData = (): CountryStructure => {
	return {
		lastUpdated: new Date(),
		countries: countries.map((country) => ({
			ISO31161Data: {
				name: country.name,
				alpha2: country.alpha2,
				numeric: country.numeric,
			},
			conditionalData: undefined,
		})),
	};
};
