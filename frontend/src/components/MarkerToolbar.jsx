function MarkerToolbar({ onAddField, onSave, onGoToFill, currentPage, numPages, onPageChange }) {
  return (
    <div className="toolbar">
      <button onClick={() => onAddField("text")}>+ Text Field</button>
      <button onClick={() => onAddField("checkbox")}>+ Checkbox</button>
      <button onClick={() => onAddField("signature")}>+ Signature</button>

      {numPages > 1 && (
        <select
          value={currentPage}
          onChange={(e) => onPageChange(Number(e.target.value))}
          style={{
            padding: "6px 10px",
            borderRadius: 4,
            border: "1px solid #d1d5db",
            fontSize: 14,
          }}
        >
          {Array.from({ length: numPages }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Page {i + 1}
            </option>
          ))}
        </select>
      )}

      <button onClick={onSave}>Save Markings</button>
      <button onClick={onGoToFill}>Go To Fill Mode</button>
    </div>
  );
}

export default MarkerToolbar;
