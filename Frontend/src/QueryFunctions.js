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
      "http://localhost:5000/AHFULexercises/equipments/",
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
  const backendPOSTURL = `http://localhost:5000/AHFULauth/logout`;

  //Try to Get LocalStorage Cookie for data
  try {
    let storedUserData = localStorage.getItem("user_data");
    let parsedData = JSON.parse(storedUserData);

    // POST response Object to BACKEND API ROUTE for processing.
    const backendResponse = await fetch(backendPOSTURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logout_email: parsedData.email }),
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
    const backendPOSTURL = `http://localhost:5000/AHFULauth/google-login`;

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

      console.log(backendResponse.status);
      //Error Handeling for if Backend Logic reported Failed to Frontend
      if (!backendResponse.ok) {
        const message = backendUserData?.error || backendResponse.statusText;
        throw new Error(
          `${message}`
        );
      }

      //Explicit check over response from server
      const contentType = backendResponse.headers.get("content-type");

      //If it exisits and the content type mathces, then set the frontendUserInfo variable
      //Also Sotre it to local Storage
      if (contentType && contentType.includes("application/json")) {
        const frontendUserInfo = backendUserData.user_info;
        const userString = JSON.stringify(frontendUserInfo);
        localStorage.setItem("user_data", userString);
        //If we want to swap to https use below line instead.
        //document.cookie = `user_data=${userString}; path=/; secure; samesite=strict`;
        return frontendUserInfo;
      } else {
        //If its not JSON try to parse it into text.
        throw new Error(
          `AHFUL Frontend API response error: Expected JSON but got ${contentType}`,
        );
      }
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

export async function whoami(userDataToVerify) {
  try {
    const backendVerificationResponse = await fetch('http://localhost:5000/AHFULauth/whoami', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userDataToVerify.email,
        last_login_expire: userDataToVerify.last_login_expire,
        magic_bits: userDataToVerify.magic_bits
      }),
      credentials: 'include'
    });

    if (backendVerificationResponse.ok) {
      const data = await backendVerificationResponse.json();
      return data
      
    } else {
      throw new Error(`Session validation failed: ${backendVerificationResponse.status} ${backendVerificationResponse.statusText}`);
    }
  } catch (err) {
    console.error('Query Function Session validation failed:', err);
  } 
}

// ──  Template functions ─────────────────────────────────────────────────────────
export async function fetchTemplate(userId) {
  const res = await fetch(
    `http://localhost:5000/AHFULworkout/templates/${userId}`,
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


// ──  User Settings functions ─────────────────────────────────────────────────────────
export async function getUserSettings(userId) {
  const foundUserSettingsResponse = await fetch(`http://localhost:5000/AHFULuserSettings/${userId}`);
  if (foundUserSettingsResponse.status === 404) {
    // Create default settings if not found
    const createDefaultSettingsResponse = await fetch(
      `http://localhost:5000/AHFULuserSettings/createDefault/${userId}`,
      {
        method: "POST",
      },
    );
    if (!createDefaultSettingsResponse.ok) throw new Error("Failed to create default settings" + createDefaultSettingsResponse.status);
    return createDefaultSettingsResponse.json();
  }
  if (!foundUserSettingsResponse.ok) throw new Error("Failed to fetch settings" + foundUserSettingsResponse.status );
  return foundUserSettingsResponse.json();
}


export async function updateUserSettings(userId, settings) {
  const res = await fetch(
    `http://localhost:5000/AHFULuserSettings/update/${userId}`,
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

// ── Exercise Functions ─────────────────────────────────────────────────────────

export async function fetchExerciseById(exerciseId) {
  const res = await fetch(
    `http://localhost:5000/AHFULexercises/id/${exerciseId}`,
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

export async function fetchExercisesFromBackend() {
  const res = await fetch("http://localhost:5000/AHFULexercises");
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
    `http://localhost:5000/AHFULexercises/search?search=${encodeURIComponent(searchQuery)}`,
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
  const res = await fetch("http://localhost:5000/AHFULworkout/create", {
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
    const res = await fetch(`http://localhost:5000/AHFULworkout/${userId}`);

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
    // Ensure we always return an array
    return data

  } catch (err) {
    console.error("fetchWorkout error:", err);
    // Return empty array for network errors on new user accounts
    throw err;
  }
}

export async function updateWorkout(workoutId, data) {
  const res = await fetch(
    `http://localhost:5000/AHFULworkout/update/${workoutId}`,
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

export async function fetchPersonalExercises(workoutId) {
  try {
    const res = await fetch(
      `http://localhost:5000/AHFULpersonalEx/workout/${workoutId}`,
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
  console.warn("Creating personal exercise with data:", data);
  const res = await fetch("http://localhost:5000/AHFULpersonalEx/create", {
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
    `http://localhost:5000/AHFULpersonalEx/update/${exerciseId}`,
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
    `http://localhost:5000/AHFULpersonalEx/delete/${exerciseId}`,
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
    const res = await fetch("http://localhost:5000/AHFULpersonalEx/create", {
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
      `http://localhost:5000/AHFULpersonalEx/update/${peId}`,
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
