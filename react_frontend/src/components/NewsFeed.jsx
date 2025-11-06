import { useEffect, useState } from "react";
import Loader from "../UI/Loader";

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const apiKey = import.meta.env.VITE_NEWSDATA_API;
      if (!apiKey) throw new Error("Missing API key");

      const res = await fetch(
        `https://newsdata.io/api/1/news?apikey=${apiKey}&category=health&language=en`
      );

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();
      if (data.status !== "success" || !data.results)
        throw new Error("No results found");

      const withImages = data.results.filter((a) => a.image_url && a.title);
      setArticles(withImages.slice(0, 12));
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );

  if (error)
    return <p className="text-red-500 text-center mt-4">Error: {error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-customPurple mb-6">
        Latest Health News
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {articles.map((a, idx) => (
          <div
            key={idx}
            className="bg-blue-50 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
          >
            <img
              src={a.image_url}
              alt={a.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{a.title}</h3>
              <p className="text-sm text-gray-600 mb-3">
                {a.description
                  ? a.description.slice(0, 100) + "..."
                  : "No summary available."}
              </p>
              <a
                href={a.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-sm font-medium hover:underline"
              >
                Read more →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
