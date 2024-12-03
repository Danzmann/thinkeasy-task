export const getLocalStorage = () => {
  const accessToken = localStorage.getItem("ThinkEasy_accessToken");
  const refreshToken = localStorage.getItem("ThinkEasy_refreshToken");
  const userInfo = localStorage.getItem("ThinkEasy_userInfo");
  return { accessToken, refreshToken, userInfo };
};

export const setLocalStorage = ({
  accessToken,
  refreshToken,
  userInfo,
}: {
  accessToken?: string;
  refreshToken?: string;
  userInfo?: string;
}) => {
  if (accessToken) localStorage.setItem("ThinkEasy_accessToken", accessToken);
  if (refreshToken)
    localStorage.setItem("ThinkEasy_refreshToken", refreshToken);
  if (userInfo) localStorage.setItem("ThinkEasy_userInfo", userInfo);
};

export const deleteLocalStorage = () => {
  localStorage.removeItem("ThinkEasy_accessToken");
  localStorage.removeItem("ThinkEasy_refreshToken");
  localStorage.removeItem("ThinkEasy_userInfo");
};
