import api from "@/lib/axios";

type LoginRequest = {
    email: string;
    password: string;
};

type LoginResponse = {
    access_token: string;
    token_type: string;
};

export async function login(
    credentials: LoginRequest
): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
        "/auth/login",
        credentials
    );

    return response.data;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  name: string;
  email: string;
}

export async function register(
  payload: RegisterRequest
): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>(
    "/users/register",
    payload
  );
  return response.data;
}