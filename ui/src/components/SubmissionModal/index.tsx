import { CloseRounded } from '@mui/icons-material';
import { Modal, Paper, TextField } from '@mui/material';
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
        <Paper className='modal-element'>
          <h1>What words would you like to share?</h1>
          <TextField id='filled-basic' label='Enter a caption' variant='filled' color='secondary' />
        </Paper>
        <CloseRounded id='modal-close' onClick={() => setModalOpen(false)} />
      </>
    </Modal>
  );
};

export default SubmissionModal;
