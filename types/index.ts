export * from "./layout.interface";
export * from "./schema.interface";
export * from "./props.interface";
export * from "./store.interface";
export * from "./service.interface";

export interface Response {
  code: number;
  success: boolean;
  message?: string;
}

export interface ExtendedResponse<T> extends Response {
  data?: T;
  meta?: {
    total: number;
    [key: string]: any;
  };
}

export interface ApiGetProps {
  endpoint: string;
  query?: Record<any, any>;
  publicRoute?: boolean;
}

export interface ApiPostProps {
  endpoint: string;
  payload?: Record<any, any>;
  publicRoute?: boolean;
}

export interface ItemCode {
  value: number;
}

export interface PageProps {
  pageSize?: number;
  page?: number;
  _id?: string;
  total?: number;
  role?: string[] | undefined;
  searchKey?: string;
  [key: string]: any;
}

export interface NewUser {
  name: string;
  email: string;
  username: string;
  role: string;
  password?: string;
  employeeId?: string;
}
