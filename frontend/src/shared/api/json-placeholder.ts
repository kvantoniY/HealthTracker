
import { User } from "@/entities/user/model/types";

const BASE_URL = "http://localhost:4000";

export async function authLogin(identifier: string, password: string): Promise<{ token: string; user: User }> {
  const res = await fetch(`${BASE_URL}/api/auth/local`, {
    method: "POST",               
    headers: {
      "Content-Type": "application/json",  
    },
    body: JSON.stringify({        
      identifier,                 
      password,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Failed to login");
  }

  const data = await res.json();
  return data; // возвращает { jwt: string, user: { id, username, email, ... } }
}