export interface Astre {
  astreID: AstreID;
  subname: string;
  tags: string;
  link: string;
  description: string;
  parent: string;
  id: string;
  date_added: string;
  last_modified: string;
}

export interface AstreID {
  type: string;
  subtype: string;
  name: string;
}

let instanceAstreID: AstreID = {
  type: "type",
  subtype: "subtype",
  name: "name",
};

export function astreKey(astre: Astre): string {
  return astreIDKey(astre.astreID);
}

export function astreIDKey(id: AstreID): string {
  const SEP: string = "\u001F" + "\u001E"; // Unit Separator + Record Separator
  let fields = Object.keys(instanceAstreID) as (keyof Astre)[];

  let key = "";
  for (let field of fields) {
    key += field + SEP;
  }
  return key;
}
