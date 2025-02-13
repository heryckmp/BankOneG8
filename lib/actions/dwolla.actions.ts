"use server";

import { Client } from "dwolla-v2";

const getEnvironment = (): "production" | "sandbox" => {
  const environment = process.env.DWOLLA_ENV as string;

  switch (environment) {
    case "sandbox":
      return "sandbox";
    case "production":
      return "production";
    default:
      throw new Error(
        "Dwolla environment should either be set to `sandbox` or `production`"
      );
  }
};

const dwollaClient = new Client({
  environment: getEnvironment(),
  key: process.env.DWOLLA_KEY as string,
  secret: process.env.DWOLLA_SECRET as string,
});

// Create a Dwolla Funding Source using a Plaid Processor Token
export const createFundingSource = async (
  options: CreateFundingSourceOptions
) => {
  try {
    return await dwollaClient
      .post(`customers/${options.customerId}/funding-sources`, {
        name: options.fundingSourceName,
        plaidToken: options.plaidToken,
      })
      .then((res) => res.headers.get("location"));
  } catch (err) {
    console.error("Creating a Funding Source Failed: ", err);
  }
};

export const createOnDemandAuthorization = async () => {
  try {
    const onDemandAuthorization = await dwollaClient.post(
      "on-demand-authorizations"
    );
    const authLink = onDemandAuthorization.body._links;
    return authLink;
  } catch (err) {
    console.error("Creating an On Demand Authorization Failed: ", err);
  }
};

export const createDwollaCustomer = async (
  newCustomer: NewDwollaCustomerParams
) => {
  try {
    // Ensure state is uppercase and exactly 2 characters
    const formattedCustomer = {
      ...newCustomer,
      state: newCustomer.state.trim().toUpperCase()
    };

    console.log('Attempting to create Dwolla customer with data:', {
      ...formattedCustomer,
      ssn: '****' // Mask sensitive data in logs
    });
    
    // Validate state format
    if (!/^[A-Z]{2}$/.test(formattedCustomer.state)) {
      throw new Error(`Invalid state format: ${formattedCustomer.state}. Must be a 2-letter abbreviation.`);
    }
    
    const response = await dwollaClient.post("customers", formattedCustomer);
    console.log('Dwolla API Response Status:', response.status);
    console.log('Dwolla API Response Headers:', response.headers);
    
    const location = response.headers.get('location');
    if (!location) {
      // Try to get more details from the response
      const resBody = await (response as any).text();
      console.error('Dwolla API Response Body:', resBody);
      console.error('Dwolla API Response Headers:', response.headers);
      throw new Error('Failed to create Dwolla customer: No location header in response');
    }
    return location;
  } catch (err: any) {
    console.error("Creating a Dwolla Customer Failed. Details:", {
      error: err.message,
      code: err.code,
      status: err?.status,
      response: err?.response,
      stack: err?.stack,
      customerData: {
        ...newCustomer,
        ssn: '****' // Mask sensitive data in logs
      }
    });
    throw err;
  }
};

export const createTransfer = async ({
  sourceFundingSourceUrl,
  destinationFundingSourceUrl,
  amount,
}: TransferParams) => {
  try {
    const requestBody = {
      _links: {
        source: {
          href: sourceFundingSourceUrl,
        },
        destination: {
          href: destinationFundingSourceUrl,
        },
      },
      amount: {
        currency: "USD",
        value: amount,
      },
    };
    return await dwollaClient
      .post("transfers", requestBody)
      .then((res) => res.headers.get("location"));
  } catch (err) {
    console.error("Transfer fund failed: ", err);
  }
};

export const addFundingSource = async ({
  dwollaCustomerId,
  processorToken,
  bankName,
}: AddFundingSourceParams) => {
  try {
    // create dwolla auth link
    const dwollaAuthLinks = await createOnDemandAuthorization();

    // add funding source to the dwolla customer & get the funding source url
    const fundingSourceOptions = {
      customerId: dwollaCustomerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
      _links: dwollaAuthLinks,
    };
    return await createFundingSource(fundingSourceOptions);
  } catch (err) {
    console.error("Transfer fund failed: ", err);
  }
};
