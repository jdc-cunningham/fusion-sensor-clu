const path = require('path');
const express = require('express');
const app = express();
const port = 5000; // port 80 needs root
const cors = require('cors');

// CORs
app.use(cors());
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// serve JSON produced from measurement
app.use('/coordinates', express.static(path.join(__dirname, 'coordinates')));

app.get('/', (req, res) => {
  res.status(200).send('ok');
});

app.listen(port, () => {
  console.log(`pi server running on port ${port}`);
});
