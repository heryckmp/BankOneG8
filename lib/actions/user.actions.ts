'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";

import { plaidClient } from '@/lib/plaid';
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";
import { Client, Account } from "node-appwrite";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    console.log('Getting user info for userId:', userId);
    const { database } = await createAdminClient();

    const userDocs = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    );

    console.log('Found documents:', userDocs.total);

    if (userDocs.total === 0) {
      throw new Error(`No user document found for userId: ${userId}`);
    }

    return parseStringify(userDocs.documents[0]);
  } catch (error: any) {
    console.error('getUserInfo error:', {
      message: error.message,
      code: error.code,
      type: error.type,
      response: error.response,
      userId
    });
    throw error;
  }
}

export const signIn = async ({ email, password }: signInProps) => {
  try {
    console.log('Attempting to sign in with email:', email);
    const client = new Client()
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);
    
    const account = new Account(client);
    
    // Try to create session
    console.log('Creating email password session...');
    try {
      const session = await account.createEmailPasswordSession(email, password);
      console.log('Session created successfully for userId:', session.userId);

      // Set session cookie with more permissive settings for development
      cookies().set("appwrite-session", session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      // Get user info
      console.log('Getting user info...');
      const user = await getUserInfo({ userId: session.userId });
      if (!user) {
        throw new Error('User document not found in database');
      }
      console.log('User info retrieved successfully');
      return parseStringify(user);
    } catch (sessionError: any) {
      console.error('Session creation error:', {
        message: sessionError.message,
        code: sessionError.code,
        type: sessionError.type,
        response: sessionError.response,
        stack: sessionError.stack
      });
      throw sessionError;
    }
  } catch (error: any) {
    console.error('Auth error details:', {
      message: error.message,
      code: error.code,
      type: error.type,
      response: error.response,
      stack: error.stack
    });

    // Handle specific Appwrite error codes
    if (error.code === 401) {
      throw new Error('Invalid email or password. Please try again.');
    } else if (error.code === 429) {
      throw new Error('Too many attempts. Please try again later.');
    } else {
      throw new Error(error.message || 'Something went wrong. Please try again.');
    }
  }
}

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { 
    email, 
    firstName, 
    lastName,
    address1,
    city,
    state,
    postalCode,
    dateOfBirth,
    ssn
  } = userData;
  
  let newUserAccount;

  try {
    console.log('Creating admin client...');
    const { account, database } = await createAdminClient();

    console.log('Creating user account...');
    newUserAccount = await account.create(
      ID.unique(), 
      email, 
      password, 
      `${firstName} ${lastName}`
    );

    if(!newUserAccount) {
      console.error('Failed to create user account');
      throw new Error('Error creating user account')
    }

    console.log('Creating user document...');
    const dwollaCustomerUrl = await createDwollaCustomer({
      firstName,
      lastName,
      email,
      address1,
      city,
      state,
      postalCode,
      dateOfBirth,
      ssn,
      type: 'personal'
    });

    if (!dwollaCustomerUrl) {
      throw new Error('Failed to create Dwolla customer');
    }

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        userId: newUserAccount.$id,
        firstName,
        lastName,
        email,
        address1,
        city,
        state,
        postalCode,
        dateOfBirth,
        ssn,
        dwollaCustomerId,
        dwollaCustomerUrl
      }
    )

    console.log('Creating session...');
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    console.log('Sign up completed successfully');
    return parseStringify(newUser);
  } catch (error: any) {
    console.error('Sign up error:', {
      message: error.message,
      code: error.code,
      type: error.type,
      response: error.response
    });
    throw error;
  }
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    try {
      const user = await getUserInfo({ userId: result.$id });
      return parseStringify(user);
    } catch (error: any) {
      // If the error indicates that the user document is not found, create a new one
      if (error.message && error.message.includes('No user document found')) {
        // Use result.name if available to split into firstName and lastName
        const fullName = result.name || '';
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0] || 'User';
        const lastName = nameParts.slice(1).join(' ') || '';

        const newUser = await createUserDocument({
          userId: result.$id,
          email: result.email,
          firstName,
          lastName
          // Other fields will use default empty strings
        });
        return parseStringify(newUser);
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();

    cookies().delete('appwrite-session');

    await account.deleteSession('current');
  } catch (error) {
    return null;
  }
}

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ['auth'] as Products[],
      language: 'en',
      country_codes: ['US'] as CountryCode[],
    }

    const response = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({ linkToken: response.data.link_token })
  } catch (error) {
    console.log(error);
  }
}

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient();

    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      }
    )

    return parseStringify(bankAccount);
  } catch (error) {
    console.log(error);
  }
}

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    
    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

     // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
     const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });
    
    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) throw Error;

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareableId ID
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.error("An error occurred while creating exchanging token:", error);
  }
}

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    const { database } = await createAdminClient();

    const banks = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    )

    return parseStringify(banks.documents);
  } catch (error) {
    console.log(error)
  }
}

export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('$id', [documentId])]
    )

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error)
  }
}

export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('accountId', [accountId])]
    )

    if(bank.total !== 1) return null;

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error)
  }
}

export const deleteAllUsers = async () => {
  try {
    const { user: userClient, database } = await createAdminClient();
    
    // List all users
    const users = await userClient.list();
    
    // Delete each user and their associated documents
    for (const user of users.users) {
      try {
        // Delete user documents from database
        const userDocs = await database.listDocuments(
          DATABASE_ID!,
          USER_COLLECTION_ID!,
          [Query.equal('userId', [user.$id])]
        );

        for (const doc of userDocs.documents) {
          await database.deleteDocument(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            doc.$id
          );
        }

        // Delete the user account
        await userClient.delete(user.$id);
        console.log(`Deleted user: ${user.email}`);
      } catch (error) {
        console.error(`Error deleting user ${user.email}:`, error);
      }
    }

    return { success: true, message: 'All users deleted successfully' };
  } catch (error) {
    console.error('Error deleting users:', error);
    return { success: false, message: 'Failed to delete users' };
  }
}

export const createUserDocument = async ({
  userId,
  email,
  firstName = "User",
  lastName = "",
  address1 = "",
  city = "",
  state = "",
  postalCode = "",
  dateOfBirth = "",
  ssn = "",
  dwollaCustomerId = "temp-disabled",
  dwollaCustomerUrl = "temp-disabled"
}: {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  address1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  dateOfBirth?: string;
  ssn?: string;
  dwollaCustomerId?: string;
  dwollaCustomerUrl?: string;
}) => {
  try {
    console.log('Creating user document for userId:', userId);
    const { database } = await createAdminClient();

    // Ensure all required fields are present and match Appwrite collection structure
    const documentData = {
      userId,          // string
      email,          // email type
      firstName,      // string
      lastName,       // string
      address1,       // string
      city,          // string
      state,         // string
      postalCode,    // string
      dateOfBirth,   // string
      ssn,           // string
      dwollaCustomerId,  // string
      dwollaCustomerUrl  // string
    };

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      documentData
    );

    console.log('User document created successfully');
    return parseStringify(newUser);
  } catch (error: any) {
    console.error('Error creating user document:', error);
    throw error;
  }
}