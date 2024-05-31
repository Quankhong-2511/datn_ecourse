import { AppConstant } from './app.constant';

export const getValueOrDefault = <T>(value: any, defaultValue: T): T => {
  return value !== null && value !== undefined ? (value as T) : defaultValue;
};

export const isAdmin = (roleCd?: number | null) => {
  return !!(roleCd && [AppConstant.ROLE_ADMIN].includes(roleCd));
};

export const isMember = (roleCd?: number | null) => {
  return !!(roleCd && [AppConstant.ROLE_ADMIN, AppConstant.ROLE_MEMBER].includes(roleCd));
};

export const toFullName = (socialData: any) => {
  const { firstName, lastName } = socialData || {};
  const fullName = [firstName, lastName].filter(Boolean).join('');
  return fullName.trim();
};

export const isNotEmptyField = (value: any, isNumber = false) => {
  if (isNumber) {
    return value !== null && value !== undefined && value > 0;
  }

  return value !== null && value !== undefined && value.length > 0;
};

export const getTitle = (content: string): string => {
  const normalizedContent = content.replace(/\r\n|\r/g, '\n').trim();
  const nonEmptyLines = normalizedContent.split('\n').filter((line) => line.trim() !== '');
  const paragraph = nonEmptyLines[0] ?? '';

  const regex = new RegExp(AppConstant.SPLIT_CHARACTERS);
  const match = regex.exec(paragraph);

  const title = paragraph.slice(0, getValueOrDefault(match?.index, paragraph.length) + 1);
  return title;
};


export const formatDate = (createdAt: Date) => {
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${day}/${month}/${year}`;
}