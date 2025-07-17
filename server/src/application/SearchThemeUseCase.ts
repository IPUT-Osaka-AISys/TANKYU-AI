// DDD: アプリケーション層ユースケース
import { searchCiniiArticles } from "../services/ciniiService";
import { generateThemesAndCategories } from "../services/openaiService";
import type { SearchResponse, CiniiArticle } from "../types";

export class SearchThemeUseCase {
  async execute(query: string): Promise<SearchResponse> {
    const articles: CiniiArticle[] = await searchCiniiArticles(query, 5);
    if (articles.length === 0) {
      console.warn("No articles found for query:", query);
      return {
        status: "success",
        themes: [],
        categories: [],
        references: [],
      };
    }
    const { themes, categories } = await generateThemesAndCategories(
      articles,
      query
    );

    return {
      themes,
      references: articles.map((a, i) => ({
        id: a.id || `ref-${i + 1}`,
        title: a.title,
        author: a.author,
        year: Number(a.year) || 0,
        url: a.url,
      })),
      categories,
      status: "success",
    };
  }
}
