"use client";
import { useState, useEffect } from "react";

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

  const latestTransactions: StarlingTransaction[] = new Array();
  const [transactions, setTransactions] = useState<StarlingTransaction[]>([]);

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

  const filterTransactions = () => {
    const cutOff = Date.now() - 1000 * 60 * 60 * 24 * 7; //calculates the date in miliseconds seven days ago
    for (let i = 0; i < transactions.length; i++) {
      if (
        transactions[i].direction === "OUT" &&
        new Date(transactions[i].transactionTime).getTime() > cutOff
      ) {
        //if the date on a transaction (OUT) is after the cutoff time
        latestTransactions.push(transactions[i]); //then put this date in latestTransactions array
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

  filterTransactions();
  const amountToSavings = roundUpTransactions(latestTransactions);

  if (!transactions) {
    return <div>Loading transactions... we'll get there too :D</div>;
  }
  return (
    <>
      <h1>Spendings from last 7 days:</h1>
      {latestTransactions.map((trans, idx) => (
        <div key={idx}>
          <h3>
            {trans.reference}: {trans.amount.minorUnits / 100}{" "}
            {trans.amount.currency}
          </h3>
        </div>
      ))}
      <p>
        Rounding up all your spendings this week, you have{" "}
        {amountToSavings / 100}{" "}
        {latestTransactions[0]?.amount.currency || "GBP"} to move into your
        savings pot.
      </p>
      <button className="bg-white text-black p-5 hover:cursor-pointer">
        Move {amountToSavings / 100}{" "}
        {latestTransactions[0]?.amount.currency || ""} to savings
      </button>
    </>
  );
};

export default TransactionsComponent;
