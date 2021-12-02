const express = require('express');
const productsRouter = require('./routes/api/products');
const path = require('path');

const app = express();

// Body parser
app.use(express.json());

// Use routes
app.use('/api/products', productsRouter);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
