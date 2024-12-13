import type { Plugin } from "@ai16z/eliza";
import { sendETH } from "@goat-sdk/core";
import { coingecko } from "@goat-sdk/plugin-coingecko";
import { USDC, erc20 } from "@goat-sdk/plugin-erc20";
import { watcher } from "goat-plugin-creatorhub";
import { getOnChainActions } from "./actions";
import { getWalletClient, getWalletProvider } from "./wallet";

async function createGoatPlugin(
    getSetting: (key: string) => string | undefined
): Promise<Plugin> {
    const walletClient = getWalletClient(getSetting);

        const COINGECKO_API_KEY = getSetting("COINGECKO_API_KEY");
    if (!COINGECKO_API_KEY) return null;
    const actions = await getOnChainActions({
        wallet: walletClient,
        // Add plugins here based on what actions you want to use
        // See all available plugins at https://ohmygoat.dev/chains-wallets-plugins#plugins
        plugins: [
            sendETH(),
            erc20({ tokens: [USDC] }),
            			coingecko({ apiKey: process.env.COINGECKO_API_KEY as string }),
                        watcher({apiKey: "apiKey"})

        ],
    });

    return {
        name: "[GOAT] Onchain Actions",
        description: "Base integration plugin",
        providers: [getWalletProvider(walletClient)],
        evaluators: [],
        services: [],
        actions: actions,
    };
}

export default createGoatPlugin;
