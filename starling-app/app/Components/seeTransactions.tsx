"use client";
import { useState, useEffect } from "react";
import { AmountContext } from "./amountContext";
import SendSavingsComponent from "./sendSavings";


const TransactionsComponent = () => {
  interface StarlingTransaction {
    feedItemUid: string;
    amount: {
      currency: string;
      minorUnits: number;
    };
    transactionTime: string;
    reference: string;
    direction: "OUT";
  }

  const [transactions, setTransactions] = useState<StarlingTransaction[]>([]);
  const outTransactions = new Array;

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await fetch("api/routes/transactions");
        const data = await res.json();
        setTransactions(data.feedItems || []);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransaction();
  }, []);

  const getOutOnly = (transactions: StarlingTransaction[]) => {
    for (let i=0; i<transactions.length; i++) {
      if (transactions[i].direction == 'OUT') {
        outTransactions.push(transactions[i]);
      }
    }
  };

  const roundUpTransactions = (transactions: StarlingTransaction[]) => {
    let total = 0;
    for (let i = 0; i < transactions.length; i++) {
      let amount = transactions[i].amount.minorUnits / 100;
      let roundUpAmount = Math.ceil(amount);
      let diff = Math.round((roundUpAmount - amount) * 100);
      total += diff;
    }
    return total;
  };

  getOutOnly(transactions);
  const amountToSavings = roundUpTransactions(outTransactions);

  if (!transactions) {
    return <div>Loading transactions... we'll get there too :D</div>;
  }
  if (!outTransactions) {
    return <div>No outgoing transactions this week!</div>
  }
  return (
    <>
         <h1>Spendings from last 7 days:</h1>
      {outTransactions.map((trans, idx) => (
        <div key={idx}>
          <h3>
            {trans.reference}: {(trans.amount.minorUnits / 100).toFixed(2)}{" "}
            {trans.amount.currency}
          </h3>
        </div>
      ))}
    <AmountContext.Provider value={amountToSavings}>
      <SendSavingsComponent />
    </AmountContext.Provider>
    </>
  );
};

export default TransactionsComponent;
