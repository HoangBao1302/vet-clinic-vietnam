"use client";

import { useState, useEffect } from "react";

export default function AdminLicensesPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchProductId, setSearchProductId] = useState("");
  const [searchAccountNumber, setSearchAccountNumber] = useState("");

  useEffect(() => {
    loadLicenses();
  }, []);

  async function loadLicenses() {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/licenses/list");
      if (!response.ok) throw new Error("Failed to load licenses");
      const result = await response.json();
      setData(result.licenses || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchProductId) params.append("productId", searchProductId);
      if (searchAccountNumber) params.append("accountNumber", searchAccountNumber);
      
      const response = await fetch(`/api/admin/licenses/list?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to search licenses");
      const result = await response.json();
      setData(result.licenses || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(productId: string, accountNumber: number) {
    if (!confirm(`Xóa license ${productId} - Account ${accountNumber}?`)) return;
    
    try {
      const response = await fetch("/api/admin/licenses/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, accountNumber })
      });
      
      if (!response.ok) throw new Error("Failed to delete license");
      
      alert("License đã được xóa!");
      loadLicenses();
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    }
  }

  if (loading) {
    return (
      <main style={{ padding: 24, fontFamily: "ui-sans-serif,system-ui" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>License Admin</h1>
        <p>Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: 24, fontFamily: "ui-sans-serif,system-ui" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#dc2626" }}>License Admin - Error</h1>
        <div style={{ marginTop: 16, padding: 16, backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8 }}>
          <p style={{ color: "#dc2626", margin: 0 }}>
            <strong>Error:</strong> {error}
          </p>
          <button onClick={loadLicenses} style={{ marginTop: 12, padding: "8px 16px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: "ui-sans-serif,system-ui" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>License Admin</h1>

      <section style={{ marginTop: 16 }}>
        <form onSubmit={handleSearch}>
          <input 
            value={searchProductId}
            onChange={(e) => setSearchProductId(e.target.value)}
            placeholder="productId" 
            style={{ padding: 8, marginRight: 8 }} 
          />
          <input 
            value={searchAccountNumber}
            onChange={(e) => setSearchAccountNumber(e.target.value)}
            placeholder="accountNumber (optional)" 
            style={{ padding: 8, marginRight: 8 }} 
          />
          <button type="submit" style={{ padding: "8px 12px" }}>Search</button>
          <button type="button" onClick={loadLicenses} style={{ padding: "8px 12px", marginLeft: 8 }}>Reset</button>
        </form>
      </section>

      <section style={{ marginTop: 24, display: "grid", gap: 16 }}>
        <details open>
          <summary style={{ fontWeight: 600 }}>Create DEMO 60 ngày (1 account)</summary>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            try {
              const response = await fetch("/api/admin/licenses/create-demo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  productId: formData.get("productId"),
                  accountNumber: Number(formData.get("accountNumber")),
                  note: formData.get("note")
                })
              });
              if (!response.ok) throw new Error("Failed to create demo");
              alert("Demo license created!");
              loadLicenses();
              e.currentTarget.reset();
            } catch (err: any) {
              alert(`Error: ${err.message}`);
            }
          }} style={{ marginTop: 8 }}>
            <input name="productId" placeholder="productId" required style={{ padding: 8, marginRight: 8 }} />
            <input name="accountNumber" type="number" placeholder="accountNumber" required style={{ padding: 8, marginRight: 8 }} />
            <input name="note" placeholder="note (optional)" style={{ padding: 8, marginRight: 8 }} />
            <button style={{ padding: "8px 12px" }}>Create</button>
          </form>
        </details>

        <details>
          <summary style={{ fontWeight: 600, color: "#dc2626" }}>Delete (xóa hoàn toàn)</summary>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const productId = String(formData.get("productId"));
            const accountNumber = Number(formData.get("accountNumber"));
            await handleDelete(productId, accountNumber);
            e.currentTarget.reset();
          }} style={{ marginTop: 8 }}>
            <input name="productId" placeholder="productId" required style={{ padding: 8, marginRight: 8 }} />
            <input name="accountNumber" type="number" placeholder="accountNumber" required style={{ padding: 8, marginRight: 8 }} />
            <button style={{ padding: "8px 12px", backgroundColor: "#dc2626", color: "white", border: "none" }}>🗑️ Delete</button>
          </form>
        </details>

        <details>
          <summary style={{ fontWeight: 600, color: "#059669" }}>Test Verify License</summary>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            try {
              const params = new URLSearchParams({
                productId: String(formData.get("productId")),
                accountNumber: String(formData.get("accountNumber")),
                mode: String(formData.get("mode") || "REAL"),
                version: String(formData.get("version") || "1.0.0")
              });
              const response = await fetch(`/api/license/test-verify?${params.toString()}`);
              const result = await response.json();
              alert(`Verify Result:\n${JSON.stringify(result, null, 2)}`);
            } catch (err: any) {
              alert(`Error: ${err.message}`);
            }
          }} style={{ marginTop: 8 }}>
            <input name="productId" placeholder="productId" required style={{ padding: 8, marginRight: 8 }} />
            <input name="accountNumber" type="number" placeholder="accountNumber" required style={{ padding: 8, marginRight: 8 }} />
            <input name="mode" placeholder="REAL/DEMO/BOTH" defaultValue="REAL" style={{ padding: 8, marginRight: 8 }} />
            <input name="version" placeholder="version" defaultValue="1.0.0" style={{ padding: 8, marginRight: 8 }} />
            <button style={{ padding: "8px 12px", backgroundColor: "#059669", color: "white", border: "none" }}>✅ Verify</button>
          </form>
        </details>

        <details>
          <summary style={{ fontWeight: 600, color: "#2563eb" }}>Test Activate License</summary>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            try {
              const response = await fetch("/api/license/test-activate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  productId: formData.get("productId"),
                  accountNumber: formData.get("accountNumber") ? Number(formData.get("accountNumber")) : undefined,
                  accountNumbers: formData.get("accountNumbers"),
                  mode: formData.get("mode") || "BOTH",
                  plan: formData.get("plan") || "DEMO",
                  days: formData.get("days") ? Number(formData.get("days")) : undefined,
                  maxAccounts: formData.get("maxAccounts") ? Number(formData.get("maxAccounts")) : undefined,
                  note: formData.get("note")
                })
              });
              const result = await response.json();
              alert(`Activate Result:\n${JSON.stringify(result, null, 2)}`);
              loadLicenses();
            } catch (err: any) {
              alert(`Error: ${err.message}`);
            }
          }} style={{ marginTop: 8, display: "grid", gap: 8 }}>
            <input name="productId" placeholder="productId" required style={{ padding: 8 }} />
            <div style={{ display: "flex", gap: 8 }}>
              <input name="accountNumber" type="number" placeholder="accountNumber (single)" style={{ padding: 8 }} />
              <input name="accountNumbers" placeholder="accountNumbers (CSV: 123,456,789)" style={{ padding: 8 }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input name="mode" placeholder="BOTH/REAL/DEMO" defaultValue="BOTH" style={{ padding: 8 }} />
              <input name="plan" placeholder="DEMO/PAID/TRIAL" defaultValue="DEMO" style={{ padding: 8 }} />
              <input name="days" type="number" placeholder="days (default DEMO=60)" style={{ padding: 8 }} />
              <input name="maxAccounts" type="number" placeholder="max accounts" style={{ padding: 8 }} />
            </div>
            <input name="note" placeholder="note (optional)" style={{ padding: 8 }} />
            <button style={{ padding: "8px 12px", backgroundColor: "#2563eb", color: "white", border: "none" }}>🚀 Activate</button>
          </form>
        </details>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontWeight: 600 }}>Recent / Search Results ({data.length})</h2>
        <div style={{ marginTop: 12, border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f7f7f7" }}>
                <th style={{ textAlign: "left", padding: 8 }}>productId</th>
                <th style={{ textAlign: "left", padding: 8 }}>accounts</th>
                <th style={{ textAlign: "left", padding: 8 }}>mode</th>
                <th style={{ textAlign: "left", padding: 8 }}>plan</th>
                <th style={{ textAlign: "left", padding: 8 }}>active</th>
                <th style={{ textAlign: "left", padding: 8 }}>max</th>
                <th style={{ textAlign: "left", padding: 8 }}>start</th>
                <th style={{ textAlign: "left", padding: 8 }}>expire</th>
                <th style={{ textAlign: "left", padding: 8 }}>note</th>
                <th style={{ textAlign: "left", padding: 8 }}>actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((x: any) => {
                const accounts = (x.accountNumbers?.length ? x.accountNumbers : (x.accountNumber ? [x.accountNumber] : [])) as number[];
                const firstAccount = accounts[0] || x.accountNumber;
                return (
                  <tr key={x._id} style={{ borderTop: "1px solid #eee" }}>
                    <td style={{ padding: 8 }}>{x.productId}</td>
                    <td style={{ padding: 8 }}>{accounts.join(", ")}</td>
                    <td style={{ padding: 8 }}>{x.mode}</td>
                    <td style={{ padding: 8 }}>{x.plan}</td>
                    <td style={{ padding: 8 }}>{String(x.isActive)}</td>
                    <td style={{ padding: 8 }}>{x.maxAccounts ?? accounts.length}</td>
                    <td style={{ padding: 8 }}>{new Date(x.startAt).toLocaleString()}</td>
                    <td style={{ padding: 8 }}>{new Date(x.expireAt).toLocaleString()}</td>
                    <td style={{ padding: 8 }}>{x.note || ""}</td>
                    <td style={{ padding: 8 }}>
                      <button 
                        onClick={() => handleDelete(x.productId, firstAccount)}
                        style={{ 
                          padding: "4px 8px", 
                          backgroundColor: "#dc2626", 
                          color: "white", 
                          border: "none", 
                          borderRadius: "4px",
                          fontSize: "12px",
                          cursor: "pointer"
                        }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
