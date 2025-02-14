"use server";

import { Client, Account, Databases, Users } from "node-appwrite";
import { cookies } from "next/headers";

export async function createSessionClient() {
  try {
    if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || !process.env.NEXT_PUBLIC_APPWRITE_PROJECT) {
      throw new Error('Appwrite configuration missing');
    }

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

    const cookieStore = cookies();
    const session = cookieStore.get("appwrite-session");

    if (!session?.value) {
      console.log('No session cookie found');
      return {
        get account() {
          return new Account(client);
        },
      };
    }

    try {
      client.setSession(session.value);
      
      // Teste a sessão
      const account = new Account(client);
      await account.get();

      return {
        get account() {
          return account;
        },
      };
    } catch (sessionError) {
      console.error('Invalid session:', sessionError);
      // Remove o cookie inválido
      cookieStore.delete("appwrite-session");
      
      return {
        get account() {
          return new Account(client);
        },
      };
    }
  } catch (error) {
    console.error('Session client error:', error);
    return {
      get account() {
        return new Account(new Client()
          .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
          .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
        );
      },
    };
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

