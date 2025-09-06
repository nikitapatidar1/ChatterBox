
























// src/contexts/ContactsContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { API_URL } from "../api";   // 👈 dynamic API_URL

const ContactsContext = createContext();

export const ContactsProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [contacts, setContacts] = useState([]);

  // ✅ Add Contact
  const addContact = async ({ name, phone, email }) => {
    if (!name) throw new Error("Name is required");

    try {
      const res = await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,   // ✅ fixed
        },
        body: JSON.stringify({ name, phone, email }),
      });

      const saved = await res.json();
      if (!res.ok) throw new Error(saved?.message || "Failed to add contact");

      setContacts((prev) => [saved, ...prev]); // list ke top me naya add
      return saved;
    } catch (err) {
      console.error("❌ Error adding contact:", err);
      throw err;
    }
  };

  // ✅ Fetch Contacts
  const fetchContacts = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/contacts`, {
        headers: { Authorization: `Bearer ${token}` },  // ✅ fixed
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch contacts");

      setContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error fetching contacts:", err);
      setContacts([]); // fallback empty
    }
  };

  // ✅ Delete Contact
  const deleteContact = async (id) => {
    try {
      await axios.delete(`${API_URL}/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },  // ✅ fixed
      });
      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("❌ Error deleting contact:", error);
    }
  };

  // Auto-fetch when user + token available
  useEffect(() => {
    if (user && token) {
      console.log("🔑 Fetching contacts with token:", token);

      
      console.log("🌐 API_URL used:", API_URL);  // 👈 yahan
      fetchContacts();
    }
  }, [user, token]);

  return (
    <ContactsContext.Provider
      value={{ contacts, addContact, deleteContact, fetchContacts }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => useContext(ContactsContext);
