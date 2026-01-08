"use client";
import { useState, useEffect } from "react";

const SavingsComponent = () => {
  interface StarlingSavingsGoal {
    name: string;
    currency: string;
    totalSaved: {
      currency: string;
      minorUnits: number;
    };
    savingsUid: string;
  }
  const [goals, setGoals] = useState<StarlingSavingsGoal[]>([]);
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
  const handleCreateGoal = async () => {
    const goalName = prompt("Enter a title for your savings goal: ");
    if (!goalName) return;

    try {
      const res = await fetch("api/routes/savings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: goalName,
          currency: "GBP",
          targetAmount: 0,
        }),
      });
      if (!res.ok) {
        console.error("Failed to create goal");
      }
      const newGoal = await res.json();
      alert("goal created!");

      const refreshRes = await fetch("api/routes/savings");
      const newData = await refreshRes.json();
      setGoals(newData.savingsGoalList || []);
    } catch (error) {
      console.error("Error calling savings API:", error);
    }
  };
  return (
    <>
      <h1>Savings Goals:</h1>
      {goals.map((goal, idx) => (
        <div key={idx}>
          <h2>
            {goal.name}: {goal.totalSaved.minorUnits / 100} {goal.totalSaved.currency}
          </h2>
        </div>
      ))}
      <button
        onClick={handleCreateGoal}
        className="bg-white text-black p-5 hover:cursor-pointer"
      >
        Create new savings goal
      </button>
    </>
  );
};

export default SavingsComponent;
