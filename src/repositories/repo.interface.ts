export interface Repo<T> {
  query(): Promise<T[]>;
}
