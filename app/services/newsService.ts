import { NewsResponse } from "@/app/types/news";

export async function getFootballNews(category?: string): Promise<NewsResponse> {
  const apiKey = process.env.NEXT_PUBLIC_GNEWS_API_KEY;
  
  // Combine "football" with the additional category if provided
  const searchTerm = category ? `european football ${category}` : "european football and soccer";
  const query = encodeURIComponent(searchTerm);

  const response = await fetch(
    `https://gnews.io/api/v4/search?q=${query}&lang=en&sortby=publishedAt&apikey=${apiKey}`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      `Failed to fetch news: ${response.status} ${response.statusText}` +
        (errorData ? ` - ${JSON.stringify(errorData)}` : "")
    );
  }

  const data = await response.json();

  if (!data || !data.articles) {
    throw new Error(`Invalid API response structure: ${JSON.stringify(data)}`);
  }

  return {
    articles: data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.image,
      publishedAt: article.publishedAt,
      source: {
        name: article.source.name,
      },
    })),
  };
}
