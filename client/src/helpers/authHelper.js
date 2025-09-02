
export const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp < Date.now() / 1000) {
      localStorage.removeItem('token');
      return null;
    }
    return { id: payload.userId };
  } catch (error) {
    localStorage.removeItem('token');
    return null;
  }
};
