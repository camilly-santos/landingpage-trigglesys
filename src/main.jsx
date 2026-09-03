import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './i18n'; // <-- LINHA OBRIGATÓRIA! Sem isso as traduções não carregam.


// Importação do SCSS global (variáveis, reset e tipografia)
import './styles/main.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);