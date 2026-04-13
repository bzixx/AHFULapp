import { store } from "../../../store";
import { setExercises, setError } from "./PullExerciseSlice";
import { fetchExercisesFromBackend } from "../../../QueryFunctions";

export async function pullExercises() {
  try {
    const list = await fetchExercisesFromBackend();
    store.dispatch(setExercises(list));
  } catch (err) {
    store.dispatch(setError("No exercises found"));
  }
}