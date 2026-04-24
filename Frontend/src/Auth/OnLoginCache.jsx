import { pullExercises } from "../components/Cache/ExerciseCache/PullExercise";
import { pullPersonalExercises } from "../components/Cache/PersonalExerciseCache/PersonalExercise";
import { pullTemplates } from "../components/Cache/TemplateCache/PullTemplate";
import { pullWorkouts } from "../components/Cache/WorkoutCache/PullWorkout";
export function onLoginCache() {
  console.log("onLoginCache called");
  pullExercises().catch((err) => console.error("Cache error:", err));
  pullTemplates().catch((err) => console.error("Cache error:", err));
  pullWorkouts().catch((err) => console.error("Cache error:", err));
  pullPersonalExercises().catch((err) => console.error("Cache error:", err));
}