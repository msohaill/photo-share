import { useEffect, useState } from 'react';
import './App.css';
import 'leaflet/dist/leaflet.css';
import socketClient from 'socket.io-client';
import Compressor from 'compressorjs';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

const server = process.env.REACT_APP_APP_SERVER || 'http://localhost:8080';
const socket = socketClient(server, { withCredentials: true });

type TempImage = {
  publicId: string;
  url: string;
};

function App() {
  const [images, setImages] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    socket.on('connection', () => {
      console.log('Connected with the backend');
    });

    socket.on('image', (img: TempImage) => {
      setImages((prevImages) => ({ ...prevImages, [img.publicId]: img.url }));
      setTimeout(
        () =>
          setImages((prevImages) => {
            const newImages = { ...prevImages };
            delete newImages[img.publicId];
            return newImages;
          }),
        30000
      );
    });

    return () => {
      socket.off('connection');
      socket.off('image');
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];

    new Compressor(file, {
      quality: 0.2,
      success: (res) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          const opts = {
            method: 'POST',
            body: JSON.stringify({ image: reader.result }),
            headers: { 'Content-Type': 'application/json' },
          };

          fetch(`${server}/images`, opts)
            .then((response) => {
              if (response.ok) return response.json();
              else throw new Error('Could not upload image');
            })
            .then((data: TempImage) => {
              socket.emit('image', { url: data.url, publicId: data.publicId });
              setImages((prevImages) => ({ ...prevImages, [data.publicId]: data.url }));
              setTimeout(
                () =>
                  setImages((prevImages) => {
                    const newImages = { ...prevImages };
                    delete newImages[data.publicId];
                    return newImages;
                  }),
                30000
              );
            })
            .catch((err) => console.log(err));
        };

        reader.readAsDataURL(res);
      },
    });
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <div>
          {Object.values(images).map((e) => (
            <img key={e} alt={e} style={{ maxHeight: '200px' }} src={e} />
          ))}
        </div>
        <input type='file' name='image' multiple={false} accept='image/*' onChange={handleImageChange} />
        <MapContainer
          id='map'
          center={[35, 0]}
          zoom={2}
          scrollWheelZoom={true}
          zoomSnap={0.1}
          maxBounds={[
            [-90, -180],
            [90, 180],
          ]}
          maxBoundsViscosity={0.9}
        >
          <TileLayer
            url='https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
            maxZoom={20}
            minZoom={2}
            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </header>
    </div>
  );
}

export default App;
