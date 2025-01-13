/* eslint-disable @typescript-eslint/no-explicit-any */
import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Marker, MarkerDragEvent } from "react-map-gl";
// import SourcePage from "./Source";
import { getMapSearchLocation } from "@/service/map";
import MapComponent from "./Map";

interface IProps {
	query: string;
	handleGetLocation: (value: any) => void;
	height?: string;
	longitudeInit?: number | null;
	latitudeInit?: number | null;
}

interface IViewState {
	longitude: number;
	latitude: number;
	zoom: number;
}

function MapSearchLocation({
	query,
	handleGetLocation,
	height,
	longitudeInit,
	latitudeInit,
}: IProps) {
	const [viewState, setViewState] = useState<IViewState>({
		longitude: 105,
		latitude: 21,
		zoom: 15.5,
	});

	const [marker, setMarker] = useState({
		latitude: 21.046006645820455,
		longitude: 105.62583879555804,
		zoom: 15,
	});

	useEffect(() => {
		if (longitudeInit && latitudeInit) return;
		navigator.geolocation.getCurrentPosition(async (res) => {
			const location = await res.coords;

			setViewState({
				longitude: location.longitude,
				latitude: location.latitude,
				zoom: 15,
			});
		});
	}, []);

	const handleSearchMap = async (query: string) => {
		try {
			const { data } = await getMapSearchLocation(encodeURIComponent(query));
			const location = data?.features[0].geometry.coordinates;
			setMarker((prev) => ({
				...prev,
				longitude: location[0],
				latitude: location[1],
			}));
			setViewState((prev) => ({
				...prev,
				longitude: location[0],
				latitude: location[1],
			}));
			handleGetLocation(location);
		} catch (error) {}
	};

	useEffect(() => {
		if (query) {
			handleSearchMap(query);
		}
	}, [query]);

	useEffect(() => {
		if (longitudeInit && latitudeInit) {
			setViewState({
				longitude: longitudeInit,
				latitude: latitudeInit,
				zoom: 15,
			});

			setMarker({
				longitude: longitudeInit,
				latitude: latitudeInit,
				zoom: 15,
			});
		}
	}, [longitudeInit, latitudeInit]);

	const onMarkerDragStart = useCallback(() => {}, []);

	const onMarkerDrag = useCallback((event: MarkerDragEvent) => {
		setMarker({
			longitude: event.lngLat.lng,
			latitude: event.lngLat.lat,
			zoom: 15,
		});
	}, []);

	const onMarkerDragEnd = useCallback((event: MarkerDragEvent) => {
		handleGetLocation([event?.lngLat?.lng, event?.lngLat?.lat]);
	}, []);

	return (
		<>
			<MapComponent
				longitude={viewState.longitude}
				latitude={viewState.latitude}
				height={height}
			>
				<>
					<Marker
						longitude={marker.longitude}
						latitude={marker.latitude}
						anchor="bottom"
						draggable
						onDragStart={onMarkerDragStart}
						onDrag={onMarkerDrag}
						onDragEnd={onMarkerDragEnd}
					>
						<FaMapMarkerAlt size={20} />
					</Marker>
				</>
			</MapComponent>
		</>
	);
}

export default MapSearchLocation;
