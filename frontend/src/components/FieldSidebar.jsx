import { useRef, useEffect } from "react";

function FieldSidebar({ fields, onUpdate, onDelete, focusId, activeId }) {
  const inputRefs = useRef({});
  const rowRefs = useRef({});

  // New field added → scroll + focus + select
  useEffect(() => {
    if (!focusId) return;
    const el = inputRefs.current[focusId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      el.focus();
      el.select();
    }
  }, [focusId]);

  // Hover on canvas field → scroll to sidebar row (highlight only, no input focus)
  useEffect(() => {
    if (!activeId) return;
    const el = rowRefs.current[activeId];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeId]);

  const byPage = fields.reduce((acc, f) => {
    const p = f.page_number || 1;
    if (!acc[p]) acc[p] = [];
    acc[p].push(f);
    return acc;
  }, {});

  const pages = Object.keys(byPage).map(Number).sort((a, b) => a - b);

  const typeLabel = { text: "T", checkbox: "☑", signature: "✍" };

  return (
    <div className="field-sidebar">
      <h4 style={{ margin: "0 0 12px", fontSize: 14 }}>Fields</h4>

      {fields.length === 0 && (
        <p style={{ fontSize: 12, color: "#6b7280" }}>
          No fields yet. Click + Text Field, + Checkbox, or + Signature to add one.
        </p>
      )}

      {pages.map((page) => (
        <div key={page}>
          <p className="sidebar-page-label">Page {page}</p>

          {byPage[page].map((field) => {
            const key = field.id || field.temp_id;
            const isActive = key === activeId;
            const isNew = field.isNew && key === focusId;

            return (
              <div
                key={key}
                ref={(el) => { if (el) rowRefs.current[key] = el; }}
                className={`sidebar-field-row${isActive ? " active" : ""}${isNew ? " new-field" : ""}`}
              >
                <span className={`sidebar-type-badge ${field.field_type}`}>
                  {typeLabel[field.field_type] || "T"}
                </span>

                <input
                  ref={(el) => { if (el) inputRefs.current[key] = el; }}
                  className="sidebar-field-input"
                  value={field.field_name}
                  onChange={(e) => onUpdate({ ...field, field_name: e.target.value })}
                  placeholder="Field name"
                />

                <button
                  className="sidebar-delete-btn"
                  onClick={() => onDelete(field)}
                  title="Delete field"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default FieldSidebar;
