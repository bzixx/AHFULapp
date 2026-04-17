import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { pullExercises } from "../../components/Cache/ExerciseCache/PullExercise";

export function Test() {
  const [loading, setLoading] = useState(true);
  const pullExerciseState = useSelector(
    (state) => state.pullExercise?.exercises || []
  );

  useEffect(() => {
    pullExercises().then(() => setLoading(false));
  }, []);

  const targetedMuscles = useMemo(() => {
    const muscles = new Set();
    pullExerciseState.forEach((ex) => {
      (ex.targetMuscles || []).forEach((muscle) => {
        if (muscle) muscles.add(muscle);
      });
    });
    return Array.from(muscles).sort();
  }, [pullExerciseState]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h1>Test Page</h1>
      <p>Exercises loaded: {pullExerciseState.length}</p>
      <h2>Targeted Muscles ({targetedMuscles.length}):</h2>

      {targetedMuscles.length > 0 ? (
        <ul>
          {targetedMuscles.map((muscle) => (
            <li key={muscle}>{muscle}</li>
          ))}
        </ul>
      ) : (
        <p>No exercises found</p>
      )}
    </>
  );
}