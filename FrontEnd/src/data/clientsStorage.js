import seedClients from "./clientsData.json";

export const CLIENTS_STORAGE_KEY = "clientsData";

export const getSeedClients = () => seedClients;

export const getClients = () => {
  try {
    const storedClients = JSON.parse(localStorage.getItem(CLIENTS_STORAGE_KEY) || "[]");

    if (!Array.isArray(storedClients) || storedClients.length === 0) {
      return getSeedClients();
    }

    const baseIds = new Set(getSeedClients().map((client) => client.id));
    const hasBaseClients = storedClients.some((client) => baseIds.has(client.id));
    return hasBaseClients ? storedClients : [...getSeedClients(), ...storedClients];
  } catch (error) {
    return getSeedClients();
  }
};

export const saveClients = (clients) => {
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
};
