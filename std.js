const authRoutes = require('./routes/auth');
app.use('/', authRoutes);


const roleCheck = require('./middleware/roleCheck');
app.get('/admin-dashboard', roleCheck('admin'), (req, res) => {
  res.send('Admin dashboard');
});

const accessCheck = require('./middleware/accessCheck');
app.delete('/file/:id', accessCheck, deleteFileHandler);
