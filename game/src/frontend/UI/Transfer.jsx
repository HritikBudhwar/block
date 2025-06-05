import React, { useEffect, useState } from "react";
import "./Transfer.css";

const API_URL = "http://localhost:5000"; // Flask API

const ACCOUNTS = {
  "Account 1": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "Account 2": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
};

const BASE_ACCOUNT = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

const Transfer = () => {
  const [sender, setSender] = useState("Account 1");
  const [recipient, setRecipient] = useState("Account 2");
  const [balance, setBalance] = useState(0);
  const [recipientBalance, setRecipientBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [quiz, setQuiz] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [message, setMessage] = useState("");

  const senderAddress = ACCOUNTS[sender];
  const recipientAddress = ACCOUNTS[recipient];

  useEffect(() => {
    fetch(`${API_URL}/balance/${senderAddress}`)
      .then((res) => res.json())
      .then((data) => setBalance(data.balance));
    fetch(`${API_URL}/balance/${recipientAddress}`)
      .then((res) => res.json())
      .then((data) => setRecipientBalance(data.balance));
  }, [sender, recipient]);

  const fetchQuiz = () => {
    fetch(`${API_URL}/quiz`)
      .then((res) => res.json())
      .then((data) => setQuiz(data));
  };

  const handleTransfer = async () => {
    const transferData = {
      from: senderAddress,
      to: recipientAddress,
      amount: senderAddress === BASE_ACCOUNT ? 50 : amount,
    };

    if (senderAddress === BASE_ACCOUNT) {
      transferData.quiz_answer = selectedOption;
    }

    const res = await fetch(`${API_URL}/transfer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transferData),
    });

    const result = await res.json();
    if (res.ok) {
      setMessage(`✅ Transfer successful: ${result.amount_transferred} RDT`);
    } else {
      setMessage(`❌ ${result.error || "Transfer failed"}`);
    }
  };

  return (
    <div className="transfer-container">
      <h2>💰 RDT Token Dashboard</h2>

      <div className="section">
        <label>Sender:</label>
        <select value={sender} onChange={(e) => setSender(e.target.value)}>
          {Object.keys(ACCOUNTS).map((acc) => (
            <option key={acc}>{acc}</option>
          ))}
        </select>
        <p>Balance: {balance} RDT</p>
      </div>

      <div className="section">
        <label>Recipient:</label>
        <select
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        >
          {Object.keys(ACCOUNTS)
            .filter((acc) => acc !== sender)
            .map((acc) => (
              <option key={acc}>{acc}</option>
            ))}
        </select>
        <p>Balance: {recipientBalance} RDT</p>
      </div>

      {senderAddress === BASE_ACCOUNT ? (
        <div className="section">
          <button onClick={fetchQuiz}>Get Quiz</button>
          {quiz && (
            <>
              <p>
                <strong>{quiz.question}</strong>
              </p>
              {Object.entries(quiz.options).map(([key, value]) => (
                <div key={key}>
                  <input
                    type="radio"
                    name="quiz"
                    value={key}
                    checked={selectedOption === key}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  {key}: {value}
                </div>
              ))}
              <p>Transfer Amount: 50 RDT</p>
            </>
          )}
        </div>
      ) : (
        <div className="section">
          <label>Amount to transfer:</label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      )}

      <button onClick={handleTransfer}>🚀 Send</button>

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default Transfer;
