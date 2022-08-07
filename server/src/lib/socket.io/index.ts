import { Server, Socket } from 'socket.io';
import { Image } from '../../modules/images/types/image.type';
import cloudinary from '../cloudinary';
import logger from '../logger';

export const imageHandler = (io: Server, socket: Socket) => {
  socket.on('image', (img: Image) => {
    socket.broadcast.emit('image', img);

    setTimeout(() => {
      io.emit('delete image', img.publicId);
      cloudinary.uploader.destroy(img.publicId, undefined, (err, callResult) => {
        if (err || !callResult) {
          logger.error('Image could not be deleted', { publicId: img.publicId, error: err });
        } else {
          logger.info('Image deleted', { publicId: img.publicId });
        }
      });
    }, 30000);
  });
};
