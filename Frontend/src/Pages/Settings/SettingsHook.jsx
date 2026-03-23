import { useState, useRef, useEffect } from "react";

function DropdownRow({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="setting-row">
      <span className="setting-label">{label}</span>

      <div className="setting-control" ref={ref}>
        <button
          className={`setting-action dropdown-trigger ${open ? "open" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <span>{value || "Select"}</span>
          <span className="arrow">▾</span>
        </button>

        {open && (
          <div className="dropdown-menu">
            {options.map((opt) => (
              <div
                key={opt}
                className={`dropdown-item ${value === opt ? "selected" : ""}`}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ActionRow({ label, buttonText, onClick }) {
  return (
    <div className="setting-row">
      <span className="setting-label">{label}</span>

      <div className="setting-control">
        <button className="setting-action" onClick={onClick}>
          {buttonText}
        </button>
      </div>
    </div>
  ); 
}

export { DropdownRow, ActionRow };