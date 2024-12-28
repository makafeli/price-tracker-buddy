import { useQuery } from "@tanstack/react-query";
import { Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
}

// Fallback data in case the API fails
const fallbackNews: NewsItem[] = [
  {
    title: "Domain Industry Updates Temporarily Unavailable",
    link: "https://domainnamewire.com",
    pubDate: new Date().toLocaleDateString(),
  },
  {
    title: "Check Back Later for Latest Domain News",
    link: "http://www.dnjournal.com",
    pubDate: new Date().toLocaleDateString(),
  },
];

async function fetchRSSFeeds() {
  try {
    const feeds = [
      'https://domainnamewire.com/feed/',
      'http://www.dnjournal.com/rss.xml'
    ];
    
    const responses = await Promise.allSettled(
      feeds.map(feed => 
        fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}`, {
          headers: {
            'Accept': 'application/json',
          },
        })
          .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          })
      )
    );

    const successfulResponses = responses
      .filter((response): response is PromiseFulfilledResult<any> => 
        response.status === 'fulfilled' && response.value?.items
      )
      .map(response => response.value);

    if (successfulResponses.length === 0) {
      console.warn('No successful RSS feeds fetched, using fallback data');
      return fallbackNews;
    }

    const allItems = successfulResponses.flatMap(response => 
      response.items?.map((item: any) => ({
        title: item.title,
        link: item.link,
        pubDate: new Date(item.pubDate).toLocaleDateString()
      })) || []
    );

    return allItems.sort((a, b) => 
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    ).slice(0, 6);
  } catch (error) {
    console.error('Error fetching RSS feeds:', error);
    return fallbackNews;
  }
}

export const NewsSection = () => {
  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news'],
    queryFn: fetchRSSFeeds,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-7xl mx-auto mt-12">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Unable to load news feed. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-12 px-4">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Latest Domain News</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news?.map((item: NewsItem) => (
          <a
            key={item.link}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-lg border border-input bg-card hover:bg-accent/50 transition-colors group"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.pubDate}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};