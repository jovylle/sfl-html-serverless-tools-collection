function renderInventory(inventory) {
  const appDiv = document.getElementById('app');
  if (!appDiv) return;
  if (!inventory) {
    appDiv.innerHTML = '<p>No inventory data found.</p>';
    return;
  }

  // Convert inventory object into a sorted array of entries
  const entries = Object.entries(inventory).sort((a, b) => a[0].localeCompare(b[0]));

  // Create table
  let html = '<table><thead><tr><th>Item</th><th>Amount</th></tr></thead><tbody>';

  for (const [item, amount] of entries) {
    html += `<tr><td>${item}</td><td>${amount}</td></tr>`;
  }

  html += '</tbody></table>';

  appDiv.innerHTML = html;
}
