import { useEffect, useState } from "react";
import Loader from "../UI/Loader";

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 9; // show 12 news per page

  // Fetch health news from Mediastack
  const fetchNews = async (newOffset = 0) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `http://api.mediastack.com/v1/news?access_key=${
          import.meta.env.VITE_MEDIASTACK_API
        }&categories=health&keywords=health&languages=en&limit=30&offset=${newOffset}`
      );

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();

      if (!data.data || data.data.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      // Filter only articles with images
      const filtered = data.data.filter(
        (article) => article.image && article.image.trim() !== ""
      );

      // Limit to 12 visible
      const visibleArticles = filtered.slice(0, LIMIT);

      // Append new results
      setArticles((prev) => [...prev, ...visibleArticles]);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(0);
  }, []);

  const handleLoadMore = () => {
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
    fetchNews(newOffset);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-customPurple hover:text-blue-600 transition-colors">
          Latest Health News
        </h1>
      </header>

      {loading && articles.length === 0 ? (
        <div className="flex items-center justify-center h-screen">
          <Loader />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center mt-4">Error: {error}</p>
      ) : (
        <>
          {/* News Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {articles.length > 0 ? (
              articles.map((article, idx) => (
                <div
                  key={idx}
                  className="bg-blue-50 rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {article.description
                        ? article.description.slice(0, 100) + "..."
                        : "No summary available."}
                    </p>
                    <a
                      href={article.url}
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
              <p className="text-gray-500 text-center col-span-3">
                No health news with images available right now.
              </p>
            )}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="bg-customPurple text-white px-6 py-2 rounded-xl font-semibold shadow-md hover:bg-blue-600 transition-colors"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}

          {!hasMore && (
            <p className="text-center text-gray-500 mt-6">
              No more health news available.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default NewsFeed;
