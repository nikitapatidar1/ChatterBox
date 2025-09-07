const hostname = window.location.hostname;

// API
let API_URL;
let WS_URL;

if (hostname === "localhost") {
  API_URL = process.env.REACT_APP_API_URL_LOCAL;
  WS_URL = process.env.REACT_APP_WS_URL_LOCAL;
} else {
  API_URL = process.env.REACT_APP_API_URL_IP;
  WS_URL = process.env.REACT_APP_WS_URL_IP;
}

export { API_URL, WS_URL };
