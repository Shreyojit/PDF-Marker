import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TemplateBuilder from "./pages/TemplateBuilder";
import FormFillPage from "./pages/FormFillPage";
import CompletedForms from "./pages/CompletedForms";

function App() {
  return (
    <div>
      <header className="app-header">
        <h2>PDF Marker App</h2>

        <nav style={{ display: "flex", gap: 20 }}>
          <Link to="/">Dashboard</Link>
          <Link to="/completed">Completed Forms</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/builder/:documentId" element={<TemplateBuilder />} />
        <Route path="/fill/:documentId" element={<FormFillPage />} />
        <Route path="/completed" element={<CompletedForms />} />
      </Routes>
    </div>
  );
}

export default App;