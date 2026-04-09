import { pullExercises } from "../ExerciseCache/PullExercise";
export function onLoginCache() {
  pullExercises().catch((err) => console.error("Cache error:", err));
}