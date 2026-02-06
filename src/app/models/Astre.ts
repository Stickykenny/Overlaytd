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
  const SEP: string = "\u2800" + "\u2800"; // "\u001F" + "\u001E" + "\u2800"; // Unit Separator + Record Separator + Braille Empty

  let fields = Object.keys(instanceAstreID) as (keyof AstreID)[];

  let key = "";
  for (let fieldName of fields) {
    const value = id[fieldName as keyof AstreID];
    if (value != null) {
      key += value;
    }
    key += SEP;
  }
  return key;
}
