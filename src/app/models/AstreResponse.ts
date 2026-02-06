import { Astre, AstreID } from "./Astre";

export type AstreChildren = {
  id: AstreID;
  children: AstreID[];
};

export type AstreLinksResponse = {
  astres: Astre[];
  childrenList: AstreChildren[];
};
