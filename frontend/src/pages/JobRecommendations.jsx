import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "@/components/Toast";
import { ExternalLink, MapPin, Briefcase, Search, IndianRupee, Building2, TriangleAlert } from "lucide-react";

const CITIES = ["All", "Bengaluru", "Mumbai", "Hyderabad", "Pune", "Chennai", "Gurugram"];

/* Curated sample listings shown when the live job API is unavailable
   (quota exhausted, key missing, or network down). Clearly labeled as
   sample data — never presented as live listings. */
const SAMPLE_JOBS = [
  {
    job_title: "Frontend Engineer",
    employer_name: "Razorpay",
    job_city: "Bengaluru",
    job_country: "India",
    job_employment_type: "FULLTIME",
    job_min_salary: 1800000,
    job_max_salary: 2800000,
    job_description: "Build customer-facing payment flows in React with a focus on performance and accessibility.",
    job_apply_link: "https://razorpay.com/jobs",
    job_posted_at_datetime_utc: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    job_title: "Backend Developer",
    employer_name: "Zerodha",
    job_city: "Pune",
    job_country: "India",
    job_employment_type: "FULLTIME",
    job_min_salary: 1500000,
    job_max_salary: 2500000,
    job_description: "Design low-latency trading APIs and services at scale using Node.js and PostgreSQL.",
    job_apply_link: "https://zerodha.com/careers",
    job_posted_at_datetime_utc: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    job_title: "Full Stack Developer",
    employer_name: "CRED",
    job_city: "Hyderabad",
    job_country: "India",
    job_employment_type: "FULLTIME",
    job_min_salary: 2000000,
    job_max_salary: 3200000,
    job_description: "Ship features end-to-end across a React + Node stack for India's most design-led credit platform.",
    job_apply_link: "https://careers.cred.club",
    job_posted_at_datetime_utc: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    job_title: "Software Engineer",
    employer_name: "Flipkart",
    job_city: "Bengaluru",
    job_country: "India",
    job_employment_type: "FULLTIME",
    job_min_salary: 1600000,
    job_max_salary: 2600000,
    job_description: "Work on large-scale e-commerce systems — search, cart, and checkout flows for 400M+ users.",
    job_apply_link: "https://flipkartcareers.com",
    job_posted_at_datetime_utc: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
];

const formatCTC = (min, max) => {
  if (!min && !max) return null;
  const toL = (n) => `₹${(n / 100000).toFixed(0)}L`;
  if (min && max) return `${toL(min)} – ${toL(max)} / yr`;
  if (max) return `Up to ${toL(max)} / yr`;
  return `From ${toL(min)} / yr`;
};

const JobRecommendations = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingSample, setUsingSample] = useState(false);

  const loadJobs = () => {
    setLoading(true);
    setError(null);
    setUsingSample(false);
    axios.get(`${import.meta.env.VITE_API_URL_NODE}/job-recommendations`)
      .then((res) => {
        const list = res.data.jobs || [];
        setJobs(list);
        setUsingSample(false);
        setLoading(false);
      })
      .catch((err) => {
        // Live API unavailable (quota/key/network) — fall back to clearly
        // labeled sample listings so the page stays useful.
        const detail = err?.response?.data?.error || err?.response?.data?.message;
        setJobs(SAMPLE_JOBS);
        setUsingSample(true);
        setError(null);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const filtered = jobs.filter((job) => {
    const q = search.toLowerCase();
    const matchSearch = !q || job.job_title.toLowerCase().includes(q) || job.employer_name.toLowerCase().includes(q) ||
      job.job_city?.toLowerCase().includes(q) || job.job_description?.toLowerCase().includes(q);
    const matchCity = cityFilter === "All" || job.job_city === cityFilter;
    return matchSearch && matchCity;
  });

  const getRelativeTime = (dateStr) => {
    if (!dateStr) return null;
    const now = new Date();
    const posted = new Date(dateStr);
    const diffMs = now - posted;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  };

  const isNew = (dateStr) => {
    if (!dateStr) return false;
    const diffDays = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  if (loading) return (
    <div className="min-h-screen p-6 md:p-8 space-y-6 bg-secondary/60">
      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        <div className="skeleton h-10 w-10 rounded-xl" />
        <div className="skeleton h-8 w-72" />
      </div>
      <div className="skeleton h-4 w-56" />
      {/* Filter skeleton */}
      <div className="flex gap-3">
        <div className="skeleton h-10 flex-1 rounded-full" />
        <div className="skeleton h-10 w-24 rounded-full" />
      </div>
      {/* Card skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card-real p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="skeleton h-12 w-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-5/6" />
            <div className="skeleton h-9 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/60 p-6">
      <div className="card-real max-w-md w-full p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE2E2] text-[#B91C1C]">
          <Briefcase size={20} strokeWidth={1.8} />
        </div>
        <h2 className="text-display text-xl font-bold text-ink">Couldn't load jobs</h2>
        <p className="mt-2 text-[13px] leading-relaxed text-black/60">{error}</p>
        <button
          onClick={loadJobs}
          className="mt-6 h-10 rounded-full bg-ink px-6 text-[13px] font-semibold text-white shadow-real-sm transition-all hover:-translate-y-px hover:bg-black"
        >
          Try again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6 bg-secondary/60">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-ink">Job Recommendations</h1>
        </div>
        <p className="text-gray-500 text-sm mt-1">
          <span className="font-bold text-primary">{filtered.length}</span> openings at top Indian tech companies
        </p>
        {usingSample && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[13px] text-amber-800">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Live job service is unavailable right now — showing <strong>sample listings</strong> so you can explore the
              experience. Real listings return automatically when the service recovers.
            </span>
          </div>
        )}
      </div>

      {/* Search + City Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, company or skill…"
            className="w-full pl-9 pr-4 py-2.5 rounded-full text-sm text-ink placeholder-gray-400 bg-white border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CITIES.map((city) => (
            <button key={city} onClick={() => setCityFilter(city)}
              className={`px-3 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                cityFilter === city
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-primary/40 hover:text-ink"
              }`}>
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Job Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No jobs match your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((job, i) => {
            const ctc = formatCTC(job.job_min_salary, job.job_max_salary);
            const relTime = getRelativeTime(job.job_posted_at_datetime_utc);
            const jobIsNew = isNew(job.job_posted_at_datetime_utc);

            return (
              <div key={i}
                className={`flex flex-col rounded-2xl bg-white transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl ${
                  jobIsNew ? "border border-primary shadow-md shadow-primary/10" : "border border-gray-200/70 shadow-sm"
                }`}>

                {/* Card Header */}
                <div className="p-5 flex items-start gap-4 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden bg-secondary border border-gray-100">
                    {job.employer_logo ? (
                      <img src={job.employer_logo} alt={job.employer_name} className="w-full h-full object-contain p-1"
                        onError={(e) => { e.target.style.display = "none"; e.target.parentNode.innerHTML = `<div style="color:#3A5A1E;font-weight:bold;font-size:1.2rem;width:100%;height:100%;display:flex;align-items:center;justify-content:center;">${job.employer_name.charAt(0)}</div>`; }} />
                    ) : (
                      <div className="font-bold text-xl text-primary">{job.employer_name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-base font-bold text-ink leading-tight line-clamp-2">{job.job_title}</h2>
                      {jobIsNew && (
                        <span className="flex-shrink-0 text-[10px] font-extrabold px-2 py-0.5 rounded-full tracking-widest bg-primary-bright text-ink">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold mt-0.5 flex items-center gap-1 text-primary">
                      <Building2 className="w-3.5 h-3.5" />{job.employer_name}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-secondary text-gray-500">
                      <MapPin className="w-3 h-3" />{job.job_city}, {job.job_country}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium capitalize bg-primary-tint text-primary">
                      {job.job_employment_type?.toLowerCase().replace("_", " ")}
                    </span>
                  </div>
                  {ctc && (
                    <p className="flex items-center gap-1 text-sm font-semibold text-teal-700">
                      <IndianRupee className="w-3.5 h-3.5" />{ctc}
                    </p>
                  )}
                  {job.job_description && <p className="text-xs line-clamp-3 leading-relaxed text-gray-500">{job.job_description}</p>}
                  {relTime && (
                    <p className="text-xs font-medium text-gray-400">
                      Posted {relTime}
                    </p>
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-5 pb-5">
                  <a href={job.job_apply_link} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-sm font-bold bg-ink text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg">
                    Apply Now <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobRecommendations;
