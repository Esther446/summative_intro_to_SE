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

function setAuthState(token, role, rememberMe) {
  if (rememberMe) {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    return;
  }

  sessionStorage.setItem("token", token);
  sessionStorage.setItem("role", role);
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}

function clearAuthState() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("role");
}

window.authStorage = {
  getAuthState,
  setAuthState,
  clearAuthState,
};
