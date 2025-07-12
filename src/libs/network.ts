const API_BASE_URL = "https://api.bestbuyelectronics.lk/";

interface ApiError extends Error {
    status?: number;
    data?: any;
}

export const apiClient = {
    get: async <T>(endpoint: string): Promise<T> => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);

            if (!response.ok) {
                const errorData = await parseErrorResponse(response);
                throw createApiError(response.status, errorData);
            }

            return await response.json() as T;
        } catch (error) {
            if (error instanceof Error) {
                throw enhanceError(error);
            }
            throw new Error('Unknown error occurred');
        }
    },

    post: async <T>(endpoint: string, data: any, headers?: Record<string, string>): Promise<T> => {
        try {
            const isFormData = data instanceof FormData;

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "POST",
                headers: isFormData
                    ? headers // let the browser set the boundary for FormData
                    : {
                        "Content-Type": "application/json",
                        ...(headers || {})
                    },
                body: isFormData ? data : JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await parseErrorResponse(response);
                throw createApiError(response.status, errorData);
            }

            return await response.json() as T;
        } catch (error) {
            if (error instanceof Error) {
                throw enhanceError(error);
            }
            throw new Error('Unknown error occurred');
        }
    },

    delete: async <T>(endpoint: string): Promise<T> => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await parseErrorResponse(response);
                throw createApiError(response.status, errorData);
            }

            // For DELETE requests that might not return content
            if (response.status === 204) {
                return {} as T;
            }

            return await response.json() as T;
        } catch (error) {
            if (error instanceof Error) {
                throw enhanceError(error);
            }
            throw new Error('Unknown error occurred');
        }
    },


    put: async <T>(endpoint: string, data: any): Promise<T> => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await parseErrorResponse(response);
                throw createApiError(response.status, errorData);
            }

            return await response.json() as T;
        } catch (error) {
            if (error instanceof Error) {
                throw enhanceError(error);
            }
            throw new Error('Unknown error occurred');
        }
    },

};


async function parseErrorResponse(response: Response): Promise<any> {
    try {
        return await response.json();
    } catch {
        return { message: response.statusText };
    }
}

function createApiError(status: number, data: any): ApiError {
    const error: ApiError = new Error(data.message || `HTTP error ${status}`);
    error.status = status;
    error.data = data;
    return error;
}

function enhanceError(error: Error): ApiError {
    const apiError: ApiError = error;
    if (!apiError.status) apiError.status = 500;
    if (!apiError.data) apiError.data = { message: error.message };
    return apiError;
}


