import { toAstre } from "./model-utils";
import { RowModel } from "./RowModel";

const SEP: string = "\u2800" + "\u2800"; // "\u001F" + "\u001E" + "\u2800"; // Unit Separator + Record Separator + Braille Empty

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
  /*let fields = Object.keys(instanceAstreID) as (keyof AstreID)[];

  let key = "";
  for (let fieldName of fields) {
    const value = id[fieldName as keyof AstreID];
    if (value != null) {
      key += value;
    }
    key += SEP;
  }*/
  return JSON.stringify(id); //key;
}

/**
 * Update tags and return the string of Tags
 *
 * @param astre
 * @param tagsToAdd
 * @param tagsToRemove
 * @returns
 */
export function updateTags(astre: Astre, tagsToAdd: string[], tagsToRemove: string[]): string {
  let updatedTagsList: string[] = astre.tags.split(",").filter((tag: string) => tagsToRemove.find((t) => t == tag));
  tagsToAdd.forEach((newTag) => {
    if (!updatedTagsList.includes(newTag)) {
      updatedTagsList.push(newTag);
    }
  });

  let updatedTags: string = updatedTagsList.join(",");
  astre.tags = updatedTags;
  return updatedTags;
}
