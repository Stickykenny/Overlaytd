import { toAstre } from "./model-utils";
import { RowModel } from "./RowModel";

export type Astre = {
  astreID: AstreID;
  subname: string;
  tags: string;
  link: string;
  description: string;
  parent: string;
  id: string;
  date_added: string;
  last_modified: string;
};

export type AstreID = {
  type: string;
  subtype: string;
  name: string;
};

let instanceAstreID: AstreID = {
  type: "type",
  subtype: "subtype",
  name: "name",
};

export function astreKey(rowModel: RowModel): string {
  return astreIDKey(toAstre(rowModel).astreID);
}

export function astreIDKey(id: AstreID): string {
  const SEP: string = "\u001F" + "\u001E"; // Unit Separator + Record Separator

  let fields = Object.keys(instanceAstreID) as (keyof AstreID)[];

  let key = "";
  for (let fieldName of fields) {
    key += id[fieldName as keyof AstreID] + SEP;
  }
  return key;
}
