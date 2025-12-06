"use server";
export const ServerAPI = async (address: string,port:number) => {
    try {
        const response = await fetch(`https://api.mcstatus.io/v2/status/java/${address}:${port}?query=true`);
        const ServerStatus = await response.json();
        return ServerStatus;
    } catch (error) {
        console.error(error);
    }
}

export const MojangAPI = async (username: string) => {
    try {
        const response = await fetch(`https://api.minetools.eu/uuid/${username}`);
        const UUID = await response.json();
        return UUID;
    } catch (error) {
        console.error(error);
    }
}