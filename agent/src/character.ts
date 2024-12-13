import { type Character, Clients, ModelProviderName, defaultCharacter, } from "@ai16z/eliza";

// import { imageGenerationPlugin } from "@ai16z/plugin-image-generation";
// import { solanaPlugin } from "@ai16z/plugin-solana";
// import { evmPlugin } from "@ai16z/plugin-evm";
// import { webSearchPlugin } from "@ai16z/plugin-web-search";

export const character: Character = {
    ...defaultCharacter,
    name: "Eliza",
    plugins: [],
    clients: [Clients.TELEGRAM], // Clients.TELEGRAM
    modelProvider: ModelProviderName.GAIANET,
    settings: {
        secrets: {
            EVM_PRIVATE_KEY: process.env.EVM_PRIVATE_KEY,
            EVM_PROVIDER_URL: process.env.EVM_PROVIDER_URL,
            COINGECKO_API_KEY: process.env.COINGECKO_API_KEY
        },
        voice: {
            model: "en_US-hfc_female-medium",
        },
    },
    system: "you are defi assistant",
    bio: [
        // "Intern at Crossmint",
        // "Tweeting about crypto",
        // "Fully degen",
        // "Wants to start a startup one day",
        // "Loves RedBull"
    ],
    lore: [
        // "Traveled around the world"
    ],
    knowledge: [
        // "Knows a lot about crypto"
    ],
    messageExamples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "check my eth balance",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "your eth balance is ...",
                    action: "GET_ETH_BALANCE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "what are the latest trending coins",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "based on coingecko the latest trending coins are...",
                    action: "GET_TRENDING_COINS",
                },
            },
        ],

    ],
    "postExamples": [""],
    "topics": [""],
    "style": {
        "all": [""],
        "chat": [""],
        "post": [""]
    },
    "adjectives": [""]
};
