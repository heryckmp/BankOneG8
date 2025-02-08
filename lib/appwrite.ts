"use server";

import { Client, Account, Databases, Users } from "node-appwrite";
import { cookies } from "next/headers";

export async function createSessionClient() {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = cookies().get("appwrite-session");

    if (!session || !session.value) {
      throw new Error("No session found");
    }

    client.setSession(session.value);

    return {
      get account() {
        return new Account(client);
      },
    };
  } catch (error) {
    console.error('Session client error:', error);
    throw error;
  }
}

export async function createAdminClient() {
  try {
    if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) {
      throw new Error('Appwrite endpoint not configured');
    }
    if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT) {
      throw new Error('Appwrite project not configured');
    }
    if (!process.env.NEXT_APPWRITE_KEY) {
      throw new Error('Appwrite API key not configured');
    }

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT)
      .setKey(process.env.NEXT_APPWRITE_KEY);

    return {
      get account() {
        return new Account(client);
      },
      get database() {
        return new Databases(client);
      },
      get user() {
        return new Users(client);
      }
    };
  } catch (error) {
    console.error('Admin client error:', error);
    throw error;
  }
}

