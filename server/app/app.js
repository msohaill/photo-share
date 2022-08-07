"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cloudinary_1 = require("cloudinary");
const http_1 = require("http");
const dotenv_1 = require("dotenv");
const socket_io_1 = require("socket.io");
const nanoid_1 = require("nanoid");
const body_parser_1 = __importDefault(require("body-parser"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ credentials: true, origin: true }));
app.use(body_parser_1.default.json({ limit: '16mb' }));
app.use((0, express_fileupload_1.default)({ createParentPath: true }));
const port = process.env.PORT || 8080;
const http = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(http, { cors: { origin: true, credentials: true } });
app.post('/images', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.image) {
        res.json({ status: false, message: 'No file uploaded' });
    }
    else {
        cloudinary_1.v2.uploader.upload(req.body.image, { public_id: (0, nanoid_1.nanoid)() }, (err, imgRes) => {
            if (err || !imgRes)
                throw new Error("Dang");
            res.json({ imageUrl: imgRes.secure_url, publicId: imgRes.public_id });
        });
    }
}));
http.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
});
io.on("connection", socket => {
    console.log("New client connected");
    socket.emit('connection', null);
    socket.on("image", (img) => {
        socket.broadcast.emit("image", img);
        setTimeout(() => {
            io.emit("delete image", img.publicId);
            cloudinary_1.v2.uploader.destroy(img.publicId);
        }, 30000);
    });
    socket.on('disconnect', () => console.log("User disconnected."));
});
