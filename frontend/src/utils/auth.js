export const isBrowser = () => {
  typeof window !== 'undefined'
};

export const getUser = () => {
  isBrowser() && window.localStorage.getItem('user')
    ? JSON.parse(window.localStorage.getItem('user'))
    : {};
};

export const setUser = (userData) => {
  window.localStorage.setItem('user', JSON.stringify(userData));
};

export const removeUser = () => {
  window.localStorage.removeItem('user')
};

export const isLoggedIn = () => {
  const user = getUser();
  return !!user.email;
};