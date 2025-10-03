import { ITreeNode, ITreeAttribute } from '../../../models/treeNode.model';

// Tree Attribute Interfaces
export interface AttributeFormData {
  key: string;
  value: string;
}

export interface AttributeValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface AttributeGridState {
  data: ITreeAttribute[];
  loading: boolean;
  editing: boolean;
  selectedRow?: number;
}

// Tree Node Interfaces
export interface NodeFormData {
  title: string;
  type: number | null;
}

export interface NodeType {
  id: number;
  name: string;
  description?: string;
}

export interface NodeValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface NodeDialogState {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'view';
  node?: ITreeNode | null;
  isDirty: boolean;
}

// Tree Tab Interfaces
export interface TabState {
  activeTab: 'general' | 'attributes';
  generalInfo: GeneralInfoState;
  attributes: AttributeGridState;
}

export interface GeneralInfoState {
  node: ITreeNode | null;
  owner: string;
  submissionDate: string;
  isReadOnly: boolean;
  loading: boolean;
}

// Tree View Interfaces
export interface TreeViewState {
  nodes: ITreeNode[];
  selectedNode: ITreeNode | null;
  loading: boolean;
  error: string | null;
}

export interface TreeViewConfig {
  showCheckboxes: boolean;
  allowDragDrop: boolean;
  allowMultiSelect: boolean;
  expandOnClick: boolean;
  showIcons: boolean;
}

// Event Interfaces
export interface NodeClickEvent {
  item: {
    dataItem: ITreeNode;
  };
  originalEvent: Event;
}

export interface NodeSelectEvent {
  selectedItems: ITreeNode[];
  deselectedItems: ITreeNode[];
}

export interface NodeExpandEvent {
  item: ITreeNode;
  expanded: boolean;
}

// Service Interfaces
export interface TreeServiceState {
  treeData: ITreeNode[];
  selectedNode: ITreeNode | null;
  attributes: ITreeAttribute[];
  isDirty: boolean;
  isAttributeDirty: boolean;
  loading: boolean;
  error: string | null;
}

export interface TreeOperationResult {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

// Component Input/Output Interfaces
export interface TreeNodeInputs {
  node: ITreeNode | null;
  readonly: boolean;
  showActions: boolean;
  config?: TreeViewConfig;
}

export interface TreeNodeOutputs {
  nodeClick: (node: ITreeNode) => void;
  nodeEdit: (node: ITreeNode) => void;
  nodeDelete: (node: ITreeNode) => void;
  nodeAdd: (parentNode: ITreeNode) => void;
}

export interface TreeAttributeInputs {
  node: ITreeNode | null;
  readonly: boolean;
  showToolbar: boolean;
}

export interface TreeAttributeOutputs {
  attributeAdd: (attribute: ITreeAttribute) => void;
  attributeEdit: (attribute: ITreeAttribute) => void;
  attributeDelete: (attribute: ITreeAttribute) => void;
  attributeSave: (attribute: ITreeAttribute) => void;
}

// Validation Interfaces
export interface ValidationRule {
  field: string;
  validator: (value: any) => boolean;
  message: string;
}

export interface FormValidationState {
  isValid: boolean;
  errors: Record<string, string[]>;
  warnings: Record<string, string[]>;
}

// Dialog Interfaces
export interface DialogConfig {
  title: string;
  content: any;
  actions: DialogAction[];
  width?: string;
  height?: string;
  closable?: boolean;
}

export interface DialogAction {
  text: string;
  themeColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  disabled?: boolean;
  action?: () => void;
}

export interface DialogResult {
  text: string;
  data?: any;
}

// Error Interfaces
export interface TreeError {
  code: string;
  message: string;
  context: string;
  timestamp: Date;
  details?: any;
}

export interface ErrorState {
  hasError: boolean;
  errors: TreeError[];
  lastError?: TreeError;
}

// Loading Interfaces
export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
  progress?: number;
}

// Constants
export const TREE_CONSTANTS = {
  NODE_TYPES: {
    FOLDER: 1,
    FILE: 0,
  },
  VALIDATION: {
    TITLE_MIN_LENGTH: 1,
    TITLE_MAX_LENGTH: 100,
    KEY_MIN_LENGTH: 1,
    KEY_MAX_LENGTH: 50,
    VALUE_MIN_LENGTH: 1,
    VALUE_MAX_LENGTH: 500,
  },
  DIALOG: {
    DEFAULT_WIDTH: '400px',
    DEFAULT_HEIGHT: '200px',
    LARGE_WIDTH: '70vw',
    LARGE_HEIGHT: 'max-content',
  },
  GRID: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
  },
} as const;

export type TreeConstants = typeof TREE_CONSTANTS;

export interface NodeAttributeFormData {
  key: string;
  value: string;
  id: string;
}
