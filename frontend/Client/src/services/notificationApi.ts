export interface Notification {
  id: number;
  title: string;
  message: string;
  badgeLabel: string;
  type: "COMPLETION" | "PAYMENT";
  timestamp: string;
  read: boolean;
}

const BASE_URL = "http://localhost:7880/api/notifications";

export const notificationApi = {
  getAll: async (type?: string): Promise<Notification[]> => {
    const url = type && type !== "ALL" ? `${BASE_URL}?type=${type}` : BASE_URL;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  },

  sync: async (): Promise<void> => {
    await fetch(`${BASE_URL}/sync`);
  },
};