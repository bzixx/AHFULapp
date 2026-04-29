import { store } from "../../../store";
import { setExercises, setError } from "./PullFoodSlice";
import { fetchFood } from "../../../QueryFunctions";

export async function pullFood() {
  try {
    const list = await fetchFood();
    const metadata = list.map(e => ({
      _id: e._id,
      name: e.name,
      calsPerServing: e.calsPerServing,
      servings: e.servings,
      type: e.type,
      time: e.time
    }));
    console.log("Pulled food:", metadata);
    store.dispatch(setFood(metadata));
  } catch (err) {
    store.dispatch(setError("No food found"));
  }
}