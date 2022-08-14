import Compressor from 'compressorjs';
import socket from '../../socket-io';
import { CloseRounded, Done } from '@mui/icons-material';
import { Button, Modal, Paper, TextField } from '@mui/material';
import { useState } from 'react';
import { env } from '../../env';
import { Image } from '../../App';
import './style.scss';

type Props = {
  file: File;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDisplay: (
    publicId: string,
    url: string,
    location: {
      lat: number;
      lon: number;
    }
  ) => void;
};

const SubmissionModal = ({ file, modalOpen, setModalOpen, handleDisplay }: Props) => {
  const [caption, setCaption] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') uploadImage();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (errorText) setErrorText('');
    setCaption(e.target.value);
  };

  const uploadImage = () => {
    if (caption === '') {
      setErrorText('Please input a caption');
      return;
    }

    setModalOpen(false);

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

          fetch(`${env.server}/images`, opts)
            .then((response) => {
              if (response.ok) return response.json();
              else throw new Error('Could not upload image');
            })
            .then((data: Image) => {
              const location = {
                lat: Math.floor(Math.random() * 180) - 90,
                lon: Math.floor(Math.random() * 360) - 180,
              };

              socket.emit('image', {
                url: data.url,
                publicId: data.publicId,
                location,
              });

              handleDisplay(data.publicId, data.url, location);
              setCaption('');
            })
            .catch((err) => console.log(err));
        };

        reader.readAsDataURL(res);
      },
    });
  };

  return (
    <Modal open={modalOpen} onClose={() => setModalOpen(false)} container={document.getElementsByClassName('app')[0]}>
      <>
        <div className='modal-container'>
          <Paper className='submission-modal'>
            <h1>What words would you like to share?</h1>
            <div className='input-group'>
              <TextField
                className='caption-input'
                id='caption-input'
                label='Enter a caption'
                variant='filled'
                color='primary'
                multiline
                sx={{ width: '50%' }}
                maxRows={3}
                onKeyDown={handleKeyDown}
                value={caption}
                onChange={handleInputChange}
                error={!!errorText}
                helperText={errorText}
              />
              <Button endIcon={<Done />} id='caption-submit' onClick={uploadImage} />
            </div>
          </Paper>
        </div>
        <CloseRounded id='modal-close' onClick={() => setModalOpen(false)} />
      </>
    </Modal>
  );
};

export default SubmissionModal;
