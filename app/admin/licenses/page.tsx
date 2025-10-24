import { listRecentLicenses, searchLicenses, createDemo, revokeLicense, extendLicense, createLicenseMulti, deleteLicense, testVerifyLicense, testActivateLicense } from "../admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminLicensesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const resolvedSearchParams = await searchParams;
  const productId = (resolvedSearchParams.productId || "").toString();
  const accountNumber = resolvedSearchParams.accountNumber ? Number(resolvedSearchParams.accountNumber) : undefined;

  const data = productId || accountNumber
    ? await searchLicenses(productId, accountNumber)
    : await listRecentLicenses();

  async function createDemoAction(formData: FormData) {
    "use server";
    const productId = String(formData.get("productId") || "");
    const accountNumber = Number(formData.get("accountNumber") || 0);
    const note = String(formData.get("note") || "");
    await createDemo(productId, accountNumber, note);
  }

  async function createMultiAction(formData: FormData) {
    "use server";
    await createLicenseMulti({
      productId: String(formData.get("productId") || ""),
      accountsCSV: String(formData.get("accountsCSV") || ""),
      plan: String(formData.get("plan") || "DEMO"),
      mode: String(formData.get("mode") || "BOTH"),
      days: formData.get("days") ? Number(formData.get("days")) : undefined,
      maxAccounts: formData.get("maxAccounts") ? Number(formData.get("maxAccounts")) : undefined,
      note: String(formData.get("note") || "")
    });
  }

  async function revokeAction(formData: FormData) {
    "use server";
    await revokeLicense(
      String(formData.get("productId") || ""),
      Number(formData.get("accountNumber") || 0),
      String(formData.get("note") || "")
    );
  }

  async function extendAction(formData: FormData) {
    "use server";
    await extendLicense(
      String(formData.get("productId") || ""),
      Number(formData.get("accountNumber") || 0),
      Number(formData.get("days") || 30),
      String(formData.get("note") || "")
    );
  }

  async function deleteAction(formData: FormData) {
    "use server";
    await deleteLicense(
      String(formData.get("productId") || ""),
      Number(formData.get("accountNumber") || 0),
      String(formData.get("note") || "")
    );
  }

  async function verifyAction(formData: FormData) {
    "use server";
    const result = await testVerifyLicense(
      String(formData.get("productId") || ""),
      Number(formData.get("accountNumber") || 0),
      String(formData.get("mode") || "REAL"),
      String(formData.get("version") || "1.0.0")
    );
    console.log("Verify result:", result);
  }

  async function activateTestAction(formData: FormData) {
    "use server";
    const result = await testActivateLicense({
      productId: String(formData.get("productId") || ""),
      accountNumber: formData.get("accountNumber") ? Number(formData.get("accountNumber")) : undefined,
      accountNumbers: String(formData.get("accountNumbers") || ""),
      mode: String(formData.get("mode") || "BOTH"),
      plan: String(formData.get("plan") || "DEMO"),
      days: formData.get("days") ? Number(formData.get("days")) : undefined,
      maxAccounts: formData.get("maxAccounts") ? Number(formData.get("maxAccounts")) : undefined,
      note: String(formData.get("note") || "")
    });
    console.log("Activate result:", result);
  }

  return (
    <main style={{ padding: 24, fontFamily: "ui-sans-serif,system-ui" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>License Admin</h1>

      <section style={{ marginTop: 16 }}>
        <form>
          <input name="productId" placeholder="productId" defaultValue={productId} style={{ padding: 8, marginRight: 8 }} />
          <input name="accountNumber" placeholder="accountNumber (optional)" defaultValue={accountNumber || ""} style={{ padding: 8, marginRight: 8 }} />
          <button formAction="/admin/licenses" style={{ padding: "8px 12px" }}>Search</button>
        </form>
      </section>

      <section style={{ marginTop: 24, display: "grid", gap: 16 }}>
        <details open>
          <summary style={{ fontWeight: 600 }}>Create DEMO 60 ngày (1 account)</summary>
          <form action={createDemoAction} style={{ marginTop: 8 }}>
            <input name="productId" placeholder="productId" required style={{ padding: 8, marginRight: 8 }} />
            <input name="accountNumber" type="number" placeholder="accountNumber" required style={{ padding: 8, marginRight: 8 }} />
            <input name="note" placeholder="note (optional)" style={{ padding: 8, marginRight: 8 }} />
            <button style={{ padding: "8px 12px" }}>Create</button>
          </form>
        </details>

        <details>
          <summary style={{ fontWeight: 600 }}>Create license N account</summary>
          <form action={createMultiAction} style={{ marginTop: 8, display: "grid", gap: 8 }}>
            <input name="productId" placeholder="productId" required style={{ padding: 8 }} />
            <textarea name="accountsCSV" required placeholder="Danh sách account, ví dụ: 1234567,1234568,1234569" rows={3} style={{ padding: 8 }} />
            <div style={{ display: "flex", gap: 8 }}>
              <input name="plan" placeholder="DEMO/PAID/TRIAL" defaultValue="DEMO" style={{ padding: 8 }} />
              <input name="mode" placeholder="BOTH/REAL/DEMO" defaultValue="BOTH" style={{ padding: 8 }} />
              <input name="days" type="number" placeholder="days (ví dụ DEMO 60)" style={{ padding: 8 }} />
              <input name="maxAccounts" type="number" placeholder="max accounts (vd 3/10)" style={{ padding: 8 }} />
            </div>
            <input name="note" placeholder="note (optional)" style={{ padding: 8 }} />
            <button style={{ padding: "8px 12px" }}>Create</button>
          </form>
        </details>

        <details>
          <summary style={{ fontWeight: 600 }}>Revoke (khóa)</summary>
          <form action={revokeAction} style={{ marginTop: 8 }}>
            <input name="productId" placeholder="productId" required style={{ padding: 8, marginRight: 8 }} />
            <input name="accountNumber" type="number" placeholder="accountNumber" required style={{ padding: 8, marginRight: 8 }} />
            <input name="note" placeholder="note (optional)" style={{ padding: 8, marginRight: 8 }} />
            <button style={{ padding: "8px 12px" }}>Revoke</button>
          </form>
        </details>

        <details>
          <summary style={{ fontWeight: 600 }}>Extend (gia hạn)</summary>
          <form action={extendAction} style={{ marginTop: 8 }}>
            <input name="productId" placeholder="productId" required style={{ padding: 8, marginRight: 8 }} />
            <input name="accountNumber" type="number" placeholder="accountNumber" required style={{ padding: 8, marginRight: 8 }} />
            <input name="days" type="number" placeholder="days (default 30)" style={{ padding: 8, marginRight: 8 }} />
            <input name="note" placeholder="note (optional)" style={{ padding: 8, marginRight: 8 }} />
            <button style={{ padding: "8px 12px" }}>Extend</button>
          </form>
        </details>

        <details>
          <summary style={{ fontWeight: 600, color: "#dc2626" }}>Delete (xóa hoàn toàn)</summary>
          <form action={deleteAction} style={{ marginTop: 8 }}>
            <input name="productId" placeholder="productId" required style={{ padding: 8, marginRight: 8 }} />
            <input name="accountNumber" type="number" placeholder="accountNumber" required style={{ padding: 8, marginRight: 8 }} />
            <input name="note" placeholder="note (optional)" style={{ padding: 8, marginRight: 8 }} />
            <button style={{ padding: "8px 12px", backgroundColor: "#dc2626", color: "white", border: "none" }}>🗑️ Delete</button>
          </form>
        </details>

        <details>
          <summary style={{ fontWeight: 600, color: "#059669" }}>Test Verify License</summary>
          <form action={verifyAction} style={{ marginTop: 8 }}>
            <input name="productId" placeholder="productId" required style={{ padding: 8, marginRight: 8 }} />
            <input name="accountNumber" type="number" placeholder="accountNumber" required style={{ padding: 8, marginRight: 8 }} />
            <input name="mode" placeholder="REAL/DEMO/BOTH" defaultValue="REAL" style={{ padding: 8, marginRight: 8 }} />
            <input name="version" placeholder="version" defaultValue="1.0.0" style={{ padding: 8, marginRight: 8 }} />
            <button style={{ padding: "8px 12px", backgroundColor: "#059669", color: "white", border: "none" }}>✅ Verify</button>
          </form>
        </details>

        <details>
          <summary style={{ fontWeight: 600, color: "#2563eb" }}>Test Activate License</summary>
          <form action={activateTestAction} style={{ marginTop: 8, display: "grid", gap: 8 }}>
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
        <h2 style={{ fontWeight: 600 }}>Recent / Search Results</h2>
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
                      <form action={deleteAction} style={{ display: "inline" }}>
                        <input type="hidden" name="productId" value={x.productId} />
                        <input type="hidden" name="accountNumber" value={firstAccount} />
                        <input type="hidden" name="note" value={`Deleted from admin panel - ${new Date().toISOString()}`} />
                        <button 
                          type="submit" 
                          style={{ 
                            padding: "4px 8px", 
                            backgroundColor: "#dc2626", 
                            color: "white", 
                            border: "none", 
                            borderRadius: "4px",
                            fontSize: "12px",
                            cursor: "pointer"
                          }}
                          onClick={(e) => {
                            if (!confirm(`Xóa license ${x.productId} - Account ${firstAccount}?`)) {
                              e.preventDefault();
                            }
                          }}
                        >
                          🗑️
                        </button>
                      </form>
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
