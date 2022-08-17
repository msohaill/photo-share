import { Socket } from 'socket.io';
import { Image } from '../../modules/images/types/image.type';
import cloudinary from '../cloudinary';
import logger from '../logger';

export const imageHandler = (socket: Socket) => {
  socket.on('image', (img: Image) => {
    socket.broadcast.emit('image', img);

    setTimeout(() => {
      cloudinary.uploader.destroy(img.publicId, undefined, (err, callResult) => {
        if (err || !callResult) {
          logger.error('Image could not be deleted', { publicId: img.publicId, error: err });
        } else {
          logger.info('Image deleted', { publicId: img.publicId });
        }
      });
    }, 90000);
  });
};
