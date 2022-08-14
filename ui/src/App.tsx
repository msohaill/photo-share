import React, { useEffect, useState } from 'react';
import './App.scss';
import socketClient from 'socket.io-client';
// import Compressor from 'compressorjs';
import Header from './components/Header';
import Map from './components/Map';
import FileDrawer from './components/FileDrawer';
import ImageModal from './components/ImageModal';
import SubmissionModal from './components/SubmissionModal';

const server = process.env.REACT_APP_APP_SERVER || 'http://localhost:8080';
const socket = socketClient(server, { withCredentials: true });

type Image = {
  publicId: string;
  url: string;
  location: {
    lat: number;
    lon: number;
  };
};

export type StoredImage = {
  [key: string]: {
    url: string;
    location: {
      lat: number;
      lon: number;
    };
  };
};

function App() {
  const [images, setImages] = useState<StoredImage>({});
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [file, setFile] = useState<File>(new File([], 'X'));

  useEffect(() => {
    socket.on('connection', () => {
      console.log('Connected with the backend');
    });

    socket.on('image', (img: Image) => {
      setImages((prevImages) => ({ ...prevImages, [img.publicId]: { url: img.url, location: img.location } }));
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

  // const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (!e.target.files?.length) return;

  //   const file = e.target.files[0];

  //   new Compressor(file, {
  //     quality: 0.2,
  //     success: (res) => {
  //       const reader = new FileReader();

  //       reader.onloadend = () => {
  //         const opts = {
  //           method: 'POST',
  //           body: JSON.stringify({ image: reader.result }),
  //           headers: { 'Content-Type': 'application/json' },
  //         };

  //         fetch(`${server}/images`, opts)
  //           .then((response) => {
  //             if (response.ok) return response.json();
  //             else throw new Error('Could not upload image');
  //           })
  //           .then((data: Image) => {
  //             const location = {
  //               lat: Math.floor(Math.random() * 180) - 90,
  //               lon: Math.floor(Math.random() * 360) - 180,
  //             };

  //             socket.emit('image', {
  //               url: data.url,
  //               publicId: data.publicId,
  //               location,
  //             });

  //             setImages((prevImages) => ({ ...prevImages, [data.publicId]: { url: data.url, location } }));
  //             setTimeout(
  //               () =>
  //                 setImages((prevImages) => {
  //                   const newImages = { ...prevImages };
  //                   delete newImages[data.publicId];
  //                   return newImages;
  //                 }),
  //               300000
  //             );
  //           })
  //           .catch((err) => console.log(err));
  //       };

  //       reader.readAsDataURL(res);
  //     },
  //   });
  // };

  const openSubmissionModal = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];

    setSubmissionModalOpen(true);
    setFile(file);
  };

  return (
    <div className='app'>
      <Header />

      <Map images={images} />
      <FileDrawer handleSubmission={openSubmissionModal} />
      <ImageModal images={images} />

      <SubmissionModal modalOpen={submissionModalOpen} setModalOpen={setSubmissionModalOpen} file={file} />
    </div>
  );
}

export default App;
