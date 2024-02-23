// const express = require("express");
// const app = express();
// const cors = require("cors");
// const path = require("path");
// const mercadopago = require('mercadopago');

// // REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
// mercadopago.configure({
// 	access_token: "APP_USR-3093528509427836-071721-f85054a95aac7c3445a4ba7636c369a3-30475609"
// });


// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// app.use(express.static(path.join(__dirname, "../client")));
// app.use(cors());

// app.get("/", function (req, res) {
// 	// res.status(200).sendFile("index.html");
//     const filePath = path.resolve(__dirname, "..", "client", "index.html")
//     res.sendFile(filePath);
// });

// app.post("/create_preference", (req, res) => {

// 	let preference = {
// 		items: [
// 			{
// 				title: req.body.description,
// 				unit_price: Number(req.body.price),
// 				quantity: Number(req.body.quantity),
// 			}
// 		],
// 		back_urls: {
// 			"success": "http://localhost:8080",
// 			"failure": "http://localhost:8080",
// 			"pending": ""
// 		},
// 		auto_return: "approved",
// 	};

// 	mercadopago.preferences.create(preference)
// 		.then(function (response) {
// 			res.json({
// 				id: response.body.id
// 			});
// 		}).catch(function (error) {
// 			console.log(error);
// 		});
// });

// app.get('/feedback', function (req, res) {
// 	res.json({
// 		Payment: req.query.payment_id,
// 		Status: req.query.status,
// 		MerchantOrder: req.query.merchant_order_id
// 	});
// });

// app.listen(8080, () => {
// 	console.log("The server is now running on Port 8080");
// });

const express = require('express');

const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const functions = require('firebase-functions');
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Configura nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'andreshosch114@gmail.com',
    pass: 'dbmewkfjpoiqtvvw'
  }
});

// Ruta para enviar el correo electrónico
app.post('/send-email', (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: 'andreshosch114@gmail.com',
    to: to,
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
      res.status(500).send('Error al enviar el correo');
    } else {
      console.log('Correo enviado: ' + info.response);
      res.status(200).send('Correo enviado correctamente');
    }
  });
});
exports.sendEmail = functions.https.onRequest(app);
// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});