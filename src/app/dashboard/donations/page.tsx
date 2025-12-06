"use client";
import { FormEvent, useEffect, useState } from "react";
import { GetLoggedInUser, GetLoggedInUserDetails, LoadFromCollection, WriteToDatabase } from "@/components/node-appwrite";
import { MojangAPI } from "@/components/node-apis";

const Donationpage = () => {
  const [data, setData] = useState<any>([]);
  const onFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get("username") as string;
    const Firstname = formData.get("firstname") as string;
    const Lastname = formData.get("lastname") as string;
    const email = formData.get("email") as string;
    const rank = formData.get("rank") as string;
    const UUID = (await MojangAPI(username)).id;
    const objectData = {
        Email: email,
        Item: JSON.stringify({ Rank: rank }),
        Firstname: Firstname,
        Lastname: Lastname,
        UUID: UUID,
        Date: `${new Date().toLocaleDateString("en-GB", {
            timeZone: "Europe/Amsterdam",
          })}/${new Date().toLocaleTimeString("en-GB", {
            timeZone: "Europe/Amsterdam",
            hour: '2-digit',
            minute: '2-digit'
            })}`,
        AddedBy: (await GetLoggedInUser())?.name,
        }
    const response = await WriteToDatabase("677fa96000311c0521fc", "6790043600214f28c6c6","", objectData);
    if (response.code === 200) {
      getEntries();
    }
  };

  const getEntries = async () => {
    const response = await LoadFromCollection(
      "677fa96000311c0521fc",
      "6790043600214f28c6c6"
    );
    const modifiedData = Array.isArray(response.message)
      ? await Promise.all(
          response.message.map(async (entry: any) => {
            const username = (await MojangAPI(entry.UUID)).name;
            const rankObject = JSON.parse(entry.Item); // Parse the stringified JSON
            return {
              ...entry,
              Item: rankObject.Rank, // Replace Rank with its value
              Username: username,
            };
          })
        )
      : [];

    setData(modifiedData);
  };

  useEffect(() => {
    getEntries();
  }, []);

  return (
    <>
      <div>
        <h2>Add Entry</h2>
        <form
          className="space-y-4 p-4 rounded shadow-md"
          onSubmit={onFormSubmit}
        >
          {" "}
          {/* add bg here*/}
          <label className="block">
            <span className="text-gray-700">
              Username:<span className="text-red-500">*</span>{" "}
              <span className="text-sm text-gray-500">(required)</span>
            </span>
            <input
              type="text"
              name="username"
              required
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">
              First name:<span className="text-red-500">*</span>{" "}
              <span className="text-sm text-gray-500">(required)</span>
            </span>{" "}
            <input
              type="text"
              name="firstname"
              required
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">
              Last name:<span className="text-red-500">*</span>{" "}
              <span className="text-sm text-gray-500">(required)</span>
            </span>{" "}
            <input
              type="text"
              name="lastname"
              required
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">
              Email:<span className="text-red-500">*</span>{" "}
              <span className="text-sm text-gray-500">(required)</span>
            </span>
            <input
              type="email"
              name="email"
              required
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Rank:<span className="text-red-500">*</span>{" "}
            <span className="text-sm text-gray-500">(required)</span></span>
            <select
              name="rank"
              required
              className="mt-1 block w-full text-black py-1 rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            >
              <option className="text-gray-600" value="">
                Select a rank
              </option>
              <option className="text-black" value="Commander">
                Commander
              </option>
              <option className="text-black" value="Lieutenant">
                Lieutenant
              </option>
              <option className="text-black" value="Commodore">
                Commodore
              </option>
              <option className="text-black" value="Sea Captain">
                Sea Captain
              </option>
            </select>
          </label>
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Add Entry
          </button>
        </form>
      </div>
      <div>
        <h2 className="text-lg font-semibold mt-8">Database Entries</h2>
        <table className="min-w-full table-auto border-collapse border border-gray-300 mt-4 rounded">
          <thead>
            <tr className="bg-black">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Username
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                UUID
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Email
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Rank
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((entry: any, index: number) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.Username}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.UUID}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.Email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {`${entry.Firstname} ${entry.Lastname}`}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.Item}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.Date}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="border border-gray-300 px-4 py-2 text-center"
                  colSpan={4}
                >
                  No entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default Donationpage;
