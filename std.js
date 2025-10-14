const authRoutes = require('./routes/auth');
app.use('/', authRoutes);


// const roleCheck = require('./middleware/roleCheck');
// app.get('/admin-dashboard', roleCheck('admin'), (req, res) => {
//   res.send('Admin dashboard');
// });

const accessCheck = require('./middleware/accessCheck');
app.delete('/file/:id', accessCheck, deleteFileHandler);


const { getPresignedUrl } = require('./utils/s3');

app.get('/file/download/:key', (req, res) => {
  const url = getPresignedUrl(req.params.key);
  res.redirect(url);
});

file.versions.push({
  key: file.key,
  uploadedAt: new Date(),
  uploadedBy: req.user._id
});
await file.save();

const Activity = require('../models/activityModel');

// Example in upload route
await Activity.create({
  user: req.user._id,
  action: 'upload',
  file: file._id
});

app.get('/files/search', async (req, res) => {
  const { name, type, owner } = req.query;
  const query = {};
  if(name) query.name = { $regex: name, $options: 'i' };
  if(type) query.type = type;
  if(owner) query.owner = owner;
  
  const files = await File.find(query);
  res.json(files);
});


req.user.storageUsed += file.size;
await req.user.save();


const roleCheck = require('./middleware/roleCheck');

app.get('/admin-dashboard', roleCheck('admin'), async (req, res) => {
  const users = await User.find();
  const files = await File.find();
  res.json({ users, files }); // or render an admin EJS/React page
});


const Notification = require('./models/notificationModel');

await Notification.create({
  user: targetUserId,
  message: `File "${file.name}" was shared/updated`
});


app.get('/notifications', async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id });
  res.json(notifications);
});
