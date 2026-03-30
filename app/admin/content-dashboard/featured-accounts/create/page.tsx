"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Save, X, ArrowLeft, Plus } from "lucide-react";

export default function CreateFeaturedAccountPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    broker: "",
    accountNumber: "",
    startBalance: "",
    currentBalance: "",
    totalProfit: "",
    gain: "",
    monthlyReturn: "",
    maxDrawdown: "",
    verified: false,
    year: new Date().getFullYear(),
    active: true,
    order: 999
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/featured-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Featured account created successfully!');
        router.push('/admin/content-dashboard');
      } else {
        const data = await response.json();
        alert(`Error: ${data.error || 'Failed to create account'}`);
      }
    } catch (error) {
      console.error('Error creating account:', error);
      alert('Error creating account');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <section className="py-12">
          <div className="container-custom max-w-4xl">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-8">
                <button
                  onClick={() => router.push('/admin/content-dashboard')}
                  className="flex items-center gap-2 text-white hover:text-gray-200 mb-4"
                >
                  <ArrowLeft size={20} />
                  Back to Dashboard
                </button>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Plus size={32} />
                  Create New Featured Account
                </h1>
                <p className="text-yellow-100 mt-2">Add a new featured result</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Account ID * (unique, lowercase, no spaces)
                    </label>
                    <input
                      type="text"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                      required
                      pattern="[a-z0-9-]+"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="e.g. featured-2024-1"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Broker *
                      </label>
                      <input
                        type="text"
                        value={formData.broker}
                        onChange={(e) => setFormData({ ...formData, broker: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Start Balance
                      </label>
                      <input
                        type="text"
                        value={formData.startBalance}
                        onChange={(e) => setFormData({ ...formData, startBalance: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="$5,000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Balance
                      </label>
                      <input
                        type="text"
                        value={formData.currentBalance}
                        onChange={(e) => setFormData({ ...formData, currentBalance: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="$17,250"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Total Profit
                      </label>
                      <input
                        type="text"
                        value={formData.totalProfit}
                        onChange={(e) => setFormData({ ...formData, totalProfit: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="$12,250"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gain
                      </label>
                      <input
                        type="text"
                        value={formData.gain}
                        onChange={(e) => setFormData({ ...formData, gain: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="+245%"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Monthly Return
                      </label>
                      <input
                        type="text"
                        value={formData.monthlyReturn}
                        onChange={(e) => setFormData({ ...formData, monthlyReturn: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="+18%"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Max Drawdown
                      </label>
                      <input
                        type="text"
                        value={formData.maxDrawdown}
                        onChange={(e) => setFormData({ ...formData, maxDrawdown: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="8.5%"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Year *
                      </label>
                      <input
                        type="number"
                        min="2020"
                        max="2030"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Display Order
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="verified"
                        checked={formData.verified}
                        onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                        className="w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500"
                      />
                      <label htmlFor="verified" className="text-sm font-semibold text-gray-700">
                        Verified Account
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="active"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500"
                      />
                      <label htmlFor="active" className="text-sm font-semibold text-gray-700">
                        Active (Show on website)
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 disabled:opacity-50"
                  >
                    <Save size={20} />
                    {saving ? 'Creating...' : 'Create Featured Account'}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/admin/content-dashboard')}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
                  >
                    <X size={20} />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
