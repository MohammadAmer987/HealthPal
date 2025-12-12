export default function invoiceTemplate(data) {
  const {
    caseInfo,
    patient,
    donations,
    expenses,
    updates,
    feedback,
    total_donated,
    total_used,
    remaining,
  } = data;

  const donationRows = (donations && donations.length > 0)
    ? donations
        .map(
          (d) => `
          <tr>
            <td>${d.donor_name || 'Anonymous'}</td>
            <td>$${d.amount || 0}</td>
            <td>${d.donated_at ? new Date(d.donated_at).toLocaleDateString() : 'N/A'}</td>
          </tr>
        `
        )
        .join("")
    : "<tr><td colspan='3'>No donations yet</td></tr>";

  const expenseRows = (expenses && expenses.length > 0)
    ? expenses
        .map(
          (e) => `          node server.js
          <tr>
            <td>${e.description || 'N/A'}</td>
            <td>$${e.amount_used || 0}</td>
            <td>${e.expense_date ? new Date(e.expense_date).toLocaleDateString() : 'N/A'}</td>
          </tr>
        `
        )
        .join("")
    : "<tr><td colspan='3'>No expenses recorded</td></tr>";

  const updateRows = (updates && updates.length > 0)
    ? updates
        .map(
          (u) => `<li><b>${u.update_date ? new Date(u.update_date).toLocaleDateString() : 'N/A'}:</b> ${u.update_text || 'N/A'}</li>`
        )
        .join("")
    : "<li>No updates available</li>";

  const feedbackRows = (feedback && feedback.length > 0)
    ? feedback
        .map(
          (f) => `<li><b>${f.created_at ? new Date(f.created_at).toLocaleDateString() : 'N/A'}:</b> ★${f.rating || 0} — ${f.feedback || 'N/A'}</li>`
        )
        .join("")
    : "<li>No feedback available</li>";

  return `
<html>
<head>
<style>
  body { font-family: Arial; padding: 20px; }
  .header { border-bottom: 2px solid #4CAF50; padding-bottom: 10px; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  th, td { border: 1px solid #ccc; padding: 8px; }
  th { background: #4CAF50; color: white; }
</style>
</head>

<body>

<div class="header">
  <h1>HealthPal Case Invoice</h1>
  <p>Date: ${new Date().toLocaleDateString()}</p>
</div>

<h2>Patient Information</h2>
<p><b>Name:</b> ${patient?.full_name || 'N/A'}</p>
<p><b>Birth Date:</b> ${patient?.birth_date || 'N/A'}</p>

<h2>Case Details</h2>
<p><b>Title:</b> ${caseInfo?.title || 'N/A'}</p>
<p><b>Description:</b> ${caseInfo?.description || 'N/A'}</p>
<p><b>Goal:</b> $${caseInfo?.goal_amount || 0}</p>
<p><b>Donated:</b> $${total_donated || 0}</p>
<p><b>Used:</b> $${total_used || 0}</p>
<p><b>Remaining:</b> $${remaining || 0}</p>

<h2>Donations</h2>
<table>
  <tr><th>Donor</th><th>Amount</th><th>Date</th></tr>
  ${donationRows}
</table>

<h2>Expenses</h2>
<table>
  <tr><th>Description</th><th>Amount Used</th><th>Date</th></tr>
  ${expenseRows}
</table>

<h2>Updates</h2>
<ul>
  ${updateRows}
</ul>

<h2>Patient Feedback</h2>
<ul>
  ${feedbackRows}
</ul>

</body>
</html>
`;
}
