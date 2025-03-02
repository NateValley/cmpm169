const APIController = (function() {

	const CLIENT_ID = '42a7f5d1899844ccbf8a184bf775a00e';

	const BASE_URL = 'https://api.spotify.com/v1';

	const _fetchData = async (url, token) => {
		
		const result = await fetch(url, {
			method: 'GET',
			headers: { 'Authorization' : `Bearer ${token}` }
		});

		if ( !result.ok ) {
			throw new Error('Failed to fetch data from Spotify API');
		}

		return await result.json();
	};

	return {
		getClientID() {
			return CLIENT_ID;
		},
		getUserProfile(token) {
			return _fetchData(`${BASE_URL}/me`, token);
		},
		getRecentlyPlayed(token, limit) {
			return _fetchData(`${BASE_URL}/me/player/recently-played?limit=${limit}`, token);
		}
	};
	
})();