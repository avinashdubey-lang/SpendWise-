import api from "@/lib/axios";

export interface User {
  id: string;
  name: string;
  email: string;
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get<User>("/users/me");
  return response.data;
}
