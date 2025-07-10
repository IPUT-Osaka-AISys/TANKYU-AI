export type Paper = {
  id: string;
  title: string;
  author: string;
  year: number;
  abstract: string;
  summary: string;
};

export type Reference = {
  id: string;
  title: string;
  author: string;
  year: number;
};

export type SearchResponse = {
  results: Paper[];
  themes: string[];
  references: Reference[];
  categories: string[];
  status: "success";
};
