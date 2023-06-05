export type IeCookie = {
  ieAuthSes?: string;
  ieCsrfToken?: string;
  ieCsrfHashed?: string;
};

// This is the object of the session in database
export type AuthSesObj = {
  obj: string;
};

export type UserType =
  | "client owner"
  | "client manager"
  | "client team"
  | "editor owner"
  | "editor manager"
  | "editor team"
  | null;
