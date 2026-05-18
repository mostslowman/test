const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const uploadsDir = path.join(__dirname, 'uploads');
const imagesDir = path.join(uploadsDir, 'images');
const audioDir = path.join(uploadsDir, 'audio');
const configPath = path.join(uploadsDir, 'config.json');

[uploadsDir, imagesDir, audioDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const imageStorage = multer.memoryStorage();
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, audioDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `audio${ext}`);
  }
});

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  }
});

const audioUpload = multer({
  storage: audioStorage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /mp3|wav|ogg|m4a|aac|flac/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  }
});

app.post('/api/upload/images', imageUpload.array('images', 8), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: '请选择图片' });
    }

    const savedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const filename = `image_${Date.now()}_${i}.webp`;
      const outputPath = path.join(imagesDir, filename);

      await sharp(file.buffer)
        .webp({ quality: 90 })
        .toFile(outputPath);

      savedFiles.push(filename);
    }

    const config = getConfig();
    config.images = [...(config.images || []), ...savedFiles];
    saveConfig(config);

    res.json({ success: true, files: savedFiles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/upload/audio', audioUpload.single('audio'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: '请选择音频' });
    }

    const config = getConfig();
    config.audio = req.file.filename;
    saveConfig(config);

    res.json({ success: true, file: req.file.filename });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/upload/text', (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.length > 100) {
      return res.status(400).json({ success: false, message: '文本不能为空且不超过100字' });
    }

    const config = getConfig();
    config.text = text;
    saveConfig(config);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/config', (req, res) => {
  try {
    const config = getConfig();

    if (config.images) {
      config.images = config.images.filter(f => fs.existsSync(path.join(imagesDir, f)));
    }
    if (config.audio) {
      const audioPath = path.join(audioDir, config.audio);
      if (!fs.existsSync(audioPath)) {
        const audioFiles = fs.readdirSync(audioDir).filter(f => /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(f));
        config.audio = audioFiles.length > 0 ? audioFiles[0] : null;
      }
    }

    res.json({ success: true, config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/reset', (req, res) => {
  try {
    fs.readdirSync(imagesDir).forEach(f => fs.unlinkSync(path.join(imagesDir, f)));
    fs.readdirSync(audioDir).forEach(f => fs.unlinkSync(path.join(audioDir, f)));
    saveConfig({ images: [], audio: null, text: '' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.use('/uploads/images', express.static(imagesDir));
app.use('/uploads/audio', express.static(audioDir));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function getConfig() {
  try {
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
  } catch (e) {}
  return { images: [], audio: null, text: '' };
}

function saveConfig(config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎂 生日庆祝网站已启动！`);
  console.log(`📋 后台管理: http://localhost:${PORT}/admin`);
  console.log(`🎉 分享链接: http://localhost:${PORT}/`);
});