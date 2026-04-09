import { store } from "../../../store";
import { setExercises, setError } from "./PullExerciseSlice";
import { fetchExercisesFromBackend } from "../../../QueryFunctions";

export async function pullExercises() {
  try {
    console.log("pullExercises: starting fetch...");
    const list = await fetchExercisesFromBackend();
    console.log("pullExercises: fetched", list.length, "exercises");
    store.dispatch(setExercises(list));
    return list;
  } catch (err) {
    console.error("pullExercises: error:", err);
    const friendly = err && err.name ? `${err.name}: ${err.message}` : String(err);
    store.dispatch(setError(friendly || "Unknown error"));
    return [];
  }
}