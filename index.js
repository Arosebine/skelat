require('dotenv').config();
const express = require('express');
const connectDB = require('./database/db');


//import routes
const userRoutes = require('./routes/user.route');

const app = express();





app.use(express.json({ limit: '1mb' }));



connectDB();
const port = process.env.PORT || 6666;



app.get('/', (req, res) => {
  return res.status(200).json(
     '<hi>You are welcome to the Skelat Bank, We are here to put smile on your face.</hi>');
});



// mount
app.use('/api/skelat', userRoutes);

//404 page
app.all('*', (req, res) => {
  res.status(404).json({ message: '👋🤚👋👋👋🤚oops page not found' });
});




app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
