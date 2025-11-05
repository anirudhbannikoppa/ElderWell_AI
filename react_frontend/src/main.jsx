import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

// Styles
import "./index.css";
import "leaflet/dist/leaflet.css";

// Components
import App from "./App.jsx";
import AuthContextProvider from "./components/AuthContextProvider.jsx";

// Initialize React application with Auth0, Context Providers, and Routing
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <StrictMode>
      <AuthContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthContextProvider>
    </StrictMode>
  </Auth0Provider>
);
