const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3001;

const errorHandler = require('./middleware/errorHandler');
const filesRoutes = require('./routes/files.routes');

app.use(cors());
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});
app.use('/files', filesRoutes);

app.use((req, res, next) => {
  logger.warn(`404 Not Found: ${req.method} ${req.originalUrl}`);
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server listening on ${PORT}`);
});

module.exports = app;
