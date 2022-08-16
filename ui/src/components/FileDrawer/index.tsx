import { ExpandMore, PhotoCameraBack } from '@mui/icons-material';
import { Paper } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import './style.scss';

const FileDrawer = ({ handleSubmission }: { handleSubmission: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (drawerOpen) {
      document.getElementsByClassName('drawer')[0].classList.add('slide');
      (document.getElementsByClassName('drawer-open') as HTMLCollectionOf<HTMLElement>)[0].style.cursor = 'auto';
    } else {
      document.getElementsByClassName('drawer')[0].classList.remove('slide');
      (document.getElementsByClassName('drawer-open') as HTMLCollectionOf<HTMLElement>)[0].style.cursor = 'pointer';
    }
  }, [drawerOpen]);

  return (
    <div className='drawer-container'>
      <Paper className='drawer' elevation={9}>
        {drawerOpen && <ExpandMore className='drawer-close' onClick={() => setDrawerOpen(false)} />}
        <div className='drawer-open' onClick={() => setDrawerOpen(true)}>
          <PhotoCameraBack />
          <p>Add a thousand words</p>
        </div>
        <input
          type='file'
          id='image-upload'
          multiple={false}
          accept='image/*'
          onChange={(e) => {
            setDrawerOpen(false);
            handleSubmission(e);
          }}
          hidden
        />
        <label id='image-upload-label' htmlFor='image-upload'>
          Upload
        </label>
      </Paper>
    </div>
  );
};

export default FileDrawer;
