export interface ResponseApi<T> {
  message: string;
  statusCode: number;
  dados: T
}