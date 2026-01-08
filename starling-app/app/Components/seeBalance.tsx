"use client";

import { useState, useEffect } from "react";

interface StarlingBalance {
  clearedBalance: {
    currency: string;
    minorUnits: number;
  };
}

const balanceComponent = () => {
  const [balance, setBalance] = useState<StarlingBalance>();

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await fetch("api/routes/balances");
      const data = await res.json();
      setBalance(data);
      console.log(data);
    };

    fetchBalance();
  }, []);

  if (!balance) {
    return <div>Loading balance... we'll get there...</div>;
  }

  const displayAmount = (balance.clearedBalance.minorUnits / 100).toFixed(2);
  const currency = balance.clearedBalance.currency;
  return (
    <>
      <h2 className="felx bg-purple-400 text-lg mt-1 mb-3 p-1">
        Cleared Balance: {displayAmount} {currency}
      </h2>
    </>
  );
};

export default balanceComponent;
