import { ProviderReturnType } from '../types';

type ApiResponse = {
	countries: {
		code: string;
		has_data: boolean;
		visa_free_count: number;
		openness: number;
	}[];
};

const API_URL = 'https://api.henleypassportindex.com/api/v3/countries';

export const getPassportIndex = async (): Promise<ProviderReturnType> => {
	const response = await fetch(API_URL);
	const data: ApiResponse = await response.json();
	return {
		source: 'Henley Passport Index',
		url: 'https://www.henleypassportindex.com/',
		data: data.countries
			.filter((country) => country.has_data)
			.map((country) => {
				return {
					code: country.code,
					statistics: {
						'Visa-free count': country.openness,
						Openness: country.visa_free_count,
					},
				};
			}),
	};
};
