import { useState } from "react";
import { useSelector } from "react-redux";


export function Templates() {

    // ─── Template States
    const [templateSearch, setTemplateSearch] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    //Redux Cache for Templates.
    const templates = useSelector((state) => state.pullTemplate.templates);
    const cachedPersonalExercises = useSelector((state) => state.pullPersonalExercise.personalExercises);
    
    const exitOnEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.target.blur();
        }
    };

    async function handleApplyTemplate(template) {
        try {
            // Get template exercises from cache (personal exercises with template's workout_id)
            const templateExercises = cachedPersonalExercises?.filter((pe) => pe?.workout_id === template._id) || [];

            // Open popup
            setTemplatePreview({
                template,
                exercises: templateExercises,
            });

        } catch (err) {
            console.error(err);
            alert("Failed to load template exercises.");
        }
  }

    return (
    /* Left Column: Template/History */
          <div className="add-template-form">
            {/* Search Bar */}
            <div className="dropdown-wrapper">
              <input
                type="text"
                placeholder="Search templates..."
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                onKeyDown={exitOnEnter}
              />
        </div>


        <div className="dropdown-instructions">
          Select a template to apply
        </div>

        {/* Template List */}
          {templates.length === 0 && (
            <div className="dropdown-item">No templates found</div>
          )}

          {templates
            .filter((t) => {
              const title = t?.title ?? "";

              // Keep selected template visible even if search doesn't match
              if (selectedTemplate?._id === t._id) return true;

              return title
                .toLowerCase()
                .includes(templateSearch.toLowerCase());
            })
            .map((t, i) => {
              const isSelected = selectedTemplate?._id === t._id;

              return (
                <div
                  key={t._id ?? i}
                  className={`dropdown-item ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedTemplate(null); // unselect
                    } else {
                      setSelectedTemplate(t); // select
                    }
                  }}
                >
                  <span>Template Name: {t.title ?? "Unnamed Template"}</span>
                  <br />
                  <span>Created: {t.created_at ?? "Unknown Date"}</span>
                  <br />
                  <span>Notes: {t.notes ?? "No Notes"}</span>
                  {isSelected && <span className="check">✓</span>}
                </div>
              );
            })}

        <div
            className="apply-btn-wrapper"
            style={{ display: "flex", gap: "8px" }}
        >
            {/* Apply Button */}
            {selectedTemplate && (
            <button
                className="apply-btn"
                onClick={() => handleApplyTemplate(selectedTemplate)}
            >
                Apply Template
            </button>
            )}
            </div>
        </div>
    );
}