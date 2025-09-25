"use client";

import { useState, useEffect, useMemo ,use} from "react";
import Link from "next/link";

export default function CompanyPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  const [timeframe, setTimeframe] = useState("six-months");
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/questions?company=${name}&timeframe=${timeframe}`)
      .then((res) => res.json())
      .then((data) => {
        // Ensure data is always an array
        if (Array.isArray(data)) {
          setQuestions(data);
        } else if (data && Array.isArray(data.questions)) {
          setQuestions(data.questions);
        } else {
          setQuestions([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching questions:', error);
        setQuestions([]);
        setLoading(false);
      });
  }, [timeframe, name]);

  // Filter questions based on search and difficulty
  const filteredQuestions = useMemo(() => {
    // Ensure questions is an array before filtering
    if (!Array.isArray(questions)) return [];
    
    return questions.filter((q) => {
      if (!q || typeof q !== 'object') return false;
      
      const title = q.Title || '';
      const difficulty = q.Difficulty || '';
      
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficultyFilter === "all" || difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });
  }, [questions, searchTerm, difficultyFilter]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "medium":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "hard":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getFrequencyBarColor = (frequency: string) => {
    const freq = parseFloat(frequency) || 0;
    if (freq >= 70) return "bg-green-500";
    if (freq >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Transparent Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
              DSA Sheets
            </Link>
            <div className="flex items-center space-x-4">
              <button className="text-gray-300 hover:text-white transition-colors">
                About
              </button>
              <button className="text-gray-300 hover:text-white transition-colors">
                Contact
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors mr-2">
                <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <span className="text-gray-400">Back to Companies</span>
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {decodeURIComponent(name)} Questions
            </h1>
            <p className="text-gray-400">
              {loading ? "Loading questions..." : `${filteredQuestions.length} questions available`}
            </p>
          </div>

          {/* Filters Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Search */}
              <div className="max-w-md  relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search Questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
              />
            </div>

            {/* Timeframe Filter */}
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
            >
              <option value="all">All Time</option>
              <option value="six-months">Last 6 Months</option>
              <option value="three-months">Last 3 Months</option>
              <option value="thirty-days">Last 30 Days</option>
              <option value="more-than-six-months">More than 6 Months</option>
            </select>

            {/* Difficulty Filter */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400 text-lg">Loading questions...</p>
            </div>
          ) : (
            <>
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl text-gray-300 mb-2">No questions found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-800/50">
                        <tr>
                          <th className="text-left p-4 text-gray-300 font-semibold">Question Title</th>
                          <th className="text-center p-4 text-gray-300 font-semibold">Difficulty</th>
                          <th className="text-center p-4 text-gray-300 font-semibold">Acceptance</th>
                          <th className="text-center p-4 text-gray-300 font-semibold">Frequency</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredQuestions.map((q, idx) => (
                          <tr key={idx} className="border-t border-gray-700/30 hover:bg-gray-800/30 transition-colors">
                            <td className="p-4">
                              <a
                                href={q.URL || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                              >
                                {q.Title || 'Untitled Question'}
                              </a>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(q.Difficulty || '')}`}>
                                {q.Difficulty || 'Unknown'}
                              </span>
                            </td>
                            <td className="p-4 text-center text-gray-300">{q["Acceptance %"] || 'N/A'}</td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <div className="w-16 bg-gray-700 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${getFrequencyBarColor(q["Frequency %"] || '0')}`}
                                    style={{ width: `${Math.min(100, parseFloat(q["Frequency %"]) || 0)}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-300">{q["Frequency %"] || '0%'}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="lg:hidden">
                    {filteredQuestions.map((q, idx) => (
                      <div key={idx} className="p-4 border-b border-gray-700/30 last:border-b-0">
                        <div className="mb-3">
                          <a
                            href={q.URL || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors font-medium text-lg"
                          >
                            {q.Title || 'Untitled Question'}
                          </a>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(q.Difficulty || '')}`}>
                            {q.Difficulty || 'Unknown'}
                          </span>
                          <span className="text-gray-400">Acceptance: {q["Acceptance %"] || 'N/A'}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400">Frequency:</span>
                            <div className="w-12 bg-gray-700 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${getFrequencyBarColor(q["Frequency %"] || '0')}`}
                                style={{ width: `${Math.min(100, parseFloat(q["Frequency %"]) || 0)}%` }}
                              />
                            </div>
                            <span className="text-gray-300">{q["Frequency %"] || '0%'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}