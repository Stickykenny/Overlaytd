import { Astre, AstreID } from "./Astre";

/**
 * Check Utility Types https://www.typescriptlang.org/docs/handbook/utility-types.html
 */

export interface RowModel extends Omit<RowModelTransfer, "astreID"> {
  /*type: string;
  name: string;
  tags: string;
  description: string;
  parent: string;
  date_added: string;
  last_modified: string;*/
  //was_modified?: boolean;
}

// Pass this type to go from Astre to table
export interface RowModelTransfer extends Omit<Astre, "astreID"> {
  // Same as the interface Astre but we'll redefine astreID
  astreID?: AstreID;
  type: string;
  subtype: string;
  name: string;
  /*astreID?: AstreID;
  tags: string;
  description: string;
  parent: string;
  date_added: string;
  last_modified: string;*/
  was_modified?: boolean;
}
