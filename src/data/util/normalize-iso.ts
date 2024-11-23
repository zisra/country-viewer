import { iso31661 } from 'iso-3166';

const manualCountries: { [key: string]: string } = {
	'Hong Kong SAR China': 'HK',
	'Macau SAR China': 'MO',
	Vietnam: 'VN',
	'United States': 'US',
	'United Kingdom': 'GB',
	'Palestinian Territories': 'PS',
	Russia: 'RU',
	Turkey: 'TR',
	Brunei: 'BN',
	Laos: 'LA',
	Iran: 'IR',
	Venezuela: 'VE',
	Bolivia: 'BO',
	Syria: 'SY',
	'<NA>': 'NA',
	Myanmar: 'MM',
	'Macao SAR China': 'MO',
	'Hong Kong': 'HK',
	'South Korea': 'KR',
	'North Korea': 'KP',
	'Myanmar (Burma)': 'MM',
	'Cape Verde': 'CV',
	'St. Vincent & Grenadines': 'VC',
	'Congo - Brazzaville': 'CG',
	'Côte d’Ivoire': 'CI',
	'Congo - Kinshasa': 'CD',
	'São Tomé & Príncipe': 'ST',
};

/* const excludeCountries: [
	'Antartica',
	'Faroe Islands',
	'United States Minor Outlying Islands',
	'Åland Islands',
	'United States Minor Outlying Islands'
]; */

export const nameToISOCode = (name: string) => {
	if (manualCountries[name]) {
		return manualCountries[name];
	}

	const country = iso31661.find((c) => {
		name = name.replace('&', 'and');
		name = name.replace('St.', 'Saint');
		if (c.name === name) {
			return c;
		} else if (c.name.split(',')[0] === name) {
			return c;
		} else {
			return null;
		}
	});
	if (!country) {
		throw new Error(`Country not found: ${name}`);
	}
	return country.alpha2;
};
