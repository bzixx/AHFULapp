import { useSelector } from "react-redux";
import { useEffect } from "react";
import { pullExercises } from "../../components/Cache/ExerciseCache/PullExercise";

export function Test() {
  const exercises = useSelector((state) => state.pullExercise.exercises);

  useEffect(() => {
    pullExercises();
  }, []);

  return (
    <>
      <h1>Test Page</h1>
      <h2>Exercises in Cache:</h2>

      {exercises && exercises.length > 0 ? (
        exercises.map((ex, index) => (
          <div key={index}>
            {ex.name || ex.id || JSON.stringify(ex)}
          </div>
        ))
      ) : (
        <p>No exercises found</p>
      )}
    </>
  );
}