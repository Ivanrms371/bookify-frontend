export type ImageType = 'avatar' | 'logo' | 'gallery' | 'cover' | 'service';

export interface UploadResult {
  url: string;
  publicId: string;
}

export interface DeleteResult {
  result: string;
}
