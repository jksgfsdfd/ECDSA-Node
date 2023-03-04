import { useState } from "react";
import server from "./server";
import * as secp256k1 from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

function SigningWallet() {
  const [amount, setAmount] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [signed, setSigned] = useState(false);
  const [signature, setSignature] = useState("");

  async function signTransaction(evt) {
    evt.preventDefault();
    const message = JSON.stringify({ recipient, amount });
    const messageHash = keccak256(utf8ToBytes(message));
    const [sign, recovery] = await secp256k1.sign(messageHash, privateKey, {
      recovered: true,
    });
    setSignature(toHex(sign));
    setSigned(true);
  }

  const setter = (settingFunction) => (evt) => {
    settingFunction(evt.target.value);
  };

  return (
    <>
      <form className="container transfer" onSubmit={signTransaction}>
        <h1>Sign Transactions</h1>

        <label>
          Private Key
          <input
            placeholder="Input your private key"
            value={privateKey}
            onChange={setter(setPrivateKey)}
          ></input>
        </label>

        <label>
          Recipient
          <input
            placeholder="Enter the recepient address"
            value={recipient}
            onChange={setter(setRecipient)}
          ></input>
        </label>

        <label>
          Amount
          <input
            placeholder="Enter the amount to transfer"
            value={amount}
            onChange={setter(setAmount)}
          ></input>
        </label>

        <input type="submit" className="button" value="SignTransaction" />
      </form>
      {signed ? <p>{signature}</p> : <></>}
    </>
  );
}

export default SigningWallet;
