import { IndexedObject } from 'types/common';

export const getTokenFromLocalStorage = () => localStorage.getItem('accessToken');

export const saveToken = (key: string, token: string) => localStorage.setItem(key, token);

export const getRefreshTokenFromLocalStorage = () => localStorage.getItem('refreshToken');

export const saveUserToLs = (data) => localStorage.setItem('userInfo', JSON.stringify(data));

export const clearLs = () => {
  localStorage.clear();
};

export const getUserFromLs = (): IndexedObject =>
  JSON.parse(localStorage.getItem('userInfo') ?? '{}');

export const saveKeyToLs = (key: string, value: any) =>
  localStorage.setItem(key, JSON.stringify(value));

export const getKeyFromLs = (key: string) => {
  const value = localStorage.getItem(key);
  if (!value) {
    return null;
  } else {
    return JSON.parse(value);
  }
};
