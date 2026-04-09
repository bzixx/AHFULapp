import { useSelector } from "react-redux";
import { useEffect } from "react";
import { pullExercises } from "../../components/Cache/ExerciseCache/PullExercise";

export function Test() {
  const { exercises, error } = useSelector((state) => state.pullExercise || { exercises: [], error: null });

  useEffect(() => {
    if (!exercises || exercises.length === 0) {
      console.log("Test page: auto-fetching exercises on mount...");
      pullExercises();
    }
  }, []);

  const handleRefresh = () => {
    console.log("Manually refreshing exercises...");
    pullExercises().then(result => console.log("Fetch result:", result));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Cache Test Page</h1>
      <p>Navigate to <code>/Test</code> to view this page</p>
      
      <button onClick={handleRefresh} style={{ marginBottom: "20px", padding: "10px" }}>
        Manual Refresh (check console)
      </button>
      
      <h2>Exercise Cache State</h2>
      <p><strong>Error:</strong> {error || "None"}</p>
      <p><strong>Exercises count:</strong> {exercises ? exercises.length : 0}</p>
      <p><strong>Is empty array:</strong> {exercises && exercises.length === 0 ? "Yes (backend may be empty or user has no exercises)" : "No"}</p>
      
      <h2>Exercise Data</h2>
      {exercises && exercises.length > 0 ? (
        <ul>
          {exercises.map((ex, index) => (
            <li key={index}>
              <strong>{ex.name || ex.exercise_name || `Exercise ${index + 1}`}</strong>
              {ex.muscle_group && <span> - {ex.muscle_group}</span>}
              {ex.category && <span> ({ex.category})</span>}
            </li>
          ))}
        </ul>
      ) : (
        <p>No exercises cached yet</p>
      )}
      
      <details style={{ marginTop: "20px" }}>
        <summary>Raw JSON</summary>
        <pre style={{ background: "#f4f4f4", padding: "10px", overflow: "auto" }}>
          {JSON.stringify({ exercises, error }, null, 2)}
        </pre>
      </details>
    </div>
  );
}
