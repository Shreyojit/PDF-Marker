function FillOverlay({ fields, responses, onChange }) {
  return (
    <div className="overlay fill-overlay">
      {fields.map((field) => {
        const style = {
          left: `${field.x_percent}%`,
          top: `${field.y_percent}%`,
          width: `${field.width_percent}%`,
          height: `${field.height_percent}%`,
        };

        if (field.field_type === "checkbox") {
          return (
            <input
              key={field.id}
              className="pdf-checkbox"
              type="checkbox"
              style={style}
              checked={responses[field.id] === "true"}
              onChange={(e) =>
                onChange(field.id, e.target.checked ? "true" : "false")
              }
            />
          );
        }

        if (field.field_type === "signature") {
          return (
            <input
              key={field.id}
              className="pdf-input signature-input"
              type="text"
              style={style}
              placeholder=""
              value={responses[field.id] || ""}
              onChange={(e) => onChange(field.id, e.target.value)}
            />
          );
        }

        return (
          <input
            key={field.id}
            className="pdf-input"
            type="text"
            style={style}
            placeholder=""
            value={responses[field.id] || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
          />
        );
      })}
    </div>
  );
}

export default FillOverlay;
