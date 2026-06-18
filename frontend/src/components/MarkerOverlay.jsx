import { useState, useRef } from "react";

function FieldBox({ field, onDelete, onUpdate, onSizeChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(field.field_name);
  const boxRef = useRef(null);

  function getContainerRect() {
    return boxRef.current?.parentElement?.getBoundingClientRect();
  }

  function handleDragStart(e) {
    if (isEditing) return;
    e.preventDefault();
    e.stopPropagation();

    // Capture dimensions now — they won't change during drag
    const widthPercent = field.width_percent;
    const heightPercent = field.height_percent;

    // Calculate where inside the box the user clicked, so the box
    // doesn't jump when they start dragging
    const containerRect = getContainerRect();
    if (!containerRect) return;
    const boxLeftPx = containerRect.left + (field.x_percent / 100) * containerRect.width;
    const boxTopPx = containerRect.top + (field.y_percent / 100) * containerRect.height;
    const offsetX = e.clientX - boxLeftPx;
    const offsetY = e.clientY - boxTopPx;

    function findTargetPage(cursorY) {
      const wrappers = document.querySelectorAll(".pdf-page-wrapper");
      for (let i = 0; i < wrappers.length; i++) {
        const r = wrappers[i].getBoundingClientRect();
        if (cursorY >= r.top && cursorY <= r.bottom) {
          return { pageNum: i + 1, rect: r };
        }
      }
      // Cursor is between pages — snap to the nearest one
      let best = { pageNum: 1, rect: null, dist: Infinity };
      wrappers.forEach((w, i) => {
        const r = w.getBoundingClientRect();
        const dist = Math.min(Math.abs(cursorY - r.top), Math.abs(cursorY - r.bottom));
        if (dist < best.dist) best = { pageNum: i + 1, rect: r, dist };
      });
      return { pageNum: best.pageNum, rect: best.rect };
    }

    function onMove(e) {
      const { pageNum, rect } = findTargetPage(e.clientY);
      if (!rect) return;

      const newX = ((e.clientX - offsetX - rect.left) / rect.width) * 100;
      const newY = ((e.clientY - offsetY - rect.top) / rect.height) * 100;

      onUpdate({
        ...field,
        page_number: pageNum,
        x_percent: Math.max(0, Math.min(100 - widthPercent, newX)),
        y_percent: Math.max(0, Math.min(100 - heightPercent, newY)),
      });
    }

    function onUp() {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  function handleResizeStart(e) {
    e.preventDefault();
    e.stopPropagation();

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startW = field.width_percent;
    const startH = field.height_percent;

    function onMove(e) {
      const rect = getContainerRect();
      if (!rect) return;
      const dw = ((e.clientX - startMouseX) / rect.width) * 100;
      const dh = ((e.clientY - startMouseY) / rect.height) * 100;
      const newW = Math.max(3, startW + dw);
      const newH = Math.max(1.5, startH + dh);
      onUpdate({ ...field, width_percent: newW, height_percent: newH });
      onSizeChange(field.field_type, newW, newH);
    }

    function onUp() {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  function commitName() {
    setIsEditing(false);
    if (editName.trim()) {
      onUpdate({ ...field, field_name: editName.trim() });
    }
  }

  const typeClass =
    field.field_type === "checkbox"
      ? "checkbox"
      : field.field_type === "signature"
      ? "signature"
      : "";

  return (
    <div
      ref={boxRef}
      className={`marker-box ${typeClass}`}
      style={{
        left: `${field.x_percent}%`,
        top: `${field.y_percent}%`,
        width: `${field.width_percent}%`,
        height: `${field.height_percent}%`,
        cursor: "move",
        userSelect: "none",
      }}
      onMouseDown={handleDragStart}
    >
      {isEditing ? (
        <input
          autoFocus
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={commitName}
          onKeyDown={(e) => e.key === "Enter" && commitName()}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            background: "transparent",
            fontSize: 10,
            padding: 0,
            outline: "none",
            color: "inherit",
            fontWeight: "bold",
          }}
        />
      ) : (
        <span
          title="Double-click to rename"
          style={{
            display: "block",
            lineHeight: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
            setEditName(field.field_name);
          }}
        >
          {field.field_name}
        </span>
      )}

      <button
        className="delete-marker"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(field);
        }}
      >
        ×
      </button>

      <div className="resize-handle" onMouseDown={handleResizeStart} />
    </div>
  );
}

function MarkerOverlay({ fields, pageSize, onDelete, onUpdate, onSizeChange }) {
  if (!pageSize) return null;

  return (
    <div className="overlay">
      {fields.map((field) => (
        <FieldBox
          key={field.id || field.temp_id}
          field={field}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onSizeChange={onSizeChange}
        />
      ))}
    </div>
  );
}

export default MarkerOverlay;
