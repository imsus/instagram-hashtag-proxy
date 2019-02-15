const axios = require('axios');
const mcache = require('memory-cache');
const { parse } = require('url');

module.exports = (req, res) => {
  const { query } = parse(req.url, true);
  const { hashtag = 'luminejakarta' } = query;
  const cacheName = `hashtag:${hashtag}`;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
  }

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
