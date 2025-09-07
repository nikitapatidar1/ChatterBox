const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function fetchContacts(token) {
  const res = await fetch(`${API}/api/contacts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function upsertContact(token, contact) {
  const res = await fetch(`${API}/api/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(contact),
  });
  return res.json();
}
