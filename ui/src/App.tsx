import { useEffect, useState } from 'react';
import './App.css';
import socketClient from 'socket.io-client';
import Compressor from 'compressorjs';

const server = process.env.REACT_APP_APP_SERVER || "http://localhost:8080";
const socket = socketClient(server, { withCredentials: true });

type TempImage = {
  publicId: string;
  url: string;
};

function App() {
  const [images, setImages] = useState<{ [key: string]: string; }>({});

  useEffect(() => {
    socket.on("connection", () => {
      console.log("I'm connected with the backend")
    });

    socket.on("image", (img: TempImage) => setImages(prevImages => ({...prevImages, [img.publicId]: img.url })));
    socket.on("delete image", (publicId: string) => setImages(prevImages => {
      console.log(publicId)
      const newImages = { ...prevImages };
      delete newImages[publicId];
      return newImages;
    }));


    return () => { socket.off("connection"); socket.off("image"); };
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
            headers: { 'Content-Type': 'application/json' }
          };

          fetch(`${server}/images`, opts)
          .then((response => response.json()))
          .then((data: any) => {
            socket.emit("image", { url: data.imageUrl, publicId: data.publicId });
            setImages(prevImages => ({ ...prevImages, [data.publicId]: data.imageUrl }));
          });
        };

        reader.readAsDataURL(res);
      }
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {Object.values(images).map(e => (
            <img alt={e} style={{ maxHeight: '200px' }} src={e} />
          ))}
        </div>
        <input type="file" name='image' multiple={false} accept="image/*" onChange={(handleImageChange)} />
      </header>

    </div>
  );
}

export default App;
