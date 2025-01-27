"use client"
import {
  GetAllUsers,
  CreateUser,
  UpdateUser,
  DeleteUser,
} from "@/components/node-appwrite";
import React, { useEffect, useState } from "react";
import SlidingMenu from "@/components/sidemenu";

const DashboardAuthPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [menuState, setMenuState] = useState<string>("");
  const [menuPosition, setMenuPosition] = useState<
    "top" | "left" | "bottom" | "right"
  >("right");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [menuThickness, setMenuThickness] = useState("20vw");

  const fetchUsers = async () => {
    try {
      const response = await GetAllUsers();
      setUsers(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const onFormSubmitCreateUser = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = await CreateUser(
      formData.get("username") as string,
      formData.get("email") as string,
      formData.get("password") as string
    );
    if (data.code === 200) {
      fetchUsers();
      setMenuState("");
    }
  };
  const onFormSubmitEditUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = await UpdateUser(
      formData.get("username") as string,
      formData.get("email") as string,
      formData.get("password") as string,
      selectedUser.id
    );
    if (data.code === 200) {
      fetchUsers();
      setMenuState("");
    }
  };

  const handleDeleteUser = async () => {
    const data = await DeleteUser(selectedUser.id);
    if (data.code === 200) {
      fetchUsers();
    }
    setMenuState("");
    setSelectedUser(null);
  };

  return (
    <div>
      {/* new user menu */}
      <SlidingMenu
        isMenuOpen={menuState === "auth"}
        position={menuPosition}
        width={menuThickness}
        height="100vh"
      >
        <div>
          <section className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-center underline">Auth</h1>
            <button
              className="Icon text-[48px]"
              onClick={() => setMenuState("")}
            >
              Close
            </button>
          </section>
          <hr />
          <br />
          <form
            className="flex h-full flex-col justify-center space-y-4 text-black"
            onSubmit={onFormSubmitCreateUser}
          >
            <h2 className="text-2xl font-bold text-center text-white">
              New user
            </h2>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="p-2 input-primary rounded border border-gray-300"
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              className="p-2 input-primary rounded border border-gray-300"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="p-2 input-primary rounded border border-gray-300"
            />
            <button type="submit" className="p-2 w-48 btn rounded">
              Create User
            </button>
          </form>
        </div>
      </SlidingMenu>
      {/* user edit menu */}
      <SlidingMenu
        isMenuOpen={menuState === "user_edit"}
        position={"center"}
        width={"40%"}
        height={"40%"}
      >
        <section className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-center underline">Edit User</h1>
          <button className="Icon text-[48px]" onClick={() => setMenuState("")}>
            Close
          </button>
        </section>
        <hr />
        <br />
        <form
          className="flex h-full flex-col justify-center space-y-4 text-black"
          onSubmit={onFormSubmitEditUser}
        >
          <h2 className="text-2xl font-bold text-center text-white">
            Edit user
          </h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="off"
            className="p-2 input-primary rounded border border-gray-300"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            autoComplete="off"
            className="p-2 input-primary rounded border border-gray-300"
          />
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Password"
            className="p-2 input-primary rounded border border-gray-300"
          />
          <button type="submit" className="p-2 w-48 btn rounded">
            Update User
          </button>
        </form>
      </SlidingMenu>
      {/* user delete menu */}

      <SlidingMenu
        isMenuOpen={menuState === "user_delete"}
        position={"center"}
        width={"40vw"}
        height={"400px"}
      >
        <section className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-center underline">Edit User</h1>
          <button className="Icon text-[48px]" onClick={() => setMenuState("")}>
            Close
          </button>
        </section>
        {selectedUser && (
          <section>
            <p>Are you sure you want to delete user {selectedUser.name}?</p>
            <hr />
            <br />
            <p className="underline">This action can not be restored!</p>
            <br />
            <br />
            <br />
            <br />
            <br />
            <section className="flex flex-row justify-evenly items-center">
              <button
                className="btn px-4 py-2 text-white"
                onClick={async () => {
                  handleDeleteUser();
                }}
              >
                Delete {selectedUser.name}
              </button>
              <button
                className="btn px-4 py-2 text-white"
                onClick={() => {
                  setMenuState("");
                  setSelectedUser(null);
                }}
              >
                Cancel
              </button>
            </section>
          </section>
        )}
      </SlidingMenu>

      <h1>Users</h1>
      <div className="flex justify-end mb-4">
        <button
          className="btn text-white py-2 px-4 rounded"
          onClick={() => setMenuState("auth")}
        >
          New User
        </button>
      </div>
      <table className="min-w-full text-left border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Password</th>
            <th className="w-12 h-8 border"></th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border">{user.name}</td>
                <td className="py-2 px-4 border">{user.email}</td>
                <td className="py-2 px-4 border">******</td>
                <td className="py-2 px-4 border flex justify-center space-x-2">
                  <button
                    className="Icon text-[30px] btn p-1"
                    onClick={() => {
                      setMenuState("user_delete");
                      setSelectedUser(user);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className="Icon text-[30px] btn p-1"
                    onClick={() => {
                      setMenuState("user_edit");
                      setSelectedUser(user);
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardAuthPage;
