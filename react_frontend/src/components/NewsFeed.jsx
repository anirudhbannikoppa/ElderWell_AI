import { useEffect, useState } from "react";
import Loader from "../UI/Loader";

// NewsFeed component: fetches health-related news (NewsData.io) and displays cards
const NewsFeed = () => {
  const [articles, setArticles] = useState([]); // fetched articles with images
  const [loading, setLoading] = useState(true); // loading indicator
  const [error, setError] = useState(null); // fetch / network errors

  // Fetch news from NewsData.io using Vite environment variable for the API key
  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://newsdata.io/api/1/news?apikey=${
          import.meta.env.VITE_NEWS_DATA_API
        }&q=health,fitness,medical,aging,elderly&language=en`
      );

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();

      // NewsData.io returns 'results' instead of 'articles'
      const filtered = (data.results || []).filter(
        (article) => article.image_url
      );
      setArticles(filtered.slice(0, 9)); // limit to 9 for 3x3 grid
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setArticles([]);
      setLoading(false);
    }
  };

  // Load news on mount
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

      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center mt-4">Error: {error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {articles.length > 0 ? (
            articles.map((article, idx) => (
              <div
                key={idx}
                className="bg-blue-50 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={article.image_url}
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
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm font-medium hover:underline"
                  >
                    Read more →
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No adult health news with images available right now.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
