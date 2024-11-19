import { NewsResponse } from '@/app/types/news';

export async function getFootballNews(): Promise<NewsResponse> {
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
  const query = encodeURIComponent(
    '(soccer OR football) AND ' +
    '(premier league OR bundesliga OR la liga OR serie a OR champions league OR world cup OR fifa OR uefa OR ' +
    'messi OR ronaldo OR haaland OR mbappe OR salah OR de bruyne OR bellingham OR vinicius)'
  );
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&language=en&apiKey=${apiKey}`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }

  return response.json();
} 