const express = require('express');
const cors = require('cors');
require('dotenv').config();

const createTables = require('./config/init-db');
createTables().catch(console.error);

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => {
  res.json({ code: 200, message: 'Server is running' });
});

const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

const merchantRoutes = require('./routes/merchant');
app.use('/api/merchants', merchantRoutes);

const productRoutes = require('./routes/product');
app.use('/api/products', productRoutes);

const orderRoutes = require('./routes/order');
app.use('/api/orders', orderRoutes);

const printRoutes = require('./routes/print');
app.use('/api/print', printRoutes);

const snackRoutes = require('./routes/snack');
app.use('/api/snacks', snackRoutes);

const takeoutRoutes = require('./routes/takeout');
app.use('/api/takeout', takeoutRoutes);

const expressRoutes = require('./routes/express');
app.use('/api/express', expressRoutes);

const movingRoutes = require('./routes/moving');
app.use('/api/moving', movingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
