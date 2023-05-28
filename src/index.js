import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { TransactionProvider } from './Context/EthersContext';
import { Auth0Provider } from "@auth0/auth0-react";
import 'react-toastify/dist/ReactToastify.css';
import 'reactjs-popup/dist/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Auth0Provider
        domain="dev-e8hs1mserq7663xf.us.auth0.com"
        clientId="Ywa5lltN18txsgmNMcBWjH3HJdDSnkBj"
        authorizationParams={{
            redirect_uri: window.location.origin,
            audience: "http://ethersubs/api"
        }}
    >
        <TransactionProvider>
            <App />
        </TransactionProvider>
    </Auth0Provider>
);
