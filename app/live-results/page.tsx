import { dbConnect } from "@/lib/mongodb";
import TradingAccountModel from "@/lib/models/TradingAccount";
import { tradingAccounts as fallbackAccounts, type TradingAccount } from "@/data/tradingAccounts";
import LiveResultsClient from "./LiveResultsClient";

export const revalidate = 60;

async function getAccounts(): Promise<TradingAccount[]> {
  try {
    const conn = await dbConnect();
    if (conn) {
      const accounts = await TradingAccountModel.find({ active: true })
        .sort({ order: 1 })
        .lean();
      if (accounts.length > 0) {
        return JSON.parse(JSON.stringify(accounts));
      }
    }
  } catch (error) {
    console.error("Error loading trading accounts for live results:", error);
  }

  return fallbackAccounts
    .filter((account) => account.active)
    .sort((a, b) => a.order - b.order);
}

export default async function LiveResultsPage() {
  const accounts = await getAccounts();
  return <LiveResultsClient initialAccounts={accounts} />;
}
