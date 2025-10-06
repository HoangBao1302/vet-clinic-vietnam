"use client";

import { ExternalLink, TrendingUp, CheckCircle, Youtube } from "lucide-react";
import Link from "next/link";

const featuredAccounts = [
  {
    name: "ThebenchmarkTrader Live #1",
    platform: "MQL5",
    broker: "Tickmill",
    gain: "+186%",
    drawdown: "12.5%",
    days: "180",
    link: "https://www.mql5.com/en/signals/YOUR_SIGNAL_ID"
  },
  {
    name: "EA ThebenchmarkTrader Pro",
    platform: "Myfxbook",
    broker: "Tickmill",
    gain: "+215%",
    drawdown: "14.2%",
    days: "240",
    link: "https://www.myfxbook.com/members/YOUR_USERNAME/YOUR_ACCOUNT_ID"
  },
  {
    name: "ThebenchmarkTrader Strategy",
    platform: "Tickmill Social",
    broker: "Tickmill",
    gain: "+168%",
    drawdown: "11.3%",
    days: "165",
    link: "https://www.tickmill.com/social-trading/YOUR_STRATEGY_ID",
    copyable: true
  }
];

export default function LiveResults() {
  return (
    <section id="live-results" className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
            <CheckCircle size={16} />
            <span>100% Verified Real Accounts</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Kết Quả Giao Dịch Thực Tế
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Không phải backtest. Không phải demo. Đây là tài khoản real money, 
            verified và tracking 24/7 trên các platform uy tín.
          </p>
        </div>

        {/* Featured Accounts Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {featuredAccounts.map((account, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{account.name}</h3>
                    <div className="text-sm opacity-90">
                      {account.platform} • {account.broker}
                    </div>
                  </div>
                  {account.copyable && (
                    <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">
                      Copy ✓
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle size={14} />
                  <span>Verified Account</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{account.gain}</div>
                    <div className="text-xs text-gray-600">Gain</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{account.drawdown}</div>
                    <div className="text-xs text-gray-600">DD</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700">{account.days}</div>
                    <div className="text-xs text-gray-600">Days</div>
                  </div>
                </div>

                {/* Action Button */}
                <a
                  href={account.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink size={18} />
                  <span>Xem Live Stats</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info & CTA */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                5+ Tài Khoản Verified
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Xem tất cả tài khoản live với stats chi tiết, equity curve, 
                và lịch sử giao dịch đầy đủ. Cả mua EA hoặc copy trading đều có sẵn.
              </p>
              <ul className="space-y-2 text-sm text-gray-700 mb-6">
                <li className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-green-600" />
                  <span>Track record từ 120-240 ngày</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-blue-600" />
                  <span>Verified bởi MQL5, Myfxbook, brokers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Youtube size={16} className="text-red-600" />
                  <span>Video hướng dẫn copy trading</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <Link
                href="/live-results"
                className="block text-center px-6 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Xem Tất Cả Kết Quả Thực Tế →
              </Link>
              <Link
                href="/pricing"
                className="block text-center px-6 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Hoặc Mua EA Ngay
              </Link>
              <p className="text-xs text-center text-gray-500">
                ⚠️ Kết quả quá khứ không đảm bảo kết quả tương lai
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

