const axios = require('axios');
const express = require('express');
const router = express.Router();

const UNSPLASH_ACCESS_KEY =
  process.env.HEROKU_UNSPLASH || require('../../config.js');

// @route  GET api/products
// @desc   Get products by array of ids
// @access Public
router.get('/:id', (req, res) => {
  axios
    .get(
      `https://api.unsplash.com/photos/${req.params.id}/?client_id=${UNSPLASH_ACCESS_KEY}`
    )
    .then(response => res.json(response.data));
});

module.exports = router;
