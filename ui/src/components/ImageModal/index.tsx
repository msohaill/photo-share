import { Paper, Zoom } from '@mui/material';
import React from 'react';
import { StoredImage } from '../../App';
import './style.scss';

type Props = {
  images: StoredImage;
};

const ImageModal = ({ images }: Props) => {
  return (
    <div className='image-modal'>
      <Zoom in={!!Object.keys(images).length}>
        <Paper className='image-paper'>
          <div className='images'>
            {Object.entries(images).map((img) => (
              <div key={img[0]} className='image-holder' id={img[0]}>
                <img src={img[1].url} className='modal-img' />
              </div>
            ))}
          </div>
          <p>caption</p>
        </Paper>
      </Zoom>
    </div>
  );
};

export default ImageModal;
