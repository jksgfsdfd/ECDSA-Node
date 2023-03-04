import Wallet from "./Wallet";
import Transfer from "./Transfer";
import SigningWallet from "./SigningWallet";
import "./App.scss";
import { useState } from "react";
import WalletGenerator from "./WalletGenerator";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");

  return (
    <div className="app">
      <WalletGenerator />
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <SigningWallet />
      <Transfer setBalance={setBalance} address={address} />
    </div>
  );
}

export default App;
