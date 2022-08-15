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
      <Zoom in={!!Object.keys(images).length} unmountOnExit mountOnEnter>
        <Paper className='image-paper'>
          <div className='images'>
            {Object.entries(images).map((img) => (
              <div key={img[0]} className='image-holder' id={img[0]}>
                <img src={img[1].url} className='modal-img' />
                <p>{img[1].caption}</p>
              </div>
            ))}
          </div>
        </Paper>
      </Zoom>
    </div>
  );
};

export default ImageModal;
