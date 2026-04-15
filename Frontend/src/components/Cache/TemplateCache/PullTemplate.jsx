import { store } from "../../../store";
import { setTemplates, setError } from "./PullTemplateSlice";
import { fetchTemplate } from "../../../QueryFunctions";

export async function pullTemplates() {
  try {
    const user = store.getState().auth.user;
    if (!user?._id) {
      store.dispatch(setError("No user logged in"));
      return;
    }
    
    const list = await fetchTemplate(user._id);
    const metadata = list.map(t => ({
      _id: t._id,
      title: t.title,
    }));
    console.log("Pulled templates:", metadata);
    store.dispatch(setTemplates(metadata));
  } 
  catch (err) {
    store.dispatch(setError("No templates found"));
  }
}
