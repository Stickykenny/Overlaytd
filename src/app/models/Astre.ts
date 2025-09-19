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
