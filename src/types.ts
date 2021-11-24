import { Dispatch } from 'redux';
import { AxiosResponse } from 'axios';
import { rootReducer } from './reducers';

export type RootState = ReturnType<typeof rootReducer>;
export type GetState = () => RootState;
export type TypedDispatch = Dispatch<any>;

export interface ErrorResponse {
  response: {
    data?: {
      code: string;
      status: number;
      message: string;
      errors?: {
        fields?: string;
        code?: string;
        message?: string;
      }[];
      'validation-errors'?: {
        field: string;
        message: string;
      }[];
    };
  };
}


export interface FoundVirus {
  fileName: string;
  virusName: string;
}

export interface VirusScanResult {
  started: number;
  finished: number;
  status: 'CLEAN' | 'NOT_SCANNED' | 'DIRTY';
  foundViruses: FoundVirus[];
}

export interface FileDetails {
  fileId: string;
  fileUrl: string;
  name: string;
  size: number;
  uploadDate: number;
  fileUploadProgress: number;
  fileIconUrl: string;
  contentType: string;
  isPrivate: boolean;
  mimeCheck: 'PASSED' | 'FAILED';
  virusScan: VirusScanResult;
  isError: boolean;
  data: any;
}

export interface FileUploadService {
  fileUploadRequest<T = FileDetails>(file: FormData, isPrivate: boolean, hash?: string): Promise<AxiosResponse<T>>;
  fileDetailsRequest<T = FileDetails>(fileId: string): Promise<FileDetails> | Promise<AxiosResponse<T>>;
}
