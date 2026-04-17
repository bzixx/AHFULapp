// Shared query and utility functions used by pages/components
export function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

// ── External API Load Functions ─────────────────────────────────────────────────────────

export async function loadEquipment() {
  try {
    const res = await fetch(
      "http://localhost:5000/api/AHFULexercises/equipments/",
      {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      throw new Error(`Equipment API returned ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    let arr = data;
    if (data && Array.isArray(data.data)) arr = data.data;

    const normalized = (arr || []).map((item, idx) => {
      if (item && typeof item === "object") {
        const value =
          item.id ?? item._id ?? item.value ?? item.name ?? String(idx);
        const label =
          item.name ?? item.title ?? item.equipment ?? String(value);
        return { value: String(value), label: String(label) };
      }
      const v = String(item);
      return { value: v, label: v };
    });

    return { data: normalized };
  } catch (err) {
    console.error("loadEquipment error:", err);
    const msg =
      err && err.message
        ? `Could not load equipment list: ${err.message}`
        : "Could not load equipment list";
    return { data: null, error: msg };
  }
}

export async function loadBodyParts() {
  try {
    const res = await fetch("http://localhost:5000/api/AHFULexercises/bodyparts/", {
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
        const value =
          item.id ?? item._id ?? item.value ?? item.name ?? String(idx);
        const label =
          item.name ?? item.title ?? item.equipment ?? String(value);
        return { value: String(value), label: String(label) };
      }
      const v = String(item);
      return { value: v, label: v };
    });

    return { data: normalized };
  } catch (err) {
    console.error("loadBodyPart error:", err);
    const msg =
      err && err.message
        ? `Could not load body part list: ${err.message}`
        : "Could not load body part list";
    return { data: null, error: msg };
  }
}

export async function loadTargetMuscles() {
  try {
    const res = await fetch("http://localhost:5000/api/AHFULexercises/muscles/", {
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
        const value =
          item.id ?? item._id ?? item.value ?? item.name ?? String(idx);
        const label =
          item.name ?? item.title ?? item.equipment ?? String(value);
        return { value: String(value), label: String(label) };
      }
      const v = String(item);
      return { value: v, label: v };
    });

    return { data: normalized };
  } catch (err) {
    console.error("loadEquipment error:", err);
    const msg =
      err && err.message
        ? `Could not load equipment list: ${err.message}`
        : "Could not load equipment list";
    return { data: null, error: msg };
  }
}

// ──  Authentication  functions ─────────────────────────────────────────────────────────
export async function handle_logout() {
  //Define POST URL for Later
  const backendPOSTURL = `http://localhost:5000/api/AHFULauth/logout`;

  //Try to Get LocalStorage Cookie for data
  try {
    let storedUserData = localStorage.getItem("user_data");
    let parsedData = JSON.parse(storedUserData);

    // POST response Object to BACKEND API ROUTE for processing.
    const backendResponse = await fetch(backendPOSTURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {},
      credentials: "include",
    });

    localStorage.removeItem("user_data");
    //TODO: UPDATE REDUX
    //setIsLoggedIn(false);
    console.log("AHFUL Logout Completed successfully.");
  } catch (error) {
    //Catch Spooky Errors that should never occur because you shouldnt log out before login
    console.log("👻 Logout Error:, ", error);
  }
}

export async function handle_google_login(response) {
  //TODO: need to fetch UserSettings and Set to Redux on Non-localStroage Logins

  try {
    //URL to send POST to later
    const backendPOSTURL = `http://localhost:5000/api/AHFULauth/google-login`;

    //Find ID Token, and maybe details from Google Success Response
    const googleButtonIdToken = response?.credential;
    const googleCSFR = response?.g_csrf_token;
    const googleButtonClientID = response?.client_id;

    //Check IDToken Not Null
    if (googleButtonIdToken) {
      // POST response Object to BACKEND API ROUTE for processing.
      const backendResponse = await fetch(backendPOSTURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleButtonIdToken }),
        credentials: "include",
      });

      let backendUserData = await backendResponse.json();
      return backendUserData;

    }

    console.log("AHFUL context_login Completed successfully.");
  } catch (error) {
    console.log(
      "AHFUL Error in handle_google_login Func Catch.  Not sure how you got here.  But here is a hint: ",
      error,
    );
    throw error;
  }
}

export async function whoami() {
  try {
    const backendVerificationResponse = await fetch('http://localhost:5000/api/AHFULauth/whoami', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {},
      credentials: 'include'
    });

    if (backendVerificationResponse.ok) {
      const data = await backendVerificationResponse.json();
      return data;
    } else if (backendVerificationResponse.status === 401) {
      console.log("Please Login. ")
    } else {
      throw new Error(
        `Session validation failed: ${backendVerificationResponse.status} ${backendVerificationResponse.statusText}`,
      );
    }
  } catch (err) {
    console.error("Query Function Session validation failed:", err);
  }
}

// ──  Template functions ─────────────────────────────────────────────────────────
export async function fetchTemplate(userId) {
  const res = await fetch(
    `http://localhost:5000/api/AHFULworkout/templates/user/${userId}`,
  );
  if (!res.ok) {
    let bodyText = "";
    try {
      bodyText = await res.text();
    } catch (e) {}
    throw new Error(
      `Server returned ${res.status} ${res.statusText} ${bodyText}`,
    );
  }
  const data = await res.json();
  return data;
}

export async function createTemplate(templateData) {
  try {
    const res = await fetch(
      "http://localhost:5000/api/AHFULworkout/create/template",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateData),
      },
    );
    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || `Server returned ${res.status}` };
    }

    return { success: true, data };
  } catch (err) {
    console.error("createTemplate error:", err);
    const msg = err && err.message ? err.message : "Failed to create template";
    return { error: msg };
  }
}

// ──  User Settings functions ─────────────────────────────────────────────────────────
export async function getUserSettings() {
  const foundUserSettingsResponse = await fetch(`http://localhost:5000/api/AHFULuserSettings`, {
    method: "GET",
    credentials: "include",
  });

  if (foundUserSettingsResponse.ok){
    return foundUserSettingsResponse.json();
  }else{
    throw new Error(
      "Failed to fetch settings" + foundUserSettingsResponse.status,
    );
  }
}

export async function updateUserSettings(userId, settings) {
  const res = await fetch(
    `http://localhost:5000/api/AHFULuserSettings/update/${userId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    },
  );
  if (!res.ok) throw new Error("Failed to update settings");
  return res.json();
}

// ── Gym Functions ─────────────────────────────────────────────────────────

export async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    const res = await fetch(url, {
      headers: { "User-Agent": "AHFULApp/1.0" },
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
      headers: { "User-Agent": "AHFULApp/1.0" },
    });
    if (!res.ok) {
      throw new Error(`Geocoding API returned ${res.status}`);
    }
    const data = await res.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name,
      };
    }
    return null;
  } catch (err) {
    console.error("forwardGeocode error:", err);
    return null;
  }
}

export async function fetchGym(gymId) {
  try {
    const res = await fetch(`http://localhost:5000/api/AHFULgyms/${gymId}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch gym: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (err) {
    console.error("fetchGym error:", err);
    return null;
  }
}
export async function fetchAllGyms() {
  try {
    const res = await fetch("http://localhost:5000/api/AHFULgyms", {
      credentials: "include"
    });
    if (!res.ok) {
      let bodyText = "";
      try { bodyText = await res.text(); } catch (e) { /* ignore */ }
      throw new Error(`Server returned ${res.status} ${res.statusText} ${bodyText}`);
    }
    const data = await res.json();
    let list = [];
    if (Array.isArray(data)) { list = data; }
    else if (data && Array.isArray(data.data)) { list = data.data; }
    else if (data && Array.isArray(data.results)) { list = data.results; }
    else { list = []; }
    return list;
  } catch (err) {
    console.error("fetchAllGyms error:", err);
    const friendly = err && err.name ? `${err.name}: ${err.message}` : String(err);
    throw new Error(friendly || "Unknown error");
  }
}

export async function createGym(gymData) {
  try {
    const res = await fetch("http://localhost:5000/api/AHFULgyms/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gymData),
      credentials: "include"
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data.error || `Server returned ${res.status}` };
    }
    return { success: true, data };
  } catch (err) {
    console.error("createGym error:", err);
    return { error: err.message || "Failed to create gym" };
  }
}

export async function deleteGym(gymId) {
  try {
    const res = await fetch(`http://localhost:5000/api/AHFULgyms/delete/${gymId}`, {
      method: "DELETE",
      credentials: "include"
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to delete gym: ${res.status} ${err}`);
    }
    return { success: true };
  } catch (err) {
    console.error("deleteGym error:", err);
    return { error: err.message || "Failed to delete gym" };
  }
}


// ── Exercise Functions ─────────────────────────────────────────────────────────

export async function fetchExerciseById(exerciseId) {
  const res = await fetch(
    `http://localhost:5000/api/AHFULexercises/id/${exerciseId}`,
  );
  if (!res.ok) {
    throw new Error(
      `Failed to fetch exercise: ${res.status} ${res.statusText}`,
    );
  }
  return res.json();
}

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

export async function createExercise(exerciseData) {
  try {
    const res = await fetch("http://localhost:5000/api/AHFULexercises/create/", {
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

export async function fetchExercisesFromBackend() {
  const res = await fetch("http://localhost:5000/api/AHFULexercises");
  if (!res.ok) {
    let bodyText = "";
    try {
      bodyText = await res.text();
    } catch (e) {}
    // If 404 or empty response, return empty array for new users
    if (res.status === 404 || res.status === 204) {
      return [];
    }
    throw new Error(
      `Server returned ${res.status} ${res.statusText} ${bodyText}`,
    );
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
  const res = await fetch(
    `http://localhost:5000/api/AHFULexercises/search?search=${encodeURIComponent(searchQuery)}`,
  );
  if (!res.ok) {
    let bodyText = "";
    try {
      bodyText = await res.text();
    } catch (e) {}
    // If 404 or empty response, return empty array for new users
    if (res.status === 404 || res.status === 204) {
      return [];
    }
    throw new Error(
      `Server returned ${res.status} ${res.statusText} ${bodyText}`,
    );
  }
  const data = await res.json();
  let list = [];
  if (Array.isArray(data)) list = data;
  else if (data && Array.isArray(data.data)) list = data.data;
  else if (data && Array.isArray(data.results)) list = data.results;
  else list = [];
  return list;
}

// ── Workout Functions ───────────────────────────────────────────────────────────

export async function createWorkout(workoutData) {
  const res = await fetch("http://localhost:5000/api/AHFULworkout/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workoutData),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create workout: ${res.status} ${err}`);
  }
  return res.json();
}

export async function fetchWorkout(userId) {
  try {
    const res = await fetch(`http://localhost:5000/api/AHFULworkout/${userId}`);

    // Handle empty or not found responses for new users
    if (res.status === 404 || res.status === 204) {
      return [];
    }

    if (!res.ok) {
      const bodyText = await res.text().catch(() => "");
      throw new Error(
        `Server returned ${res.status} ${res.statusText} ${bodyText}`,
      );
    }

    const data = await res.json();
    return data

  } catch (err) {
    console.error("fetchWorkout error:", err);
    // Return empty array for network errors on new user accounts
    throw err;
  }
}

export async function fetchWorkoutById(workoutId) {
  try {
    const res = await fetch(`http://localhost:5000/api/AHFULworkout/id/${workoutId}`);

    if (res.status === 404 || res.status === 204) {
      return null;
    }

    if (!res.ok) {
      const bodyText = await res.text().catch(() => "");
      throw new Error(
        `Server returned ${res.status} ${res.statusText} ${bodyText}`,
      );
    }

    const data = await res.json();
    return data; 
  } catch (err) {
    console.error("fetchWorkout error:", err);
    throw err;
  }
}


export async function updateWorkout(workoutId, data) {
  const res = await fetch(
    `http://localhost:5000/api/AHFULworkout/update/${workoutId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to update workout: ${res.status} ${err}`);
  }
  return res.json();
}

// ── Personal Exercise Functions ─────────────────────────────────────────────────

export async function fetchPersonalExerciseById(userId) {
  try {
    const res = await fetch(
      `http://localhost:5000/api/AHFULpersonalEx/${userId}`,
    );
    if (res.status === 404 || res.status === 204) {
      return [];
    }
    if (!res.ok) {
      const bodyText = await res.text().catch(() => "");
      throw new Error(`Server returned ${res.status} ${res.statusText} ${bodyText}`);
    }
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.exercises)) return data.exercises;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  } catch (err) {
    console.error("fetchPersonalExerciseById error:", err);
    return [];
  }
}

export async function fetchPersonalExercises(workoutId) {
  try {
    const res = await fetch(
      `http://localhost:5000/api/AHFULpersonalEx/workout/${workoutId}`,
    );

    // Handle empty or not found responses
    if (res.status === 404 || res.status === 204) {
      return [];
    }

    if (!res.ok) {
      const bodyText = await res.text().catch(() => "");
      throw new Error(
        `Server returned ${res.status} ${res.statusText} ${bodyText}`,
      );
    }

    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.exercises)) return data.exercises;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  } catch (err) {
    console.error("fetchPersonalExercises error:", err);
    return [];
  }
}

export async function createPersonalExercise(data) {
  const res = await fetch("http://localhost:5000/api/AHFULpersonalEx/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create personal exercise: ${res.status} ${err}`);
  }
  return res.json();
}

export async function updatePersonalExercise(exerciseId, data) {
  const res = await fetch(
    `http://localhost:5000/api/AHFULpersonalEx/update/${exerciseId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to update personal exercise: ${res.status} ${err}`);
  }
  return res.json();
}

export async function deletePersonalExercise(exerciseId) {
  const res = await fetch(
    `http://localhost:5000/api/AHFULpersonalEx/delete/${exerciseId}`,
    {
      method: "DELETE",
    },
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to delete personal exercise: ${res.status} ${err}`);
  }
  return res.json();
}

//Personal Exercise Data
export async function createPersonalExercises(peData) {
  try {
    const res = await fetch("http://localhost:5000/api/AHFULpersonalEx/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(peData),
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
    const res = await fetch(
      `http://localhost:5000/api/AHFULpersonalEx/update/${peId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(peData),
      },
    );

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

export async function updateTask(taskId, updates) {
  try {
    const res = await fetch(
      `http://localhost:5000/api/AHFULtasks/update/${taskId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      }
    );
    if (!res.ok) throw new Error("Failed to update task");
    return { success: true, data: await res.json() };
  } catch (err) {
    console.error("updateTask error:", err);
    return { error: err.message || "Failed to update task" };
  }
}
