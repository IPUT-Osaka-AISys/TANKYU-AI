// DDD: アプリケーション層ユースケース
import { searchCiniiArticles } from "../services/ciniiService";
import {
  generateThemesAndCategories,
  extractKeywordsFromQuery,
} from "../services/openaiService";
import type { SearchResponse, CiniiArticle } from "../types";

export class SearchThemeUseCase {
  async execute(query: string): Promise<SearchResponse> {
    // Step 1: クエリからキーワードを抽出
    console.log(`クエリからキーワードを抽出中: ${query}`);
    const keywords = await extractKeywordsFromQuery(query);
    console.log(`抽出されたキーワード:`, keywords);

    // Step 2: 各キーワードについてCiNiiから論文を検索
    const allArticles: CiniiArticle[] = [];
    const articlesPerKeyword = Math.max(1, Math.floor(10 / keywords.length)); // 全体で10件程度になるよう調整

    for (const keyword of keywords) {
      console.log(`キーワード "${keyword}" で論文を検索中...`);
      try {
        const articles = await searchCiniiArticles(keyword, articlesPerKeyword);
        console.log(
          `キーワード "${keyword}" で ${articles.length} 件の論文を取得`
        );
        allArticles.push(...articles);
      } catch (error) {
        console.warn(`キーワード "${keyword}" での検索でエラーが発生:`, error);
        // エラーが発生しても他のキーワードでの検索を続行
      }
    }

    // Step 3: 重複する論文を除去（IDまたはタイトルで判定）
    const uniqueArticles = allArticles.reduce(
      (unique: CiniiArticle[], article) => {
        const isDuplicate = unique.some(
          (existing) =>
            existing.id === article.id ||
            (existing.title === article.title && existing.title.length > 0)
        );
        if (!isDuplicate) {
          unique.push(article);
        }
        return unique;
      },
      []
    );

    console.log(`重複除去後: ${uniqueArticles.length} 件の論文`);

    if (uniqueArticles.length === 0) {
      console.warn("全てのキーワードで論文が見つかりませんでした:", keywords);
      return {
        status: "success",
        themes: [],
        categories: [],
        references: [],
      };
    }

    // Step 4: 取得した論文をもとにテーマとカテゴリを生成
    const { themes, categories } = await generateThemesAndCategories(
      uniqueArticles,
      query
    );

    return {
      themes,
      references: uniqueArticles.map((a, i) => ({
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
