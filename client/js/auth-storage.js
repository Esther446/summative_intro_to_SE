function getAuthState() {
  const localToken = localStorage.getItem("token");
  const localRole = localStorage.getItem("role");
  if (localToken && localRole) {
    return { token: localToken, role: localRole };
  }

  const sessionToken = sessionStorage.getItem("token");
  const sessionRole = sessionStorage.getItem("role");
  if (sessionToken && sessionRole) {
    return { token: sessionToken, role: sessionRole };
  }

  return { token: null, role: null };
}

function setAuthState(token, role, rememberMe, user) {
  if (rememberMe) {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    if (user) localStorage.setItem("user", JSON.stringify(user));
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("user");
    return;
  }

  sessionStorage.setItem("token", token);
  sessionStorage.setItem("role", role);
  if (user) sessionStorage.setItem("user", JSON.stringify(user));
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
}

function clearAuthState() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("user");
}

window.authStorage = {
  getAuthState,
  setAuthState,
  clearAuthState,
};
