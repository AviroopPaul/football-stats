import clientPromise from "../../../lib/mongodb";
import sgMail from "@sendgrid/mail";
import { format } from "date-fns";
import { getFootballNews } from "../../services/newsService";

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("Missing SENDGRID_API_KEY");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface NewsItem {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

async function fetchFootballNews(): Promise<NewsItem[]> {
  const response = await getFootballNews();
  return response.articles;
}

function formatNewsletterHTML(news: NewsItem[]): string {
  const today = format(new Date(), "MMMM do, yyyy");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .header { background-color: #059669; color: white; padding: 20px; text-align: center; }
          .news-item { margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
          .news-item img { max-width: 100%; height: auto; margin-bottom: 10px; }
          .news-item h2 { margin: 10px 0; color: #1a1a1a; }
          .news-item .source { color: #666; font-size: 0.9em; }
          .news-item .description { margin: 10px 0; }
          .news-item .read-more { color: #059669; text-decoration: none; }
          .footer { text-align: center; padding: 20px; font-size: 0.8em; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>FootStats Daily Newsletter</h1>
          <p>${today}</p>
        </div>
        
        ${news
          .map(
            (item) => `
          <div class="news-item">
            ${
              item.urlToImage
                ? `<img src="${item.urlToImage}" alt="${item.title}">`
                : ""
            }
            <h2>${item.title}</h2>
            <div class="source">Source: ${item.source.name} | ${format(
              new Date(item.publishedAt),
              "MMM do, h:mm a"
            )}</div>
            <div class="description">${item.description}</div>
            <a href="${item.url}" class="read-more">Read more →</a>
          </div>
        `
          )
          .join("")}
        
        <div class="footer">
          <p>You're receiving this email because you subscribed to FootStats Newsletter.</p>
          <p>To unsubscribe, <a href="[Unsubscribe_Link]">click here</a></p>
        </div>
      </body>
    </html>
  `;
}

async function sendNewsletter() {
  try {
    console.log("Starting newsletter sending process...");

    const client = await clientPromise;
    const db = client.db("football-newsletter");

    // Get all subscribers
    const subscribers = await db.collection("subscribers").find({}).toArray();

    if (subscribers.length === 0) {
      console.log("No subscribers found");
      return { success: true, message: "No subscribers found" };
    }

    // Fetch news
    const news = await fetchFootballNews();

    if (news.length === 0) {
      console.log("No news found for today");
      return { success: true, message: "No news found for today" };
    }

    const emailContent = formatNewsletterHTML(news);

    // Process subscribers in batches of 10
    const batchSize = 10;
    const results = [];

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      const emailPromises = batch.map(subscriber => 
        sgMail.send({
          to: subscriber.email,
          from: {
            email: "apavirooppaul10@gmail.com",
            name: "FootStats",
          },
          subject: `FootStats Daily Newsletter - ${format(
            new Date(),
            "MMMM do, yyyy"
          )}`,
          html: emailContent,
        }).catch(error => ({
          error: true,
          email: subscriber.email,
          message: error.message
        }))
      );

      const batchResults = await Promise.all(emailPromises);
      results.push(...batchResults);
    }

    const successCount = results.filter(r => !r.error).length;
    const failureCount = results.filter(r => r.error).length;

    return {
      success: true,
      message: `Newsletter sent to ${successCount} subscribers, ${failureCount} failed`,
      results
    };
  } catch (error) {
    console.error("Newsletter sending failed:", error);
    return { success: false, error: error.message };
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const result = await sendNewsletter();
    return new Response(JSON.stringify(result), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
