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
      return;
    }

    // Fetch news
    const news = await fetchFootballNews();

    if (news.length === 0) {
      console.log("No news found for today");
      return;
    }

    const emailContent = formatNewsletterHTML(news);

    // Send newsletter to each subscriber
    for (const subscriber of subscribers) {
      try {
        await sgMail.send({
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
        });

        console.log(`Newsletter sent successfully to ${subscriber.email}`);

        // Add delay between emails to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(
          `Failed to send newsletter to ${subscriber.email}:`,
          error
        );
      }
    }

    console.log("Newsletter sending process completed");
  } catch (error) {
    console.error("Newsletter sending failed:", error);
  }
}
export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  console.debug("Authorization header received:", authHeader); // Debugging step
  console.debug("CRON_SECRET:", process.env.CRON_SECRET); // Debugging step

  if (authHeader !== `${process.env.CRON_SECRET}`) {
    console.warn("Unauthorized access attempt detected."); // Logging step
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    console.info("Attempting to send newsletter..."); // Logging step
    await sendNewsletter();
    console.info("Newsletter sent successfully."); // Logging step
    return new Response("Newsletter sent successfully", { status: 200 });
  } catch (error) {
    console.error("Newsletter sending failed:", error); // Logging step
    return new Response("Failed to send newsletter", { status: 500 });
  }
}
