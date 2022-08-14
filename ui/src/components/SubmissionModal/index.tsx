import { CloseRounded, Done } from '@mui/icons-material';
import { Button, Modal, Paper, TextField } from '@mui/material';
import './style.scss';

type Props = {
  file: File;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

// eslint-disable-next-line no-unused-vars
const SubmissionModal = ({ file, modalOpen, setModalOpen }: Props) => {
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
              />
              <Button endIcon={<Done />} id='caption-submit' />
            </div>
          </Paper>
        </div>
        <CloseRounded id='modal-close' onClick={() => setModalOpen(false)} />
      </>
    </Modal>
  );
};

export default SubmissionModal;
