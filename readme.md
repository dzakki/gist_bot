# Membuat bot untuk menyimpan poin poin penting (gist bot) dengan messanger.


### Setup aplikasi

Hal pertama yang harus kita lakukan adalah membuat setup pada aplikasi, dan pastikan nodejs sudah ter-install pada pc kita.

langkah pertama jalankan command dibawah ini pada terminal kita untuk membuat `package.json`.
```
$ npm init -y
```
kemudian update `package.json`-nya
```
// package.json
{
    /...
    "scripts": {
        "start": "node app.js"
    }
    /...
}
```

selanjutnya kita siapkan package-package yang di butuhkan seperti [express](#), [axios](#), [dotenv](#), dan [cors](#) untuk mengembangkan aplikasi kita, dengan menjalankan command sebagai berikut.
```
$ npm install express axios dotenv cors
```

sekarang kita siapkan struktur folder aplikasi kita seperti berikut ini.

```
/app 
    /node_modules
    /routes
        index.js
    /services
        dbApi.js
        graphApi.js
        receive.js
    /view
        index.html
    .env
    app.js
    package.json
    package.lock.json
``` 


### membuat webhook

kita perlu membuat webhook, karena webhook adalah inti dari pada aplikasi kita agar bisa berkomunikasi dengan messanger sehingga kita bisa menerima pesan, memproses dan mengirim pesan. untuk membuatnya ikuti langkah langkah sebagai berikut:

#### membuat [HTTP server](#). 

masukkan kode dibawah ini kedalam `app.js`.
```js
//app.js
require("dotenv").config()

const
    express = require('express'),
    app = express();
    PORT = process.env.PORT || 1337;


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => console.log('webhook is listening in port: ' + PORT));
```

#### membuat webhook 
dengan menambahkan kode berikut pada file `/routes/index.js`.


```js
// routes/index.js
const 
    router = require("express").Router();



// Creates the endpoint for our webhook 
router.post('/webhook', (req, res) => {  
 
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});
```

kode ini atau enpoint `/webhook` dengan method post digunakan menerima semua event-event yang dikirim-kan oleh messanger. 

note: pada kode ini, kita hanya membuat response dengan status kode 200 dan tidak perlu membuat response json karena tidak di butuhkan.


#### membuat enpoint untuk verifikasi webhook 
tambahkan kode berikut pada file `routes/index.js`.

```js
router.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "<YOUR_VERIFY_TOKEN>"
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});
```

enpoint `/webhook` dengan method `GET` gunanya untuk verifikasi webhook dari pada aplikasi kita. kita wajib membuat ini untuk memastikan webhook yang kita buat berfungsi dan milik kita. jangan lupa untuk mengubah `VERIFY_TOKEN` dengan value random string pada cuplikan kode berkut: 
```js
let VERIFY_TOKEN = "<YOUR_VERIFY_TOKEN>"
```

#### melakukan test pada webhook
 
pertama kita jalankan aplikasi kita di local kita (localhost).
```
$ node index.js
```
kedua kita coba untuk melakukan test pada webhook verifikasi kita dengan menggunakan [curl](#)

<pre>
$ curl -X GET "localhost:1337/webhook?hub.verify_token=<b>YOUR_VERIFY_TOKEN</b>&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"
</pre>

jika test tersebut mengeluarkan tulisan `CHALLENGE_ACCEPTED` pada terminal anda, maka webhook verifikasi sudah bekerja dengan benar.

ketiga kita coba melakukan test untuk webhook kita.
```
$ curl -H "Content-Type: application/json" -X POST "localhost:1337/webhook" -d '{"object": "page", "entry": [{"messaging": [{"message": "TEST_MESSAGE"}]}]}'
```

jika test tersebut mengularkan tulisan `EVENT RECEIVED` pada terminal ada, maka webhook sudah berkeja dengan benar.

#### deploy webhook
agar webhook ketika bisa digunakan untuk berkomunikasi dengan messanger, kita harus deploy pada server dengan [sertifikat SSL](#) yang valid terlebih dahulu. kita bisa deploy aplikasi-nya menggunakan heroku atau aws, tapi yang saya sarankan pake heroku saja karena mudah dan gratis.

#### hubungkan webhook kita dengan facebook app
