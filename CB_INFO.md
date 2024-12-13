Config
https://x.com/MurrLincoln/status/1866894077800673430

All Coinbase trades and transfers automatically donate 1% of the transaction amount to charity. Currently, the charity addresses are hardcoded based on the network used for the transaction, with the current charity being supported as X.

The charity addresses for each network are as follows:

Base: 0x1234567890123456789012345678901234567890
Solana: pWvDXKu6CpbKKvKQkZvDA66hgsTB6X2AgFxksYogHLV
Ethereum: 0x750EF1D7a0b4Ab1c97B7A623D7917CcEb5ea779C
Arbitrum: 0x1234567890123456789012345678901234567890
Polygon: 0x1234567890123456789012345678901234567890
In the future, we aim to integrate with The Giving Block API to allow for dynamic and configurable donations, enabling support for a wider range of charitable organizations.

5. Coinbase Commerce Plugin (@eliza/plugin-coinbase)
Integrates Coinbase Commerce for payment and transaction management:

Actions:

CREATE_CHARGE - Create a payment charge using Coinbase Commerce
GET_ALL_CHARGES - Fetch all payment charges
GET_CHARGE_DETAILS - Retrieve details for a specific charge
Description: This plugin enables Eliza to interact with the Coinbase Commerce API to create and manage payment charges, providing seamless integration with cryptocurrency-based payment systems.

Coinbase Wallet Management
The plugin automatically handles wallet creation or uses an existing wallet if the required details are provided during the first run.

Wallet Generation on First Run If no wallet information is provided (COINBASE_GENERATED_WALLET_HEX_SEED and COINBASE_GENERATED_WALLET_ID), the plugin will:

Generate a new wallet using the Coinbase SDK.
Automatically export the wallet details (seed and walletId) and securely store them in runtime.character.settings.secrets or other configured storage.
Log the wallet’s default address for reference.
If the character file does not exist, the wallet details are saved to a characters/charactername-seed.txt file in the characters directory with a note indicating that the user must manually add these details to settings.secrets or the .env file.
Using an Existing Wallet If wallet information is available during the first run:

Provide COINBASE_GENERATED_WALLET_HEX_SEED and COINBASE_GENERATED_WALLET_ID via runtime.character.settings.secrets or environment variables.
The plugin will import the wallet and use it for processing mass payouts.
6. Coinbase MassPayments Plugin (@eliza/plugin-coinbase)
This plugin facilitates the processing of cryptocurrency mass payouts using the Coinbase SDK. It enables the creation and management of mass payouts to multiple wallet addresses, logging all transaction details to a CSV file for further analysis.

Actions:

SEND_MASS_PAYOUT Sends cryptocurrency mass payouts to multiple wallet addresses.
Inputs:
receivingAddresses (array of strings): Wallet addresses to receive funds.
transferAmount (number): Amount to send to each address (in smallest currency unit, e.g., Wei for ETH).
assetId (string): Cryptocurrency asset ID (e.g., ETH, BTC).
network (string): Blockchain network (e.g., base, sol, eth, arb, pol).
Outputs: Logs transaction results (success/failure) in a CSV file.
Example:
{
    "receivingAddresses": [
        "0xA0ba2ACB5846A54834173fB0DD9444F756810f06",
        "0xF14F2c49aa90BaFA223EE074C1C33b59891826bF"
    ],
    "transferAmount": 5000000000000000,
    "assetId": "ETH",
    "network": "eth"
}

Providers:

massPayoutProvider Retrieves details of past transactions from the generated CSV file.
Outputs: A list of transaction records including the following fields:
address: Recipient wallet address.
amount: Amount sent.
status: Transaction status (Success or Failed).
errorCode: Error code (if any).
transactionUrl: URL for transaction details (if available).
Description:

The Coinbase MassPayments plugin streamlines cryptocurrency distribution, ensuring efficient and scalable payouts to multiple recipients on supported blockchain networks.

Supported networks:

base (Base blockchain)
sol (Solana)
eth (Ethereum)
arb (Arbitrum)
pol (Polygon)
Setup and Configuration:

Configure the Plugin Add the plugin to your character's configuration:

import { coinbaseMassPaymentsPlugin } from "@eliza/plugin-coinbase-masspayments";

const character = {
    plugins: [coinbaseMassPaymentsPlugin],
};


Required Configurations Set the following environment variables or runtime settings:

COINBASE_API_KEY: API key for Coinbase SDK
COINBASE_PRIVATE_KEY: Private key for secure transactions
COINBASE_GENERATED_WALLET_HEX_SEED: Hexadecimal seed of the wallet (if using existing wallet)
COINBASE_GENERATED_WALLET_ID: Unique wallet ID (if using existing wallet)
Wallet Management:

The plugin handles wallet creation and management in two ways:

Automatic Wallet Creation When no wallet details are provided, the plugin will:

Generate a new wallet using the Coinbase SDK
Export and store the wallet details in runtime.character.settings.secrets
Save details to characters/charactername-seed.txt if character file doesn't exist
Log the wallet's default address
Using Existing Wallet When wallet information is available:

Provide the required wallet details via settings or environment variables
The plugin will import and use the existing wallet
Example Configuration:

// For automatic wallet generation
runtime.character.settings.secrets = {
    // Empty settings for first run
};

// For using existing wallet
runtime.character.settings.secrets = {
    COINBASE_GENERATED_WALLET_HEX_SEED:
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    COINBASE_GENERATED_WALLET_ID: "wallet-id-123",
};


Example Call

const response = await runtime.triggerAction("SEND_MASS_PAYOUT", {
    receivingAddresses: [
        "0xA0ba2ACB5846A54834173fB0DD9444F756810f06",
        "0xF14F2c49aa90BaFA223EE074C1C33b59891826bF",
    ],
    transferAmount: 5000000000000000, // 0.005 ETH
    assetId: "ETH",
    network: "eth",
});
console.log("Mass payout response:", response);

Transaction Logging

All transactions (successful and failed) are logged to a transactions.csv file in the plugin’s working directory:

Address,Amount,Status,Error Code,Transaction URL
0xA0ba2ACB5846A54834173fB0DD9444F756810f06,5000000000000000,Success,,https://etherscan.io/tx/0x...


Example Output:

When successful, a response similar to the following will be returned:

{
    "text": "Mass payouts completed successfully.\n- Successful Transactions: 2\n- Failed Transactions: 0\nCheck the CSV file for more details."
}


Best Practices:

Secure Secrets Storage: Ensure COINBASE_API_KEY and COINBASE_PRIVATE_KEY are stored securely in runtime.character.settings.secrets or environment variables. Either add COINBASE_GENERATED_WALLET_HEX_SEED, and COINBASE_GENERATED_WALLET_ID from a previous run, or it will be dynamically created
Validation: Always validate input parameters, especially receivingAddresses and network, to ensure compliance with expected formats and supported networks.
Error Handling: Monitor logs for failed transactions or errors in the payout process and adjust retry logic as needed.
8. Coinbase Token Contract Plugin (@eliza/plugin-coinbase)
This plugin enables the deployment and interaction with various token contracts (ERC20, ERC721, ERC1155) using the Coinbase SDK. It provides functionality for both deploying new token contracts and interacting with existing ones.

Actions:

DEPLOY_TOKEN_CONTRACT Deploys a new token contract (ERC20, ERC721, or ERC1155).

Inputs:
contractType (string): Type of contract to deploy (ERC20, ERC721, or ERC1155)
name (string): Name of the token
symbol (string): Symbol of the token
network (string): Blockchain network to deploy on
baseURI (string, optional): Base URI for token metadata (required for ERC721 and ERC1155)
totalSupply (number, optional): Total supply of tokens (only for ERC20)
Example:
{
    "contractType": "ERC20",
    "name": "MyToken",
    "symbol": "MTK",
    "network": "base",
    "totalSupply": 1000000
}

INVOKE_CONTRACT Invokes a method on a deployed smart contract.

Inputs:
contractAddress (string): Address of the contract to invoke
method (string): Method name to invoke
abi (array): Contract ABI
args (object, optional): Arguments for the method
amount (number, optional): Amount of asset to send (for payable methods)
assetId (string, optional): Asset ID to send
network (string): Blockchain network to use
Example:
{
  "contractAddress": "0x123...",
  "method": "transfer",
  "abi": [...],
  "args": {
    "to": "0x456...",
    "amount": "1000000000000000000"
  },
  "network": "base"
}

Description:

The Coinbase Token Contract plugin simplifies the process of deploying and interacting with various token contracts on supported blockchain networks. It supports:

ERC20 token deployment with customizable supply
ERC721 (NFT) deployment with metadata URI support
ERC1155 (Multi-token) deployment with metadata URI support
Contract method invocation for deployed contracts
All contract deployments and interactions are logged to a CSV file for record-keeping and auditing purposes.

Usage Instructions:

Configure the Plugin Add the plugin to your character's configuration:

import { tokenContractPlugin } from "@eliza/plugin-coinbase";

const character = {
    plugins: [tokenContractPlugin],
};

Required Configurations Ensure the following environment variables or runtime settings are configured:

COINBASE_API_KEY: API key for Coinbase SDK
COINBASE_PRIVATE_KEY: Private key for secure transactions
Wallet configuration (same as MassPayments plugin)
Example Deployments:

ERC20 Token

const response = await runtime.triggerAction("DEPLOY_TOKEN_CONTRACT", {
    contractType: "ERC20",
    name: "MyToken",
    symbol: "MTK",
    network: "base",
    totalSupply: 1000000,
});


NFT Collection

const response = await runtime.triggerAction("DEPLOY_TOKEN_CONTRACT", {
    contractType: "ERC721",
    name: "MyNFT",
    symbol: "MNFT",
    network: "eth",
    baseURI: "https://api.mynft.com/metadata/",
});


Multi-token Collection

const response = await runtime.triggerAction("DEPLOY_TOKEN_CONTRACT", {
    contractType: "ERC1155",
    name: "MyMultiToken",
    symbol: "MMT",
    network: "pol",
    baseURI: "https://api.mymultitoken.com/metadata/",
});


Contract Interaction Example:

const response = await runtime.triggerAction("INVOKE_CONTRACT", {
  contractAddress: "0x123...",
  method: "transfer",
  abi: [...],
  args: {
    to: "0x456...",
    amount: "1000000000000000000"
  },
  network: "base"
});

Best Practices:

Always verify contract parameters before deployment
Store contract addresses and deployment details securely
Test contract interactions on testnets before mainnet deployment
Keep track of deployed contracts using the generated CSV logs
Ensure proper error handling for failed deployments or interactions
