import { DoubleArrow } from '@mui/icons-material';
import { Paper, Slide } from '@mui/material';
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
                  <div className='img-loc-holder'>
                    <img src={img[1].url} className='modal-img' />
                    <p className='img-location'>
                      {`${img[1].location.lat.toFixed(2)}, ${img[1].location.lon.toFixed(2)}`}
                    </p>
                  </div>
                  <p>{img[1].caption}</p>
                </div>
              ))}
            </div>
          </Paper>
        </Slide>
        {Object.keys(images).length ? (
          <div
            onClick={(e) => {
              setOpen((prevOpen) => !prevOpen);
              e.currentTarget.classList.toggle('active-modal-open');
            }}
            id='image-modal-open'
          >
            <DoubleArrow />
          </div>
        ) : null}
      </div>
      {open ? <div id='modal-backdrop'></div> : null}
    </>
  );
};

export default ImageModal;
