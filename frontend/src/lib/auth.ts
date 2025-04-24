"use server";

import { cookies } from "next/headers";

// In a real app, you would use a proper authentication system
// This is a simplified mock implementation

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export async function login({ email, password }: LoginCredentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // console.log(data);
    return { success: true, user: data.user };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Login failed");
  }
}

export async function register({ name, email, password }: RegisterCredentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return { success: true, user: data.user };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Registration failed"
    );
  }
}

export async function logout() {
  (await cookies()).delete("auth-token");
  return { success: true };
}
