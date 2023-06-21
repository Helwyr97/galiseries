import { atom } from "recoil";

export const showNavbarState = atom({
  key: "showNavbarState",
  default: true,
});

export const userState = atom({
  key: "userState",
  default: null,
});
