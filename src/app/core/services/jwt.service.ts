const ID_TOKEN_KEY = "authToken" as string;
const ID_TOKEN_KEY_EXPIRATION = "authTokenExpires" as string;

/**
 * @description get token form localStorage
 */
export const getToken = (): string | null => {
  return window.sessionStorage.getItem(ID_TOKEN_KEY);
};

/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveToken = (token: string): void => {
  window.sessionStorage.setItem(ID_TOKEN_KEY, token);
};

/**
 * @description remove token form localStorage
 */
export const destroyToken = (): void => {
  window.sessionStorage.removeItem(ID_TOKEN_KEY);
};

/**
 * @description get token expiration form localStorage
 */
export const getTokenExpiration = (): string | null => {
  return window.sessionStorage.getItem(ID_TOKEN_KEY_EXPIRATION);
};

/**
 * @description save token expiration into localStorage
 * @param token: string
 */
export const saveTokenExpiration = (expires: string): void => {
  window.sessionStorage.setItem(ID_TOKEN_KEY_EXPIRATION, expires);
};

/**
 * @description remove token expiration form localStorage
 */
export const destroyTokenExpiration = (): void => {
  window.sessionStorage.removeItem(ID_TOKEN_KEY_EXPIRATION);
};

export default {
  getToken,
  saveToken,
  destroyToken,
  getTokenExpiration,
  saveTokenExpiration,
  destroyTokenExpiration,
};
