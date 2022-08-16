import { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import './style.scss';
import hillshade from '../../assets/geodata/hillshade.json';
import { StoredImage } from '../../App';

type Props = {
  images: StoredImage;
};

const Map = ({ images }: Props) => {
  const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    window.onresize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
  });

  return (
    <ComposableMap id='map' width={dimensions.width} height={dimensions.height} projection='geoMercator'>
      <ZoomableGroup center={[0, 30]} zoom={1.5} minZoom={1} maxZoom={100} style={{ outline: 'none' }}>
        <Geographies geography={geoUrl} style={{ outline: 'none' }}>
          {({ geographies }) =>
            geographies.map((geo) => <Geography className='country' key={geo.rsmKey} geography={geo} />)
          }
        </Geographies>
        <Geographies geography={hillshade.features}>
          {({ geographies }) => {
            return geographies.map((geo) => (
              <Geography
                fill={
                  geo.id === 'layer-1'
                    ? 'rgba(10,10,10,0.01)'
                    : geo.id === 'layer-2'
                    ? 'rgba(10,10,10,0.02)'
                    : 'rgba(10,10,10,0.03)'
                }
                key={geo.rsmKey}
                geography={geo}
              />
            ));
          }}
        </Geographies>
        {Object.entries(images).map((img) => (
          <Marker key={img[0]} coordinates={[img[1].location.lon, img[1].location.lat]}>
            <circle className='img-marker' r={2} />
          </Marker>
        ))}
      </ZoomableGroup>
    </ComposableMap>
  );
};

export default Map;
