/* eslint-disable @typescript-eslint/no-explicit-any */
import { Source, Layer } from "react-map-gl";
import type { FeatureCollection } from "geojson";

function SourcePage({ coord }: { coord: any[] }) {
	const geojson: FeatureCollection = {
		type: "FeatureCollection",
		features: [
			{
				type: "Feature",
				geometry: {
					type: "LineString",
					coordinates: coord,
				},
				properties: {},
			},
		],
	};

	return (
		<Source id="my-data" type="geojson" data={geojson}>
			<Layer
				id="line"
				type="line"
				paint={{
					"line-width": 5,
					"line-color": "#007cbf",
				}}
			/>
		</Source>
	);
}

export default SourcePage;
