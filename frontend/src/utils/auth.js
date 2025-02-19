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

// function to decode jwt from localStorage
export const getUserRole = () => {
  // parse the string from localStorage to JSON to access properties
  const token = JSON.parse(localStorage.getItem("user"))?.token; 
  
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1]; // Get the payload part
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = JSON.parse(atob(base64)); // Decode and parse JSON

    return decodedPayload.role || null; // Ensure JWT contains a 'role' field

  } catch (error) {
    return null;
  }
};