import { useState } from "react";
import server from "./server";

function Transfer({ address, setBalance }) {
  const [amount, setAmount] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [signature, setSignature] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const message = JSON.stringify({ recipient, amount });
    try {
      const { data } = await server.post(`send`, {
        message,
        signature,
      });
      if (data.error) {
        alert(data.error);
      } else {
        setBalance(data.balance);
      }
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="Enter the amount you want to transfer"
          value={amount}
          onChange={setValue(setAmount)}
        ></input>
      </label>

      <label>
        Recepient Address
        <input
          placeholder="Enter the recepient address"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Signed Transaction
        <input
          placeholder="Enter your signature for the transaction"
          value={signature}
          onChange={setValue(setSignature)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
