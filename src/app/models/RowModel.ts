import { AstreID } from "./Astre";

export interface RowModel {
  type: string;
  name: string;
  tags: string;
  description: string;
  parent: string;
  date_added: string;
  last_modified: string;
  was_modified?: boolean;
}
export interface RowModelTransfer {
  type: string;
  name: string;
  astreID?: AstreID;
  tags: string;
  description: string;
  parent: string;
  date_added: string;
  last_modified: string;
  was_modified?: boolean;
}
