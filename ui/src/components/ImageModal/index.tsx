import { DoubleArrow } from '@mui/icons-material';
import { Button, Paper, Slide } from '@mui/material';
import { StoredImage } from '../../App';
import './style.scss';

type Props = {
  images: StoredImage;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ImageModal = ({ images, open, setOpen }: Props) => {
  return (
    <>
      <div className='image-modal'>
        <Slide in={open} direction='left' unmountOnExit mountOnEnter>
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
        </Slide>
        {Object.keys(images).length ? (
          <Button
            onClick={(e) => {
              setOpen((prevOpen) => !prevOpen);
              e.currentTarget.classList.toggle('active-modal-open');
            }}
            endIcon={<DoubleArrow />}
            className='image-modal-open'
          />
        ) : null}
      </div>
      {open ? <div id='modal-backdrop'></div> : null}
    </>
  );
};

export default ImageModal;
