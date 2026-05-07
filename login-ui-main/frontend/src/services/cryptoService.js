const API_BASE_URL = process.env.REACT_APP_API_URL || "/api/v1";

const getAuthHeaders = () => {
  const token = localStorage.getItem("netpay-auth-token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const cryptoService = {
  async getChainsWallets(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/crypto/chains-wallets?${queryParams}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch chains wallets");
    return response.json();
  },

  async getTransactions(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/crypto/transactions?${queryParams}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch crypto transactions");
    return response.json();
  },

  async getOperations(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/crypto/operations?${queryParams}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch crypto operations");
    return response.json();
  },

  async getGasTreasury(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/crypto/gas-treasury?${queryParams}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch gas treasury");
    return response.json();
  },
};

export default cryptoService;