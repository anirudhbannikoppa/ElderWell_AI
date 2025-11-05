import { useEffect, useState } from "react"; // no default React import required
import Loader from "../UI/Loader";

// NewsFeed component: fetches health-related news (NewsAPI) and displays cards
const NewsFeed = () => {
  const [articles, setArticles] = useState([]); // fetched articles with images
  const [loading, setLoading] = useState(true); // loading indicator
  const [error, setError] = useState(null); // fetch / network errors

  // Fetch news from NewsAPI using Vite environment variable for the API key
  const fetchNews = async () => {
    try {
      const res = await fetch(
        `https://newsapi.org/v2/everything?q=adult+health+OR+aging+health+OR+elderly+care+OR+senior+nutrition+OR+geriatric+medicine+OR+aging+population+OR+age-related+diseases+OR+dementia+OR+senior+wellness+OR+healthcare+for+seniors&language=en&pageSize=100&sortBy=publishedAt&apiKey=${
          import.meta.env.VITE_API_NEWS_CLIENT
        }`
      );
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      // Keep only articles that include an image
      const filtered = data.articles.filter((article) => article.urlToImage);
      setArticles(filtered);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setArticles([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Render
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="text-center py-1">
        <h1 className="text-2xl font-bold text-customPurple hover:text-blue-600 transition-colors">
          Adult & Aging Health News
        </h1>
      </header>
      {loading && !error ? (
        <div className="flex items-center justify-center h-screen">
          <Loader />
        </div>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {articles.length > 0 ? (
            articles.map((article, idx) => (
              <div
                key={idx}
                className="bg-blue-50 rounded-xl shadow-md overflow-hidden"
              >
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {article.description
                      ? article.description.slice(0, 100) + "..."
                      : "No summary available."}
                  </p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm"
                  >
                    Read more →
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>No adult health news with images available right now.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
