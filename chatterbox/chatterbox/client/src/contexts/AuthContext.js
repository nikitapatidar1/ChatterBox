// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Base URL from .env
//   const API_URL = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");

//     if (storedToken && storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//         setToken(storedToken);
//       } catch (error) {
//         console.error("Error parsing user data:", error);
//         localStorage.removeItem("user");
//         localStorage.removeItem("token");
//       }
//     }

//     setLoading(false);
//   }, []);

//   // 🟢 login
//   const login = async (email, password) => {
//   console.log("API URL:", API_URL);
//   try {
//     const res = await fetch(`${API_URL}/api/auth/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message || "Login failed");

//     // 👇 sahi tarike se user pick karo
//     const userData = {
//       _id: data.user._id,
//       name: data.user.name,
//       email: data.user.email,
//       phone: data.user.phone,        // ✅ phone aa gaya
//       avatar: data.user.avatar || "",
//     };

//     setUser(userData);
//     setToken(data.token);
//     localStorage.setItem("user", JSON.stringify(userData));
//     localStorage.setItem("token", data.token);

//     return { success: true, user: userData };
//   } catch (error) {
//     console.error("Login error:", error);
//     return { success: false, error: error.message };
//   }
// };

//   // 🟢 register

//   const register = async (name, email, phone, password) => {
//   try {
//     const res = await fetch(`${API_URL}/api/auth/register`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, email, phone, password }), // ✅ phone add
//     });

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message || "Registration failed");

//     const userData = {
//       _id: data._id,
//       name: data.name,
//       email: data.email,
//       phone: data.phone,         // ✅ phone add in local state
//       avatar: data.avatar || "",
//     };

//     setUser(userData);
//     setToken(data.token);
//     localStorage.setItem("user", JSON.stringify(userData));
//     localStorage.setItem("token", data.token);

//     return { success: true, user: userData };
//   } catch (error) {
//     console.error("Register error:", error);
//     return { success: false, error: error.message };
//   }
// };

//   // const register = async (name, email, password) => {
//   //   try {
//   //     const res = await fetch(`${API_URL}/api/auth/register`, {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({ name, email, password }),
//   //     });

//   //     const data = await res.json();
//   //     if (!res.ok) throw new Error(data.message || "Registration failed");

//   //     const userData = {
//   //       _id: data._id,
//   //       name: data.name,
//   //       email: data.email,
//   //       avatar: data.avatar || "",
//   //     };

//   //     setUser(userData);
//   //     setToken(data.token);
//   //     localStorage.setItem("user", JSON.stringify(userData));
//   //     localStorage.setItem("token", data.token);

//   //     return { success: true, user: userData };
//   //   } catch (error) {
//   //     console.error("Register error:", error);
//   //     return { success: false, error: error.message };
//   //   }
//   // };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//   };

//   const value = {
//     user,
//     token,
//     login,
//     register,
//     logout,
//     loading,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Base URL from .env
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    setLoading(false);
  }, []);

  // 🟢 Normal login (email + password)
  const login = async (email, password) => {
    console.log("API URL:", API_URL);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      const userData = {
        _id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        avatar: data.user.avatar || "",
      };

      setUser(userData);
      setToken(data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.token);

      return { success: true, user: userData };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  // 🟢 Direct auth set after OTP (no API call)
  const setAuthAfterOTP = ({ token, user }) => {
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      avatar: user.avatar || "",
    };

    setUser(userData);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  // 🟢 Register
  const register = async (name, email, phone, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      const userData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        avatar: data.avatar || "",
      };

      setUser(userData);
      setToken(data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.token);

      return { success: true, user: userData };
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, error: error.message };
    }
  };

  // 🟢 Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    setAuthAfterOTP, // 👈 Add kiya for OTP
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
