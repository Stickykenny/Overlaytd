export interface Astre {
  astreID: AstreID;
  tags: string;
  description: string;
  parent: string;
  date_added: string;
  last_modified: string;
}

export interface AstreID {
  type: string;
  name: string;
}
