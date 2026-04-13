import { pullExercises } from "../ExerciseCache/PullExercise";
import { pullPersonalExercises } from "../PersonalExerciseCache/PersonalExercise";
import { pullTemplates } from "../TemplateCache/PullTemplate";
import { pullWorkouts } from "../WorkoutCache/PullWorkout";
export function onLoginCache() {
  pullExercises().catch((err) => console.error("Cache error:", err));
  pullTemplates().catch((err) => console.error("Cache error:", err));
  pullWorkouts().catch((err) => console.error("Cache error:", err));
  pullPersonalExercises().catch((err) => console.error("Cache error:", err));
}