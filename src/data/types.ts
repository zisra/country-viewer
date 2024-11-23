export type CountryStructure = {
	lastUpdated: Date;
	countries: Country[];
};

export type Country = {
	ISO31161Data: {
		name: string;
		alpha2: string;
		numeric: string;
	};
	conditionalData?: ConditionalData[];
};

export type ConditionalData = {
	code: string;
	statistics:
		| {
				Population: number;
				GDP: number;
				'GDP per capita': number;
				'Life expectancy': number;
				'Population density': number;
				'Unemployment rate': number;
				'Consumer Price Index': number;
		  }
		| {
				'National IQ': number;
		  }
		| {
				'Visa-free count': number;
				Openness: number;
		  }
		| {
				'Global Peace Index': number;
		  }
		| object;
};

export type ProviderReturnType = {
	source: string;
	url: string;
	data: ConditionalData[];
};
