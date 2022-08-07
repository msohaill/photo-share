import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';
import { createServer } from 'http';
import { config } from 'dotenv';
import { Server } from 'socket.io';
import { nanoid } from 'nanoid';
import bodyParser from 'body-parser';

config();

type TempImage = {
  publicId: string;
  url: string;
};

const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json({ limit: '16mb' }));
app.use(fileUpload({ createParentPath: true }));

const port = process.env.PORT || 8080;
const http = createServer(app);
const io = new Server(http, { cors: { origin: true, credentials: true } });

app.post('/images', async (req, res) => {
  if (!req.body.image) {
    res.json({ status: false, message: 'No file uploaded' });
  } else {
    cloudinary.uploader.upload(req.body.image, { public_id: nanoid() }, (err, imgRes) => {
      if (err || !imgRes) throw new Error('Dang');

      res.json({ imageUrl: imgRes.secure_url, publicId: imgRes.public_id });
    });
  }
});

http.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.emit('connection', null);
  socket.on('image', (img: TempImage) => {
    socket.broadcast.emit('image', img);
    setTimeout(() => {
      io.emit('delete image', img.publicId);
      cloudinary.uploader.destroy(img.publicId);
    }, 30000);
  });
  socket.on('disconnect', () => console.log('User disconnected.'));
});
