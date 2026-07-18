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