import { useSelector } from "react-redux";

export function Test() {
  const pullPersonalExerciseState = useSelector((state) => state.pullPersonalExercise);


  return (
    <>
      <h1>Test Page</h1>
      <h2>Personal Exercises in Cache:</h2>

      {pullPersonalExerciseState.exercises && pullPersonalExerciseState.exercises.length > 0 ? (
        pullPersonalExerciseState.exercises.map((exercise, index) => (
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