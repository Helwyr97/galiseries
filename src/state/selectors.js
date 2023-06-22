import { selector } from "recoil";
import { userRoleState } from "./states";

export const isAdminSelector = selector({
  key: "isAdminSelector",
  get: ({ get }) => {
    const role = get(userRoleState);

    return role !== null && ["OWNER", "ADMIN"].includes(role);
  },
});
