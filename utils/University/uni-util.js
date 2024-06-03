export const getStoredUniData = () => {
  const storedUniData = localStorage.getItem("uniData");
  return storedUniData ? JSON.parse(storedUniData) : null;
};
