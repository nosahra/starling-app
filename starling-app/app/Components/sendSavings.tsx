"use client";
import { useContext, useState, useEffect } from "react";
import { useAmountContext } from "./amountContext";

const SendSavingsComponent = () => {
    const amountToSavings = useAmountContext();

    interface StarlingSavingsGoal {
    name: string;
    currency: string;
    totalSaved: {
      currency: string;
      minorUnits: number;
    };
    savingsGoalUid: string;
  }
  const [goals, setGoals] = useState<StarlingSavingsGoal[]>([]);
  const [showGoalSelector, setShowGoalSelector] = useState(false);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch("api/routes/savings");
        const data = await res.json();
        setGoals(data.savingsGoalList || []);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };
    fetchGoals();
  }, []);

    const handleSendAmount = async (savingsGoalUid: string, currency: string) => {
      console.log(`sending ${amountToSavings}p to ${savingsGoalUid}...`);
      console.log(goals)
      const res = await fetch("api/routes/savings/transfer",
        {
          method: "POST",
          body: JSON.stringify({
            savingsGoalUid: savingsGoalUid,
            currency: currency,
            targetAmount: amountToSavings,
          }),
        });

        if (res.ok) {
          alert("Money moved successfully!");
          setShowGoalSelector(false);
        } else {
          alert("Transfer failed...")
        }
    }
  return (
    <>
    <p>
        Rounding up all your spendings this week, you have{" "}
        {amountToSavings / 100}{" "}
        {"GBP"} to move into a
        savings goal.
      </p>
      {!showGoalSelector ? ( 
        <button
        onClick={() => setShowGoalSelector(true)}
        className="bg-white text-black p-5 hover:cursor-pointer"
      >
        Move {(amountToSavings / 100).toFixed(2)}{" "}
        {"GBP"} to savings
      </button>
      ) : (
        <div>
          <p>Select the savings goal to send to:</p>
          <div className="flex flex-col">
          {goals.map((goal, idx) => (
          <button
            key={idx}
            onClick={() => handleSendAmount(goal.savingsGoalUid, goal.currency)}
            className="bg-white text-black p-1 m-1 hover:cursor-pointer"
          >
            <h2>
              {goal.name}: {(goal.totalSaved.minorUnits / 100).toFixed(2)} {goal.totalSaved.currency}
            </h2>
          </button>))}
          </div>
        </div>
      )}
      </>
  )
};

export default SendSavingsComponent;
