import { dbConnect } from "@/lib/mongodb";
import TradingAccountModel from "@/lib/models/TradingAccount";
import { tradingAccounts as fallbackAccounts, withVerifiedAccountCopy, type TradingAccount } from "@/data/tradingAccounts";
import type { Metadata } from "next";
import LiveResultsClient from "./LiveResultsClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Xác Minh Hiệu Suất EA - ThebenchmarkTrader",
  description:
    "Các tài khoản dưới đây chạy phần mềm EA ThebenchmarkTrader trên tài khoản giao dịch thực tế. Kết quả được xác minh độc lập trên MQL5.com.",
};

async function getAccounts(): Promise<TradingAccount[]> {
  try {
    const conn = await dbConnect();
    if (conn) {
      const accounts = await TradingAccountModel.find({ active: true })
        .sort({ order: 1 })
        .lean();
      if (accounts.length > 0) {
        return withVerifiedAccountCopy(JSON.parse(JSON.stringify(accounts)));
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
