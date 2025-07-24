import fetch from "node-fetch";
import { config } from "../config";

const CINII_API_URL = "https://cir.nii.ac.jp/opensearch/articles";
const CINII_DETAIL_API_URL = "https://cir.nii.ac.jp/opensearch/articles";
const { CINII_API_KEY } = config();

import { CiniiArticle } from "../types";

// HTMLタグを除去するユーティリティ関数
function stripHtmlTags(html: string): string {
  if (!html) return "";
  
  return html
    .replace(/<[^>]*>/g, "") // HTMLタグを除去
    .replace(/&nbsp;/g, " ") // &nbsp;をスペースに変換
    .replace(/&amp;/g, "&") // &amp;を&に変換
    .replace(/&lt;/g, "<") // &lt;を<に変換
    .replace(/&gt;/g, ">") // &gt;を>に変換
    .replace(/&quot;/g, '"') // &quot;を"に変換
    .replace(/&#x27;/g, "'") // &#x27;を'に変換
    .replace(/\s+/g, " ") // 連続する空白を単一のスペースに変換
    .trim(); // 前後の空白を除去
}

export async function searchCiniiArticles(
  query: string,
  count = 5
): Promise<CiniiArticle[]> {
  const url = `${CINII_API_URL}?appId=${CINII_API_KEY}&q=${encodeURIComponent(
    query
  )}&count=${count}&format=json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`CiNii API error: ${res.status} ${res.statusText}`);
  }
  const json: any = await res.json();

  const items = json?.items || [];

  // 必要な情報のみ抽出
  return items.map((entry: any) => {
    const article = {
      id: entry["@id"] || "",
      title: entry.title || "",
      author: Array.isArray(entry["dc:creator"])
        ? entry["dc:creator"].map((a: any) => a.name || a).join(", ")
        : entry["dc:creator"]?.name || entry["dc:creator"] || "",
      year: entry["prism:publicationDate"]
        ? entry["prism:publicationDate"].slice(0, 4)
        : "",
      abstract: stripHtmlTags(entry["description"] || ""),
      url: entry.link?.["@id"] || "",
    };
    console.log(`[CiNii SEARCH DEBUG] Article ID: "${article.id}", Title: "${article.title}"`);
    return article;
  });
}

// 論文IDで詳細情報を取得
export async function getCiniiArticleDetail(
  id: string
): Promise<CiniiArticle | null> {
  console.log(`[CiNii DEBUG] Original ID: "${id}"`);
  
  // 方法1: IDがURLの場合は直接そのURLを使用
  if (/^https?:\/\//.test(id)) {
    console.log(`[CiNii DEBUG] ID is URL, trying direct access: ${id}`);
    try {
      const res = await fetch(id);
      if (res.ok) {
        console.log(`[CiNii DEBUG] Direct URL access successful`);
        // CiNiiの詳細ページから情報を抽出する必要があるが、
        // ここでは別の方法を試す
      }
    } catch (err) {
      console.log(`[CiNii DEBUG] Direct URL access failed:`, err);
    }
  }
  
  // 方法2: フルURLから詳細情報を取得（フロントエンドから元のIDを受け取る）
  // まず、元の検索結果から同じ論文を再検索
  let crid = id;
  if (/^https?:\/\//.test(id)) {
    const match = id.match(/crid\/([0-9A-Za-z]+)/);
    crid = match ? match[1] : id;
    console.log(`[CiNii DEBUG] Extracted from URL - crid: "${crid}"`);
  }
  if (crid.startsWith("crid:")) {
    crid = crid.replace(/^crid:/, "");
    console.log(`[CiNii DEBUG] Removed crid prefix - crid: "${crid}"`);
  }
  
  // 方法3: IDで直接検索（従来の方法）
  let url = `${CINII_DETAIL_API_URL}?appId=${CINII_API_KEY}&q=crid:${encodeURIComponent(
    crid
  )}&format=json`;
  console.log(`[CiNii DEBUG] Method 3 - Request URL: ${url}`);
  
  let res = await fetch(url);
  if (!res.ok) {
    console.log(`[CiNii DEBUG] API Error: ${res.status} ${res.statusText}`);
    throw new Error(`CiNii API detail error: ${res.status} ${res.statusText}`);
  }
  let json: any = await res.json();
  console.log(`[CiNii DEBUG] Method 3 - API Response - Items count: ${json?.items?.length || 0}`);
  
  let entry = json?.items?.[0];
  
  // 方法4: CRIDなしで検索
  if (!entry) {
    console.log(`[CiNii DEBUG] Method 4 - Trying without crid prefix`);
    url = `${CINII_DETAIL_API_URL}?appId=${CINII_API_KEY}&q=${encodeURIComponent(
      crid
    )}&format=json`;
    console.log(`[CiNii DEBUG] Method 4 - Request URL: ${url}`);
    
    res = await fetch(url);
    if (res.ok) {
      json = await res.json();
      console.log(`[CiNii DEBUG] Method 4 - API Response - Items count: ${json?.items?.length || 0}`);
      entry = json?.items?.[0];
    }
  }
  
  if (!entry) {
    console.log(`[CiNii DEBUG] All methods failed, no entry found`);
    return null;
  }
  return {
    id: entry["@id"] || "",
    title: entry.title || "",
    author: Array.isArray(entry["dc:creator"])
      ? entry["dc:creator"].map((a: any) => a.name || a).join(", ")
      : entry["dc:creator"]?.name || entry["dc:creator"] || "",
    year: entry["prism:publicationDate"]
      ? entry["prism:publicationDate"].slice(0, 4)
      : "",
    abstract: stripHtmlTags(entry["description"] || ""),
    url: entry.link?.["@id"] || "",
  };
}
