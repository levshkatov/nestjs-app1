export interface IMediaPhotoSize {
  id: number;
  photoId: number;
  size: number;
  src: string;
  createdAt: Date;
  updatedAt: Date;
}

export type MediaPhotoSizeScopesMap = Record<string, never>;
