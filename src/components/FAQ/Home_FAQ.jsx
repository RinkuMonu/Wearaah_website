import { useState, useEffect } from "react";
import api from "../service/axios";

export default function Home_FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      setOpenId(null);
      try {
        const res = await api.get(`/faq?category=General`);
        const active = (res.data?.faqs || []).filter((f) => f.isActive);
        setFaqs(active);
      } catch (err) {
        console.error("FAQ fetch error:", err);
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="px-6 lg:px-16 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-16 items-start max-w-6xl mx-auto">

        {/* Left — sticky label */}
        <div className="lg:sticky lg:top-24">
          <p className="text-xs font-semibold tracking-widest text-[#b08a5e] uppercase mb-3">
            Support
          </p>
          <h2 className="text-3xl font-bold text-gray-900 leading-snug mb-4">
            Got questions?<br />We've got answers.
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-7">
            Everything you need to know about shopping with us. Can't find what
            you're looking for? Reach out to our team.
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 border border-gray-100 bg-gray-50 px-4 py-2 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-[#d6b28a]" />
            {loading ? "Loading..." : `${faqs.length} questions`}
          </div>
        </div>

        {/* Right — accordion */}
        <div className="divide-y divide-gray-100 border-t border-gray-100">
          {loading ? (
            <div className="flex items-center gap-3 py-8 text-gray-400 text-sm">
              <div className="w-4 h-4 border-2 border-gray-200 border-t-[#d6b28a] rounded-full animate-spin" />
              Loading questions...
            </div>
          ) : faqs.length === 0 ? (
            <p className="py-10 text-sm text-gray-400 text-center">
              No questions available right now.
            </p>
          ) : (
            faqs.map((faq) => {
              const isOpen = openId === faq._id;
              return (
                <div key={faq._id}>
                  <button
                    onClick={() => toggle(faq._id)}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                  >
                    <span
                      className={`text-[15px] font-medium transition-colors ${
                        isOpen ? "text-[#b08a5e]" : "text-gray-900 group-hover:text-[#b08a5e]"
                      }`}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        isOpen
                          ? "bg-[#d6b28a] border-[#d6b28a]"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <svg
                        className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke={isOpen ? "#4a2e0c" : "#9ca3af"}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="2,4 6,8 10,4" />
                      </svg>
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-96 pb-5" : "max-h-0"
                    }`}
                  >
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}