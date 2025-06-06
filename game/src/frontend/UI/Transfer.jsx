import React, { useEffect, useState } from "react";
import "./Transfer.css";

const API_URL = "http://127.0.0.1:5000";

const ACCOUNTS = {
  "Account 1": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "Account 2": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
};

const BASE_ACCOUNT = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

const Transfer = () => {
  const [sender, setSender] = useState("Account 1");
  const [recipient, setRecipient] = useState("Account 2");
  const [balance, setBalance] = useState(0);
  const [recipientBalance, setRecipientBalance] = useState(0);
  const [totalSupply, setTotalSupply] = useState(null);
  const [amount, setAmount] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const senderAddress = ACCOUNTS[sender];
  const recipientAddress = ACCOUNTS[recipient];

  const leftoverBalance =
    senderAddress !== BASE_ACCOUNT && amount !== ""
      ? balance - Number(amount)
      : null;

  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const res = await fetch(`${API_URL}/init`, { method: "POST" });
        const data = await res.json();
        if (data.totalSupply) setTotalSupply(data.totalSupply);
      } catch (err) {
        console.error("❌ Failed to fetch init data", err);
      }
    };
    fetchInitData();
  }, []);

  useEffect(() => {
    setMessage("");
    setAmount("");
    setQuiz(null);
    setSelectedOption("");

    fetch(`${API_URL}/balance/${senderAddress}`)
      .then((res) => res.json())
      .then((data) => setBalance(data.balance))
      .catch(() => setBalance(0));

    fetch(`${API_URL}/balance/${recipientAddress}`)
      .then((res) => res.json())
      .then((data) => setRecipientBalance(data.balance))
      .catch(() => setRecipientBalance(0));
  }, [sender, recipient]);

  const fetchQuiz = () => {
    setLoading(true);
    fetch(`${API_URL}/quiz`)
      .then((res) => res.json())
      .then((data) => setQuiz(data))
      .catch(() => setMessage("❌ Failed to fetch quiz"))
      .finally(() => setLoading(false));
  };

  const handleTransfer = async () => {
    if (senderAddress === BASE_ACCOUNT && !selectedOption) {
      setMessage("❌ Please select a quiz option");
      return;
    }
    if (
      senderAddress !== BASE_ACCOUNT &&
      (Number(amount) <= 0 || Number(amount) > balance)
    ) {
      setMessage("❌ Invalid transfer amount");
      return;
    }

    setLoading(true);
    setMessage("");

    const transferData = {
      from: senderAddress,
      to: recipientAddress,
      amount: senderAddress === BASE_ACCOUNT ? 50 : Number(amount),
    };

    if (senderAddress === BASE_ACCOUNT) {
      transferData.quiz_answer = selectedOption;
    }

    try {
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
        fetch(`${API_URL}/balance/${senderAddress}`)
          .then((res) => res.json())
          .then((data) => setBalance(data.balance));
        fetch(`${API_URL}/balance/${recipientAddress}`)
          .then((res) => res.json())
          .then((data) => setRecipientBalance(data.balance));
        setAmount("");
        setQuiz(null);
        setSelectedOption("");
      } else {
        setMessage(`❌ ${result.error || "Transfer failed"}`);
      }
    } catch (error) {
      setMessage("❌ Network error or server unavailable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div className="transfer-container">
      <h2>💰 RDT Token Dashboard</h2>

      {totalSupply !== null && (
        <div className="section">
          <p><strong>Total Supply:</strong> {totalSupply} RDT</p>
        </div>
      )}

      <div className="section">
        <label>Sender:</label>
        <select
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          disabled={loading}
        >
          {Object.keys(ACCOUNTS).map((acc) => (
            <option key={acc}>{acc}</option>
          ))}
        </select>
        <p><strong>{sender}</strong> Balance: {balance} RDT</p>
      </div>

      <div className="section">
        <label>Recipient:</label>
        <select
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          disabled={loading}
        >
          {Object.keys(ACCOUNTS)
            .filter((acc) => acc !== sender)
            .map((acc) => (
              <option key={acc}>{acc}</option>
            ))}
        </select>
        <p><strong>{recipient}</strong> Balance: {recipientBalance} RDT</p>
      </div>

      {senderAddress === BASE_ACCOUNT ? (
        <div className="section">
          <button onClick={fetchQuiz} disabled={loading || quiz !== null}>
            {quiz ? "Quiz Loaded" : loading ? "Loading Quiz..." : "Get Quiz"}
          </button>
          {quiz && (
            <>
              <p><strong>{quiz.question}</strong></p>
              {Object.entries(quiz.options).map(([key, value]) => (
                <div key={key}>
                  <input
                    type="radio"
                    name="quiz"
                    value={key}
                    checked={selectedOption === key}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    disabled={loading}
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
            max={balance}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
          />
          <small>Max: {balance}</small>
          {amount && leftoverBalance !== null && leftoverBalance >= 0 && (
            <p>Leftover balance after transfer: {leftoverBalance} RDT</p>
          )}
          {amount && leftoverBalance !== null && leftoverBalance < 0 && (
            <p style={{ color: "red" }}>⚠️ Amount exceeds your balance!</p>
          )}
        </div>
      )}

      <button
        onClick={handleTransfer}
        disabled={
          loading ||
          (senderAddress === BASE_ACCOUNT && !selectedOption) ||
          (senderAddress !== BASE_ACCOUNT &&
            (Number(amount) <= 0 || Number(amount) > balance))
        }
      >
        {loading ? "Processing..." : "🚀 Send"}
      </button>

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default Transfer;
