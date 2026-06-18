import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TemplateBuilder from "./pages/TemplateBuilder";
import FormFillPage from "./pages/FormFillPage";

function App() {
  return (
    <div>
      <header className="app-header">
        <h2>PDF Marker App</h2>

        <nav>
          <Link to="/">Dashboard</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/builder/:documentId" element={<TemplateBuilder />} />
        <Route path="/fill/:documentId" element={<FormFillPage />} />
      </Routes>
    </div>
  );
}

export default App;