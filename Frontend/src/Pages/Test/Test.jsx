import { useEffect } from "react";
import { useSelector } from "react-redux";
import { pullPersonalExercises } from "../../components/Cache/PersonalExerciseCache/PersonalExercise";

export function Test() {
  const pullPersonalExerciseState = useSelector((state) => state.pullPersonalExercise);

  return (
    <>
      <h1>Test Page</h1>
      <h2>Personal Exercises in Cache:</h2>

      {pullPersonalExerciseState.personalExercises && pullPersonalExerciseState.personalExercises.length > 0 ? (
        pullPersonalExerciseState.personalExercises.map((exercise, index) => (
          <div key={index}>
            {exercise.title || exercise._id || JSON.stringify(exercise)}
          </div>
        ))
      ) : (
        <p>No personal exercises found</p>
      )}
    </>
  );
}