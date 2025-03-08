export interface ResponseApi<T> {
  message: string;
  statusCode: number;
  data: T
}