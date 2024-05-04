import fs from 'fs';
import path from 'path';

export const POSTS_PATH = path.join(process.cwd(), 'posts');
export const CASE_STUDIES_PATH = path.join(process.cwd(), 'case-studies');

// postFilePaths is the list of mdx files inside the POSTS_PATH directory
export const postFilePaths = fs
  .readdirSync(POSTS_PATH)
  // Only include md(x) files
  .filter((path) => /\.mdx?$/.test(path));

// caseStudiesFilePaths is the list of mdx files inside the POSTS_PATH directory
export const caseStudiesFilePaths = fs
  .readdirSync(CASE_STUDIES_PATH)
  .filter((path) => /\.mdx?$/.test(path));
