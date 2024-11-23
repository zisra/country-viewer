import { useEffect, useState } from 'react';
import './App.css';

import { Country } from './data/types.ts';
import {
	applyConditionalData,
	getData,
	loadConditionalData,
} from './data/countries.ts';

const CountryFlag = ({ countryData }: { countryData: Country }) => {
	return (
		<div
			style={{
				display: 'block',
				borderRadius: '4px',
				padding: '4px',
			}}
		>
			<span
				style={{
					height: '40px',
				}}
				className={`fi fi-${countryData.ISO31161Data.alpha2.toLowerCase()}`}
			></span>
			<span>{countryData.ISO31161Data.name}</span>
		</div>
	);
};

function App() {
	const [countries, setCountries] = useState(getData());

	useEffect(() => {
		loadConditionalData().then((data) => {
			setCountries(applyConditionalData(data));
		});
	}, []);

	console.log(countries);

	return (
		<>
			{countries.countries.map((country) => {
				return (
					<CountryFlag
						key={country.ISO31161Data.alpha2}
						countryData={country}
					/>
				);
			})}
		</>
	);
}

export default App;
