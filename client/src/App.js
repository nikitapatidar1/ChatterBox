import { API_URL, WS_URL } from "./api";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogoScreen from "./components/LogoScreen";
import Login from "./components/Auth/Login";
import WhatsAppStyleChat from "./components/Chat/WhatsAppStyleChat";
import Register from "./components/Auth/Register";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ChatProvider } from "./contexts/ChatContext";
import { ContactsProvider } from "./contexts/ContactsContext";
import { SocketProvider } from "./contexts/SocketContext";

function App() {
  return (
    <AuthProvider>
      <ContactsProvider>
        <InnerApp />
        {/* <p>API_URL: {API_URL}</p>
        <p>WS_URL: {WS_URL}</p> */}
      </ContactsProvider>
    </AuthProvider>
  );
}

function InnerApp() {
  const { currentUser } = useAuth();

  return (
    <SocketProvider id={currentUser?.id || "guest"}>
      <ChatProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LogoScreen />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/chat" element={<WhatsAppStyleChat />} />
          </Routes>
        </Router>
      </ChatProvider>
    </SocketProvider>
  );
}

export default App;
