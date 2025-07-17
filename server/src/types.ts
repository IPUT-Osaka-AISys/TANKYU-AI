export type Paper = {
  id: string;
  title: string;
  author: string;
  year: number;
  abstract: string;
  summary: string;
};

export type CiniiArticle = {
  id: string;
  title: string;
  author: string;
  year: string;
  abstract: string;
  url: string;
};

export type Reference = {
  id: string;
  title: string;
  author: string;
  year: number;
};

export type SearchResponse = {
  themes: string[];
  references: Reference[];
  categories: string[];
  status: "success";
};
