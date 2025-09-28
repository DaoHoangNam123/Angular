export interface ITreeAttribute {
  id: string;
  nodeId: string;
  key: string;
  value: string;
  node: ITreeNode;
}

export interface ITreeNode {
  id: string;
  title: string | null;
  type: number | null;
  parentId?: string;
  parent?: ITreeNode;
  children: ITreeNode[];
  attributes: ITreeAttribute[];
}
