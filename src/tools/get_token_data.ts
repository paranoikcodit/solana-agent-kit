/* eslint-disable prettier/prettier */
import { PublicKey } from "@solana/web3.js";
import type { JupiterTokenData } from "../types";

export async function getTokenDataByAddress(
	mint: PublicKey,
): Promise<JupiterTokenData | undefined> {
	try {
		if (!mint) {
			throw new Error("Mint address is required");
		}

		const response = await fetch("https://tokens.jup.ag/tokens?tags=verified", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = (await response.json()) as JupiterTokenData[];
		const token = data.find((token: JupiterTokenData) => {
			return token.address === mint.toBase58();
		});
		return token;
	} catch (error) {
		throw new Error(
			`Error fetching token data: ${(error as { message: string }).message}`,
		);
	}
}

export async function getTokenAddressFromTicker(
	ticker: string,
): Promise<string | null> {
	try {
		const response = await fetch("https://tokens.jup.ag/tokens?tags=verified");
		const data: { symbol: string; address: string }[] = await response.json();

		return data.find((r) => r.symbol === ticker)?.address || null;
	} catch (error) {
		console.error("Error fetching token address from DexScreener:", error);
		return null;
	}
}

export async function getTokenDataByTicker(
	ticker: string,
): Promise<JupiterTokenData | undefined> {
	const address = await getTokenAddressFromTicker(ticker);
	if (!address) {
		throw new Error(`Token address not found for ticker: ${ticker}`);
	}
	return getTokenDataByAddress(new PublicKey(address));
}
