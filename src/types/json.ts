export interface IJson {
  externalUrl?: string;
  list: { name: string; label: string; type: string }[][];
  view: {
    name: string;
    label: string;
    type: string;
  }[][];
  main?: {
    name: string;
    label: string;
    type: string;
  }[][];
  idKey?: string;
  titleKeyName?: string;
}
