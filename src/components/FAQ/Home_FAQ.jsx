import { useState, useEffect } from "react";
import api from "../service/axios";
import { FiChevronDown, FiHelpCircle, FiMail } from "react-icons/fi";

const DEFAULT_FAQS = [
  {
    _id: "faq-1",
    question: "What is Wearaah's standard delivery timeframe and shipping policy?",
    answer:
      "We offer complimentary express delivery across India on all prepaid orders. Typical delivery takes 2 to 4 business days in metro cities and 3 to 6 days across other regions. Each order is dispatched in luxury protective packaging with real-time tracking.",
  },
  {
    _id: "faq-2",
    question: "How do returns and exchanges work?",
    answer:
      "Wearaah provides a seamless 7-day doorstep return and size exchange policy. Items must be unworn, unwashed, and retained with original tags intact. You can initiate a return or exchange directly from your account dashboard or by contacting our concierge.",
  },
  {
    _id: "faq-3",
    question: "Are all garments 100% authentic and designer certified?",
    answer:
      "Every single garment hosted on Wearaah is guaranteed 100% authentic. We source exclusively from verified designer houses, master weavers, and certified luxury manufacturers with strict multi-point fabric and stitching inspections.",
  },
  {
    _id: "faq-4",
    question: "How can I ensure accurate sizing before purchasing?",
    answer:
      "Each product page includes our comprehensive Sartorial Size Guide with exact chest, shoulder, waist, and length measurements in both inches and centimeters. If you are between sizes, our stylists recommend ordering your standard tailored fit or reaching out to our concierge for bespoke guidance.",
  },
  {
    _id: "faq-5",
    question: "Which payment options and EMI plans are accepted?",
    answer:
      "We support all major payment methods including UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards (Visa, MasterCard, Amex), Net Banking across 50+ banks, interest-free EMI options, and Cash on Delivery (COD) on eligible pin codes.",
  },
];

export default function Home_FAQ() {
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [openId, setOpenId] = useState(DEFAULT_FAQS[0]._id);

  useEffect(() => {
    let isMounted = true;
    const fetchFaqs = async () => {
      try {
        const res = await api.get(`/faq?category=General`);
        const active = (res.data?.faqs || []).filter((f) => f.isActive);
        if (isMounted && active.length > 0) {
          setFaqs(active);
          setOpenId(active[0]._id);
        }
      } catch (err) {
        // Silently preserve default luxury FAQs on API latency
      }
    };
    fetchFaqs();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="py-12 sm:py-16 bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-16 items-start">
          {/* Left Sticky Info Column */}
          <div className="lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 text-[11px] font-normal tracking-[0.2em] text-[#ED1C24] uppercase mb-2">
              <FiHelpCircle size={14} />
              <span>SUPPORT & ASSISTANCE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-normal text-neutral-900 leading-snug mb-3 uppercase tracking-[0.1em]">
              Got questions?<br />We've got answers.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed mb-8">
              Everything you need to know about shopping with us. Can't find what you're looking for? Reach out to our team.
            </p>

            <div className="p-6 bg-neutral-50 border border-neutral-200">
              <h4 className="text-xs font-medium uppercase tracking-wider text-black mb-1">
                Need Help with Sizing or Orders?
              </h4>
              <p className="text-xs text-neutral-500 mb-4 font-normal">
                Our customer assistance team is available Monday through Saturday.
              </p>
              <a
                href="mailto:support@wearaah.com"
                className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#ED1C24] hover:underline"
              >
                <FiMail size={14} />
                <span>support@wearaah.com</span>
              </a>
            </div>
          </div>

          {/* Right Accordion */}
          <div className="divide-y divide-neutral-100 border border-neutral-200 bg-white p-6 sm:p-8">
            {faqs.map((faq) => {
              const isOpen = openId === faq._id;
              return (
                <div key={faq._id} className="py-4 first:pt-0 last:pb-0">
                  <button
                    onClick={() => toggle(faq._id)}
                    className="w-full flex items-center justify-between gap-4 text-left group cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`text-sm font-normal transition-colors ${
                        isOpen
                          ? "text-[#ED1C24]"
                          : "text-neutral-800 group-hover:text-black"
                      }`}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={`w-6 h-6 border flex items-center justify-center shrink-0 transition-all ${
                        isOpen
                          ? "bg-[#ED1C24] border-[#ED1C24] text-white rotate-180"
                          : "border-neutral-300 bg-white text-neutral-600 group-hover:border-black group-hover:text-black"
                      }`}
                    >
                      <FiChevronDown size={13} />
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-96 pt-3" : "max-h-0"
                    }`}
                  >
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
