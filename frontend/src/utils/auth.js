export const getUser = () => {
  return JSON.parse(window.localStorage.getItem('user-info'));
};

export const saveUser = (authData) => {
  const userInfo = {
    user: authData.data.user,
    token: authData.token,
    expiresIn: authData.expiresIn,
  }
  window.localStorage.setItem('user-info', JSON.stringify(userInfo));
}

export const removeUser = () => {
  window.localStorage.removeItem('user-info')
};

export const getUserRole = () => {
  const token = getUser()?.token;
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