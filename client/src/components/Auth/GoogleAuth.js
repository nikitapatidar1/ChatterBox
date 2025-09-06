import React, { useEffect, useState } from "react";

const GoogleAuth = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle the Google Sign-In response
  const handleCredentialResponse = (response) => {
    setIsLoading(true);
    setError("");

    // Send the credential token to your backend
    fetch(
      `${
        process.env.REACT_APP_API_URL || "http://localhost:5000/api"
      }/auth/google`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tokenId: response.credential }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data));
          window.location.href = "/dashboard";
        } else {
          console.error("Google authentication failed - no token received");
          setError("Google authentication failed. Please try again.");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error during Google authentication:", error);
        setError(
          "An error occurred during Google authentication. Please try again later."
        );
        setIsLoading(false);
      });
  };

  // Initialize Google Sign-In
  useEffect(() => {
    // Check if Google client ID is available
    if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) {
      console.error(
        "Google Client ID is missing. Please check your environment variables."
      );
      setError(
        "Google Sign-In is not configured properly. Please contact support."
      );
      return;
    }

    // Load Google Sign-In script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false,
          });

          window.google.accounts.id.renderButton(
            document.getElementById("googleSignInButton"),
            {
              theme: "outline",
              size: "large",
              width: "100%",
              text: "signin_with",
              shape: "rectangular",
            }
          );
        } catch (error) {
          console.error("Error initializing Google Sign-In:", error);
          setError("Failed to initialize Google Sign-In. Please try again.");
        }
      }
    };

    script.onerror = () => {
      console.error("Failed to load Google Sign-In script");
      setError(
        "Failed to load Google Sign-In. Please check your internet connection."
      );
    };

    document.body.appendChild(script);

    return () => {
      // Clean up
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div style={{ width: "100%", margin: "10px 0" }}>
      <div id="googleSignInButton"></div>

      {error && (
        <div
          style={{
            color: "red",
            fontSize: "14px",
            marginTop: "10px",
            padding: "10px",
            border: "1px solid red",
            borderRadius: "4px",
            backgroundColor: "#ffeeee",
          }}
        >
          {error}
        </div>
      )}

      {isLoading && (
        <div
          style={{
            textAlign: "center",
            marginTop: "10px",
            color: "#4e73df",
          }}
        >
          <p>Authenticating with Google...</p>
        </div>
      )}
    </div>
  );
};

export default GoogleAuth;
