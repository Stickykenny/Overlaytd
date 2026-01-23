import { Astre, AstreID } from "./Astre";
import { RowModelTransfer } from "./RowModel";

export function toAstre(item: RowModelTransfer): Astre {
  return {
    astreID: { type: item.type, subtype: item.subtype, name: item.name },
    subname: item.subname,
    tags: item.tags,
    link: item.link,
    description: item.description,
    parent: item.parent,
    id: item.id,
    date_added: item.date_added,
    last_modified: item.last_modified,
  };
}
