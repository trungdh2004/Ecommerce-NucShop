import axios from "axios";

const getRoute = async () => {
	const start = [1, 2];
	const marker = [1, 2];

	const res = await fetch(
		`https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${marker[0]},${marker[1]}?steps=true&geometries=geojson&access_token=pk.eyJ1IjoiZG9odXV0cnVuZyIsImEiOiJjbHVwa20zaDMyZ2ppMmtuem93aDN1eXl3In0.O33vYvx7VEUo7mrZGRbqgA`,
	);
	const data = await res.json();

	const coords = data.routes[0].geometry.coordinates;
};

export const getMapSearchLocation = (query: string) =>
	axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json`, {
		params: {
			access_token: process.env.ACCESS_MAPBOX!,
			country: "VN",
		},
	});
