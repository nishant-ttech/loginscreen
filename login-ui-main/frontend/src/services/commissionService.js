const API_BASE_URL = process.env.REACT_APP_API_URL || "/api/v1";

const getAuthHeaders = () => {
  const token = localStorage.getItem("netpay-auth-token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const commissionService = {
  async getCommissionStats() {
    const response = await fetch(`${API_BASE_URL}/commission/stats`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch commission stats");
    return response.json();
  },

  async getTransactions(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/commission/transactions?${queryParams}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch commission transactions");
    return response.json();
  },

  async getTransaction(id) {
    const response = await fetch(`${API_BASE_URL}/commission/transactions/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch transaction");
    return response.json();
  },

  async getUserCommissionHistory(userId, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/commission/users/${userId}?${queryParams}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch user commission history");
    return response.json();
  },
};

export const TRANSACTION_TYPES = {
  DEPOSIT: "Deposit",
  WITHDRAWAL: "Withdrawal",
  CARD_ISSUANCE: "Card Issuance",
  CARD_ISSUANCE_PHYSICAL: "Card Issuance Physical",
  CARD_ISSUANCE_VIRTUAL: "Card Issuance Virtual",
  CARD_TOPUP: "Card Topup",
  MERCHANT_COMMISSION: "Merchant Commission",
  REFERRAL_BONUS: "Referral Bonus",
};

export const COMMISSION_RATES = {
  DEPOSIT: 0.0175, // 1.75%
  WITHDRAWAL: 0.02, // 2%
  CARD_ISSUANCE_PHYSICAL: 100, // $100 flat
  CARD_ISSUANCE_VIRTUAL: 0.001, // 0.1%
  CARD_TOPUP: 0.015, // 1.5%
};

export default commissionService;
