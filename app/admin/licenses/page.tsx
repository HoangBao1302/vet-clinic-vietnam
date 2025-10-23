import { listRecentLicenses, searchLicenses, createDemo, revokeLicense, extendLicense, createLicenseMulti } from "../admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminLicensesPage({ searchParams }: { searchParams: Record<string,string|undefined> }) {
  const productId = (searchParams.productId || "").toString();
  const accountNumber = searchParams.accountNumber ? Number(searchParams.accountNumber) : undefined;

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
              </tr>
            </thead>
            <tbody>
              {data.map((x: any) => {
                const accounts = (x.accountNumbers?.length ? x.accountNumbers : (x.accountNumber ? [x.accountNumber] : [])) as number[];
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
