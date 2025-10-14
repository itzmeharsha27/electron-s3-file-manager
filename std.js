const authRoutes = require('./routes/auth');
app.use('/', authRoutes);


const roleCheck = require('./middleware/roleCheck');
app.get('/admin-dashboard', roleCheck('admin'), (req, res) => {
  res.send('Admin dashboard');
});

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
