import { useEffect, useState } from "react";
import Map, {
	AttributionControl,
	GeolocateControl,
	NavigationControl,
} from "react-map-gl";

interface IProps {
	children: React.ReactNode;
	width?: string;
	height?: string;
	latitude?: number;
	longitude?: number;
	zoom?: number;
}

const MapComponent = ({
	children,
	width,
	height,
	longitude,
	latitude,
	zoom
}: IProps) => {
	const [viewState, setViewState] = useState({
		longitude: longitude || 105.62583879555804,
		latitude: latitude || 21.046006645820455,
		zoom: zoom || 15.5,
	});

	useEffect(() => {
		if (longitude && latitude) {
			setViewState((prev) => ({
				...prev,
				longitude,
				latitude,
				zoom:zoom || 15.5
			}));
		}
	}, [longitude, latitude,zoom]);
	return (
		<Map
			// mapLib={import("mapbox-gl")}
			{...viewState}
			onMove={(evt) => {
				setViewState(evt.viewState);
			}}
			style={{ width: "100%", height: height || "250px" }}
			mapStyle="mapbox://styles/mapbox/navigation-day-v1"
			mapboxAccessToken={process.env.ACCESS_MAPBOX!}
		>
			{children}
			<GeolocateControl />
			<NavigationControl />
			<AttributionControl customAttribution="Map design by me" />
		</Map>
	);
};

export default MapComponent;
