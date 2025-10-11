import { Astre } from "../models/Astre";
import { RowModelTransfer } from "src/app/models/RowModel";

export function fromAstresToRows(astres: Astre[]): RowModelTransfer[] {
  return astres.map((item) => ({
    ...item,
    ...item.astreID,
    was_modified: false,
  }));
}
