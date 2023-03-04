import { useState } from "react";
import server from "./server";
import * as secp256k1 from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

function WalletGenerator() {
  const [privateKey, setPrivateKey] = useState("");
  const [address, setAddress] = useState("");

  function generateWallet() {
    const privateKey = toHex(secp256k1.utils.randomPrivateKey());
    const address =
      "0x" +
      toHex(keccak256(secp256k1.getPublicKey(privateKey).slice(1)).slice(-20));
    setPrivateKey(privateKey);
    setAddress(address);
  }

  return (
    <div className="container wallet">
      <h1>Generate Wallet</h1>

      <label>
        Wallet Address
        <input
          placeholder="Newly generated account address"
          value={address}
          disabled
        ></input>
      </label>

      <label>
        Private Key
        <input
          placeholder="Newly generated account address"
          value={privateKey}
          disabled
        ></input>
      </label>

      <input
        className="button"
        value="Generate New Wallet"
        onClick={generateWallet}
      />
    </div>
  );
}

export default WalletGenerator;
