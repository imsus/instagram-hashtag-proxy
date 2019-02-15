const axios = require('axios');
const mcache = require('memory-cache');
const { parse } = require('url');

module.exports = (req, res) => {
  const { query } = parse(req.url, true);
  const { hashtag = 'luminejakarta' } = query;
  const cacheName = `hashtag:${hashtag}`;

  if (!mcache.get(cacheName)) {
    axios
      .get(`https://www.instagram.com/explore/tags/${hashtag}/?__a=1`)
      .then(result => {
        mcache.put(cacheName, JSON.stringify(result.data), 300000);
        res.end(mcache.get(cacheName));
      });
  } else {
    res.end(mcache.get(cacheName));
  }
};
