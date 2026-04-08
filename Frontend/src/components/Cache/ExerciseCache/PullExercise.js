import { store } from "../../../store";
import { setExercises, setError } from "./PullExerciseSlice";
import { fetchExercisesFromBackend } from "../../../QueryFunctions";

export async function pullExercises() {
  try {
    const list = await fetchExercisesFromBackend();
    store.dispatch(setExercises(list));
    return list;
  } catch (err) {
    console.error("Failed to fetch exercises:", err);
    const friendly = err && err.name ? `${err.name}: ${err.message}` : String(err);
    store.dispatch(setError(friendly || "Unknown error"));
    return [];
  }
}