import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import MailPage from "./pages/MailPage";
import { RootProvider } from "./context";

import "./App.css";
import "antd/dist/antd.css";

function App() {
  return (
    <RootProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/mail" element={<MailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </RootProvider>
  );
}

export default App;
