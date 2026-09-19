import React, { useEffect, useState } from "react";
import axios from "axios";
import { ExternalLink, MapPin, Briefcase, Search, IndianRupee, Building2 } from "lucide-react";

const CITIES = ["All", "Bengaluru", "Mumbai", "Hyderabad", "Pune", "Chennai", "Gurugram"];

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

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL_NODE}/job-recommendations`)
      .then((res) => { setJobs(res.data.jobs || []); setLoading(false); })
      .catch((err) => { setError("Failed to load jobs. Make sure the backend is running."); setLoading(false); console.error(err); });
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
    <div className="min-h-screen flex items-center justify-center bg-secondary/60">
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
        <p className="text-gray-500 font-medium">Loading job recommendations…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/60">
      <p className="text-destructive font-medium">{error}</p>
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
          <p className="text-lg font-medium">No jobs match your search 😕</p>
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
                        onError={(e) => { e.target.style.display = "none"; e.target.parentNode.innerHTML = `<div style="color:#77A719;font-weight:bold;font-size:1.2rem;width:100%;height:100%;display:flex;align-items:center;justify-content:center;">${job.employer_name.charAt(0)}</div>`; }} />
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
                      🕐 Posted {relTime}
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
