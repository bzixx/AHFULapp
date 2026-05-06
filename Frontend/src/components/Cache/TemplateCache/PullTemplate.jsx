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
    const metaData = list.map(t => ({
      _id: t._id,
      user_id: t.user_id,
      title: t.title,
      template: t.template,
    }));

    console.log("Pulled templates with exercises:", metaData);
    store.dispatch(setTemplates(metaData));
  }
  catch (err) {
    store.dispatch(setError("No templates found"));
  }
}
