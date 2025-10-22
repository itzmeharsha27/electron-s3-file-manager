const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');

const authRoutes = require('./routes/auth');
const accessCheck = require('./middleware/accessCheck');
const roleCheck = require('./middleware/roleCheck');
const { getPresignedUrl } = require('./utils/s3');

const User = require('./models/userModel');
const File = require('./models/fileModel');
const Activity = require('./models/activityModel');
const Notification = require('./models/notificationModel');
const deleteFileHandler = require('./controllers/deleteFileHandler'); // adjust path if needed

app.use(express.json());
app.use('/', authRoutes);

// =================== File Routes ===================

// Delete file with access check
app.delete('/file/:id', accessCheck, deleteFileHandler);

// Download file via pre-signed URL
app.get('/file/download/:key', (req, res) => {
  const url = getPresignedUrl(req.params.key);
  res.redirect(url);
});

// Upload route example (versions & activity logging)
app.post('/file/upload', async (req, res) => {
  const file = req.file; // assuming multer or similar
  const user = req.user;

  // Add previous version
  if (file.previous) {
    file.versions.push({
      key: file.key,
      uploadedAt: new Date(),
      uploadedBy: user._id
    });
  }

  await file.save();

  // Log activity
  await Activity.create({
    user: user._id,
    action: 'upload',
    file: file._id
  });

  // Update user storage
  user.storageUsed += file.size;
  await user.save();

  res.json({ message: 'File uploaded successfully' });
});

// Search files
app.get('/files/search', async (req, res) => {
  const { name, type, owner } = req.query;
  const query = {};
  if(name) query.name = { $regex: name, $options: 'i' };
  if(type) query.type = type;
  if(owner) query.owner = owner;
  
  const files = await File.find(query);
  res.json(files);
});

// =================== Admin Routes ===================

// Admin dashboard
app.get('/admin-dashboard', roleCheck('admin'), async (req, res) => {
  const users = await User.find();
  const files = await File.find();
  res.json({ users, files });
});

// =================== Notifications ===================

// Create notification (example, call this inside relevant controller)
async function createNotification(targetUserId, file) {
  await Notification.create({
    user: targetUserId,
    message: `File "${file.name}" was shared/updated`
  });
}

// Get notifications
app.get('/notifications', async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id });
  res.json(notifications);
});

// =================== Backup & Restore ===================

// Backup
app.get('/backup', async (req, res) => {
  const users = await User.find();
  const files = await File.find();
  const backupData = { users, files };
  const filePath = path.join(__dirname, 'backup.json');
  fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));
  res.download(filePath);
});

// Restore
app.post('/restore', async (req, res) => {
  const backupData = JSON.parse(fs.readFileSync('backup.json'));
  await User.deleteMany({});
  await File.deleteMany({});
  await User.insertMany(backupData.users);
  await File.insertMany(backupData.files);
  res.send('Restore complete');
});

// =================== Auth with validation ===================

app.post('/register', 
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // proceed with registration logic
    res.send('User registered');
});

module.exports = app;
