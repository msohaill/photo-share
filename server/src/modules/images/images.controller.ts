import cloudinary from '../../lib/cloudinary';
import { Router } from 'express';
import { nanoid } from 'nanoid';
import logger from '../../lib/logger';

const router = Router();

router.post('', async (req, res, next) => {
  if (!req.body.image) {
    res.json({ message: 'No file uploaded' });
  } else {
    cloudinary.uploader.upload(req.body.image, { public_id: nanoid() }, (err, imgRes) => {
      if (err || !imgRes) {
        logger.error('Image could not bse uploaded', { uploadError: err });
        next(new Error('Image could not be uploaded'));
      } else {
        res.json({ url: imgRes.secure_url, publicId: imgRes.public_id });
      }
    });
  }
});

export default router;
