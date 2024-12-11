import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TldDetail from "./pages/TldDetail";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/tld/:tld" element={<TldDetail />} />
      </Routes>
    </Router>
  );
}

export default App;