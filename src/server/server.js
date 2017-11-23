import mongodb from 'mongodb'
import express from 'express'

let runApp = function (db) {
  const app = express()

  app.get('/', function (req, res) {
    res.sendFile('index.html', {root: __dirname})
  })

  app.get('/client.js', function (req, res) {
    res.sendFile('client.js', {root: __dirname})
  })

  let widgetRead = function (res) {
    db.collection('widgets').findOne({}).then(function (doc) {
      res.send(JSON.stringify({value: doc.value}))
    })
  }

  let widgetWrite = function (value) {
    db.collection('widgets').updateOne({name: 'widget1'}, {$set: {value}}, {w: 'majority'})
  }

  app.get('/widgets', function (req, res) {
    widgetRead(res)
  })

  app.put('/widgets', function (req, res) {
    widgetWrite(req.query.value)
    res.sendStatus(200)
  })

  let port = process.env.PORT || 9000
  app.listen(port, function () {
    console.log(`Listening on port ${port}`)
  })
}

mongodb.MongoClient.connect(process.env.MONGODB_URL).then(runApp)