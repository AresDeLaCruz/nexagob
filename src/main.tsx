import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <GoogleOAuthProvider
    clientId="275398566455-t55t4nleuplm6pvuj5cbape9ut483jdb.apps.googleusercontent.com"
  >
    <App />
  </GoogleOAuthProvider>
);