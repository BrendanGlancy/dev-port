export type Post = {
  content: string;
  metadata: Record<string, string>;
  filePath: string;
};

export interface IBlogState {
  readonly posts: Post[];
  readonly tags: string[];
  readonly categories: string[];
}
