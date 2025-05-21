export interface Astre {
  astreID: AstreID;
  tags: string;
  description: string;
  parent: string;
  date_added: string;
  last_modified: string;
}

// Row Data Interface
export interface AstreID {
  type: string;
  name: string;
}
