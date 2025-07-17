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
  url: string;
};

export type ApiResponse = {
  themes: string[];
  references: Reference[];
  categories: string[];
  status: string;
  error?: string;
};
