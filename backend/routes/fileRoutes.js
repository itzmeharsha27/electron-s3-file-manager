const express = require('express');
const router = express.Router();
const multer = require('multer');
const File = require('../models/fileModel');

// Multer setup for file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @route POST /api/files/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { originalname, mimetype, size } = req.file;
    const file = await File.create({
      name: originalname,
      type: mimetype,
      url: `uploads/${originalname}`,
      size
    });
    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/files
router.get('/', async (req, res) => {
  try {
    const files = await File.find({});
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route DELETE /api/files/:id
router.delete('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    await file.remove();
    res.json({ message: 'File deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
