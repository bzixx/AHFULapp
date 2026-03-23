// Shared query and utility functions used by pages/components

export function getDefaultNewExercise() {
  return {
    name: "",
    targetMuscles: [],
    bodyParts: [],
    equipment: [],
    gifUrl: "",
    instructions: "",
  };
}

export function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export async function loadEquipment() {
  // Returns { data: [ {value,label}, ... ] } or throws
  try {
    const res = await fetch("http://localhost:5000/AHFULexercises/equipments/", {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Equipment API returned ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    let arr = data;
    if (data && Array.isArray(data.data)) arr = data.data;

    const normalized = (arr || []).map((item, idx) => {
      if (item && typeof item === "object") {
        const value = item.id ?? item._id ?? item.value ?? item.name ?? String(idx);
        const label = item.name ?? item.title ?? item.equipment ?? String(value);
        return { value: String(value), label: String(label) };
      }
      const v = String(item);
      return { value: v, label: v };
    });

    return { data: normalized };
  } catch (err) {
    console.error("loadEquipment error:", err);
    const msg = err && err.message ? `Could not load equipment list: ${err.message}` : "Could not load equipment list";
    return { data: null, error: msg };
  }
}

export async function loadBodyParts() {
  // Returns { data: [ {value,label}, ... ] } or throws
  try {
    const res = await fetch("http://localhost:5000/AHFULexercises/bodyparts/", {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`BodyPart API returned ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    let arr = data;
    if (data && Array.isArray(data.data)) arr = data.data;

    const normalized = (arr || []).map((item, idx) => {
      if (item && typeof item === "object") {
        const value = item.id ?? item._id ?? item.value ?? item.name ?? String(idx);
        const label = item.name ?? item.title ?? item.equipment ?? String(value);
        return { value: String(value), label: String(label) };
      }
      const v = String(item);
      return { value: v, label: v };
    });

    return { data: normalized };
  } catch (err) {
    console.error("loadBodyPart error:", err);
    const msg = err && err.message ? `Could not load body part list: ${err.message}` : "Could not load body part list";
    return { data: null, error: msg };
  }
}

export async function loadTargetMuscles() {
  // Returns { data: [ {value,label}, ... ] } or throws
  try {
    const res = await fetch("http://localhost:5000/AHFULexercises/muscles/", {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Muscle API returned ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    let arr = data;
    if (data && Array.isArray(data.data)) arr = data.data;

    const normalized = (arr || []).map((item, idx) => {
      if (item && typeof item === "object") {
        const value = item.id ?? item._id ?? item.value ?? item.name ?? String(idx);
        const label = item.name ?? item.title ?? item.equipment ?? String(value);
        return { value: String(value), label: String(label) };
      }
      const v = String(item);
      return { value: v, label: v };
    });

    return { data: normalized };
  } catch (err) {
    console.error("loadEquipment error:", err);
    const msg = err && err.message ? `Could not load equipment list: ${err.message}` : "Could not load equipment list";
    return { data: null, error: msg };
  }
}

export async function fetchExercisesFromBackend() {
  // Returns array of exercises or throws
  const res = await fetch("http://localhost:5000/AHFULexercises");
  if (!res.ok) {
    let bodyText = "";
    try {
      bodyText = await res.text();
    } catch (e) {
      /* ignore */
    }
    throw new Error(`Server returned ${res.status} ${res.statusText} ${bodyText}`);
  }
  const data = await res.json();
  let list = [];
  if (Array.isArray(data)) list = data;
  else if (data && Array.isArray(data.data)) list = data.data;
  else if (data && Array.isArray(data.results)) list = data.results;
  else list = [];
  return list;
}

export async function searchExercises(searchQuery) {
  const res = await fetch(`http://localhost:5000/AHFULexercises/search?search=${encodeURIComponent(searchQuery)}`);
  if (!res.ok) {
    let bodyText = "";
    try {
      bodyText = await res.text();
    } catch (e) {}
    throw new Error(`Server returned ${res.status} ${res.statusText} ${bodyText}`);
  }
  const data = await res.json();
  let list = [];
  if (Array.isArray(data)) list = data;
  else if (data && Array.isArray(data.data)) list = data.data;
  else if (data && Array.isArray(data.results)) list = data.results;
  else list = [];
  return list;
}

export async function fetchTemplate(userId) {
  const res = await fetch(`http://localhost:5000/AHFULworkout/templates/${userId}`);
  if (!res.ok) {
    let bodyText = "";
    try {
      bodyText = await res.text();
    } catch (e) {}
    throw new Error(`Server returned ${res.status} ${res.statusText} ${bodyText}`);
  }
  const data = await res.json();
  return data;
}

export async function fetchWorkout(userId) {
  const res = await fetch(`http://localhost:5000/AHFULworkout/${userId}`);
  if (!res.ok) {
    let bodyText = "";
    try {
      bodyText = await res.text();
    } catch (e) {}
    throw new Error(`Server returned ${res.status} ${res.statusText} ${bodyText}`);
  }
  const data = await res.json();
  return data;
}

export async function fetchPersonalExercises(workoutId) {
  const res = await fetch(`http://localhost:5000/AHFULpersonalEx/workout/${workoutId}`);
  if (!res.ok) {
    let bodyText = "";
    try {
      bodyText = await res.text();
    } catch (e) {}
    throw new Error(`Server returned ${res.status} ${res.statusText} ${bodyText}`);
  }
  const data = await res.json();
  return data;
}

export async function createPersonalExercises(peData) {
  try {
    const res = await fetch("http://localhost:5000/AHFULpersonalEx/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(peData)
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || `Server returned ${res.status}` };
    }

    return { success: true, data };
  } catch (err) {
    console.error("createPersonalExercise error:", err);
    return { error: err.message || "Failed to create personal exercise" };
  }
}

export async function updatePersonalExercises(peId, peData) {
  try {
    const res = await fetch(`http://localhost:5000/AHFULpersonalEx/update/${peId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(peData)
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || `Server returned ${res.status}` };
    }

    return { success: true, data };
  } catch (err) {
    console.error("updatePersonalExercise error:", err);
    return { error: err.message || "Failed to update personal exercise" };
  }
}

// User Settings functions
export async function getUserSettings(userId) {
  const res = await fetch(`http://localhost:5000/AHFULuserSettings/${userId}`);
  if (res.status === 404) {
    // Create default settings if not found
    const createRes = await fetch(`http://localhost:5000/AHFULuserSettings/createDefault/${userId}`, {
      method: "POST"
    });
    if (!createRes.ok) throw new Error("Failed to create default settings");
    return createRes.json();
  }
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

export async function updateUserSettings(userId, settings) {
  const res = await fetch(`http://localhost:5000/AHFULuserSettings/update/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings)
  });
  if (!res.ok) throw new Error("Failed to update settings");
  return res.json();
}

export async function createExercise(exerciseData) {
  try {
    const res = await fetch("http://localhost:5000/AHFULexercises/create/", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(exerciseData),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || `Server returned ${res.status}` };
    }

    return { success: true, data };
  } catch (err) {
    console.error("createExercise error:", err);
    const msg = err && err.message ? err.message : "Failed to create exercise";
    return { error: msg };
  }
}

// ── Geocoding Functions (Nominatim/OpenStreetMap) ─────────────────────────────────

export async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    const res = await fetch(url, {
      headers: { "User-Agent": "AHFULApp/1.0" }
    });
    if (!res.ok) {
      throw new Error(`Geocoding API returned ${res.status}`);
    }
    const data = await res.json();
    return data.display_name || null;
  } catch (err) {
    console.error("reverseGeocode error:", err);
    return null;
  }
}

export async function forwardGeocode(address) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: { "User-Agent": "AHFULApp/1.0" }
    });
    if (!res.ok) {
      throw new Error(`Geocoding API returned ${res.status}`);
    }
    const data = await res.json();
    if (data && data.length > 0) {
      return { 
        lat: parseFloat(data[0].lat), 
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name 
      };
    }
    return null;
  } catch (err) {
    console.error("forwardGeocode error:", err);
    return null;
  }
}

export async function createWorkout(workoutData) {
  try {
    const res = await fetch("http://localhost:5000/AHFULworkout/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(workoutData)
        });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || `Server returned ${res.status}` };
    }

    return { success: true, data };
  } catch (err) {
    console.error("createExercise error:", err);
    const msg = err && err.message ? err.message : "Failed to create exercise";
    return { error: msg };
  }
}


export async function updateWorkout(workoutId, workoutData) {
  try {
    const res = await fetch(`http://localhost:5000/AHFULworkout/update/${workoutId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workoutData)
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || `Server returned ${res.status}` };
    }

    return { success: true, data };
  } catch (err) {
    return { error: err.message || "Failed to update workout" };
  }
}
