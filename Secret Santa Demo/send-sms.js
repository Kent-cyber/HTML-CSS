const fs = require("fs");
const path = require("path");
const twilio = require('twilio');

// Les identifiants Twilio (qui sont obtenus sur https://www.twilio.com/console) que je dois créer mes identifiants
const accountSid = 'TON_ACCOUNT_SID';
const authToken = 'TON_AUTH_TOKEN';
const client = new twilio(accountSid, authToken);

const tiragesPath = path.join(__dirname, "tirages.json");

// Lecture du fichier json
let tirages;
try {
    const data = fs.readFileSync(tiragesPath, "tuf8");
    tirages = JSON.parse(data);
} catch (err) {
    console.error("Erreur de lecture de tirages.json", err.message);
    process.exit(1);
}

// Envoi des messages
tirages.forEach(({ nom, telephone, destinataire }) => {
  const message = `🎄 Bonjour ${nom} ! Tu dois offrir un cadeau à 🎁 ${destinataire}. Joyeux Secret Santa ! 🎅`;

  client.messages
    .create({
      body: message,
      from: fromNumber,
      to: telephone
    })
    .then(msg => {
      console.log(`✔️ SMS envoyé à ${nom} (${telephone}) — SID: ${msg.sid}`);
    })
    .catch(err => {
      console.error(`❌ Erreur d'envoi à ${nom} (${telephone}) : ${err.message}`);
    });
});