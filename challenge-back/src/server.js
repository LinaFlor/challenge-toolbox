const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

const filesRoutes = require('./routes/files.routes');

app.use(cors());
app.use('/files', filesRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = app; 
