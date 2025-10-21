const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

const errorHandler = require('./middleware/errorHandler');

const filesRoutes = require('./routes/files.routes');

app.use(cors());
app.use('/files', filesRoutes);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = app; 
