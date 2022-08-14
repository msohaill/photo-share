import { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import './style.scss';

type Props = {
  images: { [key: string]: { url: string; location: { lat: number; lon: number } } };
};

const Map = ({ images }: Props) => {
  const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    window.onresize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
  });

  return (
    <ComposableMap id='map' width={dimensions.width} height={dimensions.height} projection='geoMercator'>
      <ZoomableGroup center={[0, 30]} zoom={1.5} minZoom={1.5}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => <Geography className='country' key={geo.rsmKey} geography={geo} />)
          }
        </Geographies>
        {Object.entries(images).map((img) => (
          <Marker key={img[0]} coordinates={[img[1].location.lon, img[1].location.lat]}>
            <circle
              className='img-marker'
              r={2}
              onClick={() =>
                document
                  .getElementsByClassName('images')[0]
                  .scrollTo({ left: document.getElementById(img[0])?.offsetLeft })
              }
            />
          </Marker>
        ))}
      </ZoomableGroup>
    </ComposableMap>
  );
};

export default Map;
