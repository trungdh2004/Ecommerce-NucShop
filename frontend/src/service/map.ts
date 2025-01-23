import axios from "axios";
export const getMapSearchLocation = (query: string) =>
	axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json`, {
		params: {
			access_token: process.env.ACCESS_MAPBOX!,
			country: "VN",
		},
	});
