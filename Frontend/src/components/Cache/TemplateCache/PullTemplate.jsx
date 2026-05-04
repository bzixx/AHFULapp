import { store } from "../../../store";
import { setTemplates, setError } from "./PullTemplateSlice";
import { fetchTemplate, fetchPersonalExercises } from "../../../QueryFunctions";

export async function pullTemplates() {
  try {
    const user = store.getState().auth.user;
    if (!user?._id) {
      store.dispatch(setError("No user logged in"));
      return;
    }

    const list = await fetchTemplate(user._id);

    // Fetch full template data including exercises for each template
    const fullTemplates = await Promise.all(
      list.map(async (t) => {
        try {
          const exercises = await fetchPersonalExercises(t._id);
          return {
            ...t,
            exercises: exercises || [],
          };
        } catch (err) {
          console.error("Error fetching exercises for template:", t._id, err);
          return { ...t, exercises: [] };
        }
      })
    );

    console.log("Pulled templates with exercises:", fullTemplates);
    store.dispatch(setTemplates(fullTemplates));
  }
  catch (err) {
    store.dispatch(setError("No templates found"));
  }
}
