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

  const donationRows = donations
    .map(
      (d) => `
      <tr>
        <td>${d.donor_name}</td>
        <td>$${d.amount}</td>
        <td>${d.date}</td>
      </tr>
    `
    )
    .join("");

  const expenseRows = expenses
    .map(
      (e) => `
      <tr>
        <td>${e.description}</td>
        <td>$${e.amount_used}</td>
        <td>${e.expense_date}</td>
      </tr>
    `
    )
    .join("");

  const updateRows = updates
    .map(
      (u) => `<li><b>${u.update_date}:</b> ${u.update_text}</li>`
    )
    .join("");

  const feedbackRows = feedback
    .map(
      (f) => `<li><b>${f.created_at}:</b> ★${f.rating} — ${f.feedback}</li>`
    )
    .join("");

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
<p><b>Name:</b> ${patient.full_name}</p>
<p><b>Birth Date:</b> ${patient.birth_date}</p>

<h2>Case Details</h2>
<p><b>Title:</b> ${caseInfo.title}</p>
<p><b>Description:</b> ${caseInfo.description}</p>
<p><b>Goal:</b> $${caseInfo.goal_amount}</p>
<p><b>Donated:</b> $${total_donated}</p>
<p><b>Used:</b> $${total_used}</p>
<p><b>Remaining:</b> $${remaining}</p>

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
