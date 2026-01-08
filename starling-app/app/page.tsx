import UsersComponent from "./Components/seeUsers";
import BalanceComponent from "./Components/seeBalance";
import TransactionsComponent from "./Components/seeTransactions";
import SavingsComponent from "./Components/seeSavings";

const Home = () => {
  return (
    <main>
      <UsersComponent />
      <BalanceComponent />
      <TransactionsComponent />
      <SavingsComponent />
    </main>
  );
};

export default Home;
