"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

export default function HomePage() {
  const [companies, setCompanies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchCompanies() {
      const res = await fetch("/api/companies");
      const json = await res.json();
      setCompanies(json.companies || []);
      setLoading(false);
    }
    fetchCompanies();
  }, []);

  // Filter companies based on search term
  const filteredCompanies = useMemo(() => {
    if (!searchTerm.trim()) return companies;
    return companies.filter((company) =>
      company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [companies, searchTerm]);

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
          {/* Header Section with Search */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              DSA Sheets by Company
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Master Data Structures & Algorithms with company-specific problem sets
            </p>
            
            {/* Search Bar */}
             <div className="max-w-md mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
              />
            </div>
          </div>

          {/* Companies Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400 text-lg">Loading companies...</p>
            </div>
          ) : (
            <>
              {searchTerm && (
                <div className="mb-6">
                  <p className="text-gray-400">
                    {filteredCompanies.length} result{filteredCompanies.length !== 1 ? 's' : ''} for "{searchTerm}"
                  </p>
                </div>
              )}
              
              {filteredCompanies.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl text-gray-300 mb-2">No companies found</h3>
                  <p className="text-gray-500">Try adjusting your search terms</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCompanies.map((company, index) => (
                    <div
                      key={company}
                      className="group"
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      <Link
                        href={`/company/${company}`}
                        className="block p-6 rounded-xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 hover:border-blue-500/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {company.toUpperCase()}
                          </h3>
                          <div className="w-2 h-2 rounded-full bg-green-500 group-hover:bg-blue-500 transition-colors"></div>
                        </div>
                        <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                          Practice problems curated for {company}
                        </p>
                        <div className="mt-4 flex items-center text-xs text-gray-500 group-hover:text-blue-400 transition-colors">
                          <span>Start practicing</span>
                          <svg className="ml-1 w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}