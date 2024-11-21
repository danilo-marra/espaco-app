import axios from "axios";

export const API_URL = "http://localhost:3000";

const httpRequest = async <T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: Record<string, unknown> | T,
): Promise<T> => {
  try {
    const response = await axios({
      url,
      method,
      headers: { "Content-Type": "application/json" },
      data: body,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Erro na requisição ${method} ${url}:`, error.message);
      throw new Error(error.response?.data?.message || "Erro na requisição");
    }
    throw new Error("Erro desconhecido");
  }
};

export default httpRequest;
