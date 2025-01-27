"use client";
import React, { useState, useEffect } from "react";
import {
  LoadFromCollection,
  WriteToDatabase,
  DeleteFromDatabase,
} from "@/components/node-appwrite";

interface Server {
  Server_IP: string;
  Port: string;
  Server_Name: string;
  Forge_Version: string;
  Discord_Channel_ID: string;
}

const discordPage = () => {
  const [servers, setServers] = useState<any[]>([
    {
      documentID: "",
      Server: {
        Server_IP: "",
        Port: "",
        Server_Name: "",
        Forge_Version: "",
        Discord_Channel_ID: "",
      },
    },
  ]);

  const DatabaseInfo = {
    DatabaseID: "677fa96000311c0521fc",
    CollectionID: "677fa969000d44d60c57",
  };

  const handleSave = async () => {
    servers.forEach(async (server) => {
      const response = await WriteToDatabase(
        DatabaseInfo.DatabaseID,
        DatabaseInfo.CollectionID,
        server.documentID,
        server.Server
      );
      await handleLoad();
      console.log(response.message);
    });
  };

  const handleLoad = async () => {
    const response = await LoadFromCollection(
      DatabaseInfo.DatabaseID,
      DatabaseInfo.CollectionID
    );
    const formattedServers = Array.isArray(response.message)
      ? response.message.map((server: any) => ({
          documentID: server.$id,
          Server: {
            Server_IP: server.Server_IP,
            Port: server.Port,
            Server_Name: server.Server_Name,
            Forge_Version: server.Forge_Version,
            Discord_Channel_ID: server.Discord_Channel_ID,
          },
        }))
      : [];
    setServers(formattedServers);
  };

  useEffect(() => {
    handleLoad();
  }, []);

  const addServer = () => {
    setServers([
      ...servers,

      {
        documentID: "",
        Server: {
          Server_IP: "",
          Port: "",
          Server_Name: "",
          Forge_Version: "",
          Discord_Channel_ID: "",
        },
      },
    ]);
  };

  const removeServer = async (index: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this server?"
    );
    if (!confirmDelete) {
      return;
    }
    const serverToRemove = servers[index];
    if (serverToRemove.documentID) {
      await DeleteFromDatabase(
        DatabaseInfo.DatabaseID,
        DatabaseInfo.CollectionID,
        serverToRemove.documentID
      );
    }
    if (servers.length === 1) {
      setServers([
        {
          documentID: "",
          Server: {
            Server_IP: "",
            Port: "",
            Server_Name: "",
            Forge_Version: "",
            Discord_Channel_ID: "",
          },
        },
      ]);
    } else {
      const newServers = servers.filter((_, i) => i !== index);
      setServers(newServers);
    }
  };

  const handleInputChange = (
    index: number,
    field: keyof Server,
    value: string
  ) => {
    const newServers = [...servers];
    newServers[index].Server[field] = value;
    setServers(newServers);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Server IP</th>
            <th>Port</th>
            <th>Server Name</th>
            <th>Forge Version</th>
            <th>Discord Channel ID</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="text-black">
          {servers.length > 0 &&
            servers.map((serverData, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={serverData.Server.Server_IP}
                    onChange={(e) =>
                      handleInputChange(index, "Server_IP", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={serverData.Server.Port}
                    onChange={(e) =>
                      handleInputChange(index, "Port", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={serverData.Server.Server_Name}
                    onChange={(e) =>
                      handleInputChange(index, "Server_Name", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={serverData.Server.Forge_Version}
                    onChange={(e) =>
                      handleInputChange(index, "Forge_Version", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={serverData.Server.Discord_Channel_ID}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "Discord_Channel_ID",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <button className={"btn"} onClick={() => removeServer(index)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <button className={"btn"} onClick={addServer}>
        Add Server
      </button>
      <button className={"btn"} onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default discordPage;
