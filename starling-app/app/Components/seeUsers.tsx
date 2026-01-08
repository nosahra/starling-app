"use client";

import { useEffect, useState } from "react";

interface StarlingAccount {
  accountUid: string;
  accountType: string;
  defaultCategory: string;
}

const UsersComponent = () => {
  const [users, setUsers] = useState<StarlingAccount[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/routes/users");
      const data = await res.json();
      setUsers(data.accounts);

      console.log(data);
    };

    fetchUsers();
  }, []);

  return (
    <>
      {users.map((user, idx) => (
        <div key={idx}>
          <h1>
            {idx} : {user.accountUid}
          </h1>
        </div>
      ))}
    </>
  );
};

export default UsersComponent;
