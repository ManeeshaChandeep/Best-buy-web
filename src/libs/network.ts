const API_BASE_URL = "http://api.bestbuyelectronics.lk/";

export const apiClient = {
    get: async (endpoint) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        return await response.json();
    },

    post: async (endpoint, data) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return await response.json();
    },

    // Add other methods (PUT, DELETE) if needed
};
