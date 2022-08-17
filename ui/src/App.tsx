import Header from './components/Header';
import Map from './components/Map';
import FileDrawer from './components/FileDrawer';
import ImageModal from './components/ImageModal';
import SubmissionModal from './components/SubmissionModal';
import socket from './socket-io';
import { useEffect, useState } from 'react';
import './App.scss';

export type EmitImage = {
  publicId: string;
  url: string;
  location: {
    lat: number;
    lon: number;
  };
  caption: string;
};

export type StoredImage = {
  [key: string]: Omit<EmitImage, 'publicId'>;
};

export type ResponseImage = Omit<EmitImage, 'location' | 'caption'>;

function App() {
  const [images, setImages] = useState<StoredImage>({});
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [file, setFile] = useState<File>(new File([], 'X'));

  const handleImageDisplay = ({ publicId, url, location, caption }: EmitImage) => {
    setImages((prevImages) => ({ ...prevImages, [publicId]: { url: url, location, caption } }));
    setTimeout(
      () =>
        setImages((prevImages) => {
          const newImages = { ...prevImages };
          delete newImages[publicId];

          !Object.keys(newImages).length && setImageModalOpen(false);
          return newImages;
        }),
      300000
    );
  };

  useEffect(() => {
    socket.on('connection', () => console.log('Connected with the backend'));
    socket.on('image', (img: EmitImage) => handleImageDisplay(img));

    return () => {
      socket.off('connection');
      socket.off('image');
    };
  }, []);

  const openSubmissionModal = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    e.target.value = '';

    setSubmissionModalOpen(true);
    setFile(file);
  };

  return (
    <div className='app'>
      <Header />

      <Map images={images} />
      <FileDrawer handleSubmission={openSubmissionModal} />
      <ImageModal images={images} open={imageModalOpen} setOpen={setImageModalOpen} />

      <SubmissionModal
        modalOpen={submissionModalOpen}
        setModalOpen={setSubmissionModalOpen}
        file={file}
        handleDisplay={handleImageDisplay}
      />
    </div>
  );
}

export default App;
