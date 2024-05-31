import { IndexedObject } from 'types/common';
import queryString from 'query-string';

export const isEmptyObject = (obj: IndexedObject) => {
  if (obj.constructor === Object && Object.keys(obj).length === 0) {
    return true;
  }
  return JSON.stringify(obj) === JSON.stringify({});
};
// dùng để truyền param
export const replacePathParams = (path: string, params: IndexedObject<string>): string =>
  path.replace(/:([^/]+)/g, (_, p1) => encodeURIComponent(params[p1] ? params[p1] : ''));

export const getPublicUrl = (image: string) => `${process.env.PUBLIC_URL}/${image}`;

export const parseFloatNum = (str: string | (string | null)[] | null | number) => {
  const trimmed = str && typeof str === 'string' ? str.trim() : null;
  if (!trimmed) {
    return null;
  }
  const num = parseFloat(trimmed);
  const isFullyParsedNum = num.toString() === trimmed;
  return isFullyParsedNum ? num : null;
};

export const parseSearchParams = (search: string) => {
  const params = queryString.parse(search);
  return Object.keys(params).reduce((result: IndexedObject, key: string) => {
    const newResult = { ...result };
    const val = params[key];
    if (val === 'true') {
      newResult[key] = true;
    } else if (val === 'false') {
      newResult[key] = false;
    } else {
      const num = parseFloatNum(val);
      newResult[key] = num === null ? val : num;
    }
    return newResult;
  }, {});
};

export const createQueryUrl = (location: any, params: IndexedObject) => {
  const { pathname } = location;
  if (isEmptyObject(params)) return pathname;
  const query = queryString.stringify(params);
  return `${pathname}?${query}`;
};
