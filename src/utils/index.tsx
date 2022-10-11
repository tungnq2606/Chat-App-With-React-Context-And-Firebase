import moment from 'moment';

export const usernameRegex = /^[\w]+$/ as RegExp;
export const getAbbreviations = (name: string) => {
  const nameArray = name.trim().split(' ');
  if (nameArray.length === 1) {
    return nameArray[0].charAt(0).toUpperCase();
  }
  return (
    nameArray[0].charAt(0) + nameArray[nameArray.length - 1].charAt(0)
  ).toUpperCase();
};

export const dateToStr = (date: Date | string, str: string) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return moment(date).format(str);
};

export const getDisplayTime = (date: Date | string) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth()
  ) {
    if (date.getDate() === today.getDate()) {
      return dateToStr(date, 'HH:mm');
    } else if (date.getDate() === yesterday.getDate()) {
      return 'Hôm qua';
    }
  }
  return dateToStr(date, 'DD/MM/YYYY');
};
