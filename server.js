const express = require('express');
const app = express();
const port = 5000;
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/service');
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000', // Allow only requests from frontend
}));


app.use(express.json());
app.use('/auth', authRoutes);
app.use('/service', serviceRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
