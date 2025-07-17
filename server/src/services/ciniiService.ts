import fetch from "node-fetch";
import { config } from "../config";

const CINII_API_URL = "https://cir.nii.ac.jp/opensearch/articles";
const CINII_DETAIL_API_URL = "https://cir.nii.ac.jp/opensearch/articles";
const { CINII_API_KEY } = config();

import { CiniiArticle } from "../types";

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
  return items.map((entry: any) => ({
    id: entry["@id"] || "",
    title: entry.title || "",
    author: Array.isArray(entry["dc:creator"])
      ? entry["dc:creator"].map((a: any) => a.name || a).join(", ")
      : entry["dc:creator"]?.name || entry["dc:creator"] || "",
    year: entry["prism:publicationDate"]
      ? entry["prism:publicationDate"].slice(0, 4)
      : "",
    abstract: "",
    url: entry.link?.["@id"] || "",
  }));
}

// 論文IDで詳細情報を取得
export async function getCiniiArticleDetail(
  id: string
): Promise<CiniiArticle | null> {
  let crid = id;
  if (/^https?:\/\//.test(id)) {
    const match = id.match(/crid\/([0-9A-Za-z]+)/);
    crid = match ? match[1] : id;
  }
  if (crid.startsWith("crid:")) {
    crid = crid.replace(/^crid:/, "");
  }
  // articles APIでcrid検索
  const url = `${CINII_DETAIL_API_URL}?appId=${CINII_API_KEY}&q=crid:${encodeURIComponent(
    crid
  )}&format=json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`CiNii API detail error: ${res.status} ${res.statusText}`);
  }
  const json: any = await res.json();
  const entry = json?.items?.[0];
  if (!entry) return null;
  return {
    id: entry["@id"] || "",
    title: entry.title || "",
    author: Array.isArray(entry["dc:creator"])
      ? entry["dc:creator"].map((a: any) => a.name || a).join(", ")
      : entry["dc:creator"]?.name || entry["dc:creator"] || "",
    year: entry["prism:publicationDate"]
      ? entry["prism:publicationDate"].slice(0, 4)
      : "",
    abstract: entry["description"] || "",
    url: entry.link?.["@id"] || "",
  };
}
