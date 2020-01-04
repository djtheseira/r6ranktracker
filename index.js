require('dotenv').config();
const rp = require('request-promise');
const express = require('express');
const app = express();
const r6StatsUrl = "https://api2.r6stats.com/public-api/stats/";
const PORT = process.env.PORT || 5000;

app.get('/api/rank/:username/:platform/:type', (req, res, next) => {
  const username = req.params.username;
  const platform = req.params.platform;
  const type = req.params.type;

  try {
    
      if (!username) return reject(new TypeError('Username is required.'));
      if (!platform) return reject(new TypeError('Platform is required.'));
      if (!type) return reject(new TypeError('Search Type is required.'));

      let endpoint = r6StatsUrl + `${username}/${platform}/${type}`;

      var options = {
        uri: endpoint,
        headers: {
          authorization: `Bearer ${process.env.R6STATSKEY}`,
        },
        json: true 
      };

      rp(options)
      .then((body) => {
        let keys = Object.keys(body.seasons);
        res.send(body.seasons[keys[0]].regions.ncsa[0].rank_text);
      })
      .catch(err => {
        if (err.statusCode) {
          res.status(err.statusCode).send(err.error);
        } else {
          res.status(400).send(err);
        }
      })
  } catch (err) {
    res.status(500).send("Something is wrong with the server.");
  }
});


app.listen(PORT, (err) => {
  if (err) throw new Error("There was an error with the Node Server");

  console.log(`Server is listening on ${PORT}`);
});


