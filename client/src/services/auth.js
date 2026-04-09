// ----- Token helpers -----

export const getToken = () => localStorage.getItem('token');

export const setToken = (token) => localStorage.setItem('token', token);

export const removeToken = () => localStorage.removeItem('token');

// ----- User helpers -----
// We store a small user object { role, name/companyName } after login

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) =>
  localStorage.setItem('user', JSON.stringify(user));

export const removeUser = () => localStorage.removeItem('user');

// ----- Role helpers -----

export const isStudent = () => getUser()?.role === 'student';

export const isEmployer = () => getUser()?.role === 'employer';

export const isLoggedIn = () => !!getToken();

// ----- Logout -----

export const logout = () => {
  removeToken();
  removeUser();
};
