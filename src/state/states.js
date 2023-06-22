import { atom } from "recoil";

export const showNavbarState = atom({
  key: "showNavbarState",
  default: true,
});

export const userRoleState = atom({
  key: "userRoleState",
  default: null,
});
