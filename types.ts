
export enum AppTab {
  MODEL_CHANGE = 'MODEL_CHANGE',
  CREATE_VIDEO = 'CREATE_VIDEO',
  GALLERY = 'GALLERY'
}

export interface FashionResult {
  id: string;
  url: string;
  type: 'image' | 'video';
  timestamp: number;
}

export interface VideoState {
  originalVideoUrl?: string;
  extendedVideoUrl?: string;
  isExtending: boolean;
  operationId?: string;
}
