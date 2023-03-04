const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp256k1 = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");
const { ethers } = require("ethers");

app.use(cors());
app.use(express.json());

const balances = {};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/generate", (req, res) => {
  const { address, amount } = req.body;
  if (!ethers.isAddress(address)) {
    res.send({ error: "Invlid address" });
    console.log("invalid address");
    return;
  }

  setInitialBalance(address);
  balances[address] += 100;
  res.send({ balance: balances[address] });
});

app.post("/send", (req, res) => {
  const { message, signature } = req.body;
  const messageObj = JSON.parse(message);
  const recipient = messageObj.recipient;
  const amount = Number(messageObj.amount);
  if (!ethers.isAddress(recipient)) {
    res.send({ error: "Invalid Address" });
    return;
  }
  // ecdsa allows recovery of public key from the signature itself
  // recover public key to identify the sender

  // the signature will contain the encrypted message has with recovery enabled
  // how is the hash of javascript objects found? .... convert Objects to Strings using Json.stringify
  // sent the JSON.stringify in the request and not the Object itself . It would be better this way because objects are stringified differently in different scenarios. Hence the string for which we they provide signature might be different from the string we obtain when we use JSON.stringify
  const messageHash = keccak256(utf8ToBytes(message));
  const senderPublicKey = secp256k1.recoverPublicKey(messageHash, signature, 1);
  const senderAddress =
    "0x" + toHex(keccak256(senderPublicKey.slice(1)).slice(-20)).toString();
  console.log(senderAddress);

  setInitialBalance(senderAddress);
  setInitialBalance(recipient);
  console.log(balances[recipient]);

  if (balances[senderAddress] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[senderAddress] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[senderAddress] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
