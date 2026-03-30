"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Save, X, ArrowLeft, Plus, Trash2 } from "lucide-react";

export default function CreateTradingAccountPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    platform: "",
    accountName: "",
    accountNumber: "",
    broker: "",
    verified: false,
    badge: "",
    badge_en: "",
    active: true,
    order: 999,
    stats: {
      gain: "",
      drawdown: "",
      winRate: "",
      profitFactor: "",
      tradingDays: ""
    },
    links: {
      profile: "",
      copyTrade: "",
      youtube: ""
    },
    description: "",
    description_en: "",
    highlights: [""],
    highlights_en: [""]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/trading-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Trading account created successfully!');
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

  const addHighlight = (lang: 'vi' | 'en') => {
    if (lang === 'vi') {
      setFormData({ ...formData, highlights: [...formData.highlights, ""] });
    } else {
      setFormData({ ...formData, highlights_en: [...formData.highlights_en, ""] });
    }
  };

  const removeHighlight = (index: number, lang: 'vi' | 'en') => {
    if (lang === 'vi') {
      const newHighlights = formData.highlights.filter((_, i) => i !== index);
      setFormData({ ...formData, highlights: newHighlights.length > 0 ? newHighlights : [""] });
    } else {
      const newHighlights = formData.highlights_en.filter((_, i) => i !== index);
      setFormData({ ...formData, highlights_en: newHighlights.length > 0 ? newHighlights : [""] });
    }
  };

  const updateHighlight = (index: number, value: string, lang: 'vi' | 'en') => {
    if (lang === 'vi') {
      const newHighlights = [...formData.highlights];
      newHighlights[index] = value;
      setFormData({ ...formData, highlights: newHighlights });
    } else {
      const newHighlights = [...formData.highlights_en];
      newHighlights[index] = value;
      setFormData({ ...formData, highlights_en: newHighlights });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <section className="py-12">
          <div className="container-custom max-w-6xl">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8">
                <button
                  onClick={() => router.push('/admin/content-dashboard')}
                  className="flex items-center gap-2 text-white hover:text-gray-200 mb-4"
                >
                  <ArrowLeft size={20} />
                  Back to Dashboard
                </button>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Plus size={32} />
                  Create New Trading Account
                </h1>
                <p className="text-green-100 mt-2">Add a new trading account with complete information</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                <div className="space-y-8">
                  {/* Basic Information */}
                  <div className="border-b pb-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Basic Information</h2>
                    <div className="space-y-4">
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="mql5-account-1"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Platform *
                          </label>
                          <input
                            type="text"
                            value={formData.platform}
                            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="MQL4, MQL5, Myfxbook, Tickmill Social"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Account Name *
                          </label>
                          <input
                            type="text"
                            value={formData.accountName}
                            onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="ThebenchmarkTrader Live #1"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="9029831"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Broker *
                          </label>
                          <input
                            type="text"
                            value={formData.broker}
                            onChange={(e) => setFormData({ ...formData, broker: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Tickmill"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Badge (Vietnamese)
                          </label>
                          <input
                            type="text"
                            value={formData.badge}
                            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Verified Real Account"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Badge (English)
                          </label>
                          <input
                            type="text"
                            value={formData.badge_en}
                            onChange={(e) => setFormData({ ...formData, badge_en: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Verified Real Account"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="border-b pb-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Trading Statistics</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Gain *
                        </label>
                        <input
                          type="text"
                          value={formData.stats.gain}
                          onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats, gain: e.target.value } })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="+4359%"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Drawdown *
                        </label>
                        <input
                          type="text"
                          value={formData.stats.drawdown}
                          onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats, drawdown: e.target.value } })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="28.5%"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Win Rate *
                        </label>
                        <input
                          type="text"
                          value={formData.stats.winRate}
                          onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats, winRate: e.target.value } })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="76.8%"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Profit Factor *
                        </label>
                        <input
                          type="text"
                          value={formData.stats.profitFactor}
                          onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats, profitFactor: e.target.value } })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="2.3"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Trading Days *
                        </label>
                        <input
                          type="text"
                          value={formData.stats.tradingDays}
                          onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats, tradingDays: e.target.value } })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="593 days"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="border-b pb-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Links</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Profile Link
                        </label>
                        <input
                          type="url"
                          value={formData.links.profile}
                          onChange={(e) => setFormData({ ...formData, links: { ...formData.links, profile: e.target.value } })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="https://www.mql5.com/en/signals/..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Copy Trade Link
                        </label>
                        <input
                          type="url"
                          value={formData.links.copyTrade}
                          onChange={(e) => setFormData({ ...formData, links: { ...formData.links, copyTrade: e.target.value } })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="https://..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          YouTube Link
                        </label>
                        <input
                          type="url"
                          value={formData.links.youtube}
                          onChange={(e) => setFormData({ ...formData, links: { ...formData.links, youtube: e.target.value } })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="https://www.youtube.com/..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="border-b pb-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Description</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Description (Vietnamese) *
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          required
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Tài khoản live đầu tiên chạy EA..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Description (English) *
                        </label>
                        <textarea
                          value={formData.description_en}
                          onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                          required
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="First live account running EA..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Highlights Vietnamese */}
                  <div className="border-b pb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-800">Highlights (Vietnamese)</h2>
                      <button
                        type="button"
                        onClick={() => addHighlight('vi')}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                      >
                        <Plus size={16} />
                        Add
                      </button>
                    </div>
                    <div className="space-y-3">
                      {formData.highlights.map((highlight, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={highlight}
                            onChange={(e) => updateHighlight(index, e.target.value, 'vi')}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="✅ Verified bởi MQL5.com"
                          />
                          {formData.highlights.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeHighlight(index, 'vi')}
                              className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Highlights English */}
                  <div className="border-b pb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-800">Highlights (English)</h2>
                      <button
                        type="button"
                        onClick={() => addHighlight('en')}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                      >
                        <Plus size={16} />
                        Add
                      </button>
                    </div>
                    <div className="space-y-3">
                      {formData.highlights_en.map((highlight, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={highlight}
                            onChange={(e) => updateHighlight(index, e.target.value, 'en')}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="✅ Verified by MQL5.com"
                          />
                          {formData.highlights_en.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeHighlight(index, 'en')}
                              className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Settings */}
                  <div>
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Settings</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Display Order
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.order}
                          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <p className="text-sm text-gray-500 mt-1">Lower number = higher position</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="verified"
                            checked={formData.verified}
                            onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                            className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
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
                            className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                          />
                          <label htmlFor="active" className="text-sm font-semibold text-gray-700">
                            Active (Show on website)
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                  >
                    <Save size={20} />
                    {saving ? 'Creating...' : 'Create Account'}
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
