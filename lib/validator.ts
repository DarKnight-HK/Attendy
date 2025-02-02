export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  return emailRegex.test(email);
};
export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validateUsername = (username: string): boolean => {
  return username.length >= 3;
};

export const validateNumber = (number: string, semster?: boolean) => {
  const numericString = number.replace(/[^0-9]/g, "");
  if (numericString === "") {
    return "";
  }
  if (semster) {
    try {
      if (parseInt(numericString) > 12) {
        return "12";
      }
    } catch (e) {
      return "";
    }
  }
  return numericString;
};
