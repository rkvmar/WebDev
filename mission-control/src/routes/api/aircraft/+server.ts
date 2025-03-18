import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	// Get parameters from the query string
	const centerLat = url.searchParams.get('lat') || '37.61916';
	const centerLon = url.searchParams.get('lon') || '-122.37412';
	const distNM = url.searchParams.get('dist') || '30';

	try {
		// Make the request to adsb.fi from the server
		const adsbUrl = `https://opendata.adsb.fi/api/v2/lat/${centerLat}/lon/${centerLon}/dist/${distNM}`;
		console.log(`Fetching data from: ${adsbUrl}`);

		const response = await fetch(adsbUrl);

		if (!response.ok) {
			console.error(`API responded with status ${response.status}`);
			return json(
				{ error: `API responded with status ${response.status}` },
				{ status: response.status }
			);
		}

		const data = await response.json();
		console.log(`adsb.fi API response:`, data);

		// Check if the data has aircraft or is structured properly
		if (!data || typeof data !== 'object') {
			console.error('Invalid data format received from API');
			return json({ error: 'Invalid data format', rawData: data }, { status: 500 });
		}

		// Return the data regardless of whether aircraft are found
		return json(data);
	} catch (error) {
		console.error('Error fetching from adsb.fi:', error);
		return json({ error: 'Failed to fetch aircraft data' }, { status: 500 });
	}
};
