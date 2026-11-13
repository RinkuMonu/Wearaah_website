import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiClock } from "react-icons/fi";

export default function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 42,
    seconds: 35,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          seconds = 59;
          minutes--;
        } else if (hours > 0) {
          seconds = 59;
          minutes = 59;
          hours--;
        } else if (days > 0) {
          seconds = 59;
          minutes = 59;
          hours = 23;
          days--;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-black text-white my-8 sm:my-12 border-y-2 border-[#ED1C24]">
      {/* Background with mood overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `url("/images/31.webp")`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/90" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left: Brand Announcement */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-[#ED1C24] text-white text-[11px] font-normal uppercase tracking-[0.2em] mb-3">
            <FiClock size={12} />
            <span>FLASH DEAL ENDS SOON</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-normal tracking-[0.14em] text-white mb-2 uppercase">
            BLACK FRIDAY
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 font-light tracking-wider uppercase">
            Don't miss an additional 10% off your order when you spend ₹500 or more
          </p>
        </div>

        {/* Center: Countdown Timer */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex flex-col items-center bg-neutral-900 border border-neutral-800 p-3 sm:p-4 min-w-[60px] sm:min-w-[72px]">
            <span className="text-2xl sm:text-4xl font-normal text-[#ED1C24]">
              {timeLeft.days.toString().padStart(2, "0")}
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-400 mt-1 font-normal">
              Days
            </span>
          </div>
          <span className="text-lg sm:text-2xl text-neutral-600">:</span>
          <div className="flex flex-col items-center bg-neutral-900 border border-neutral-800 p-3 sm:p-4 min-w-[60px] sm:min-w-[72px]">
            <span className="text-2xl sm:text-4xl font-normal text-[#ED1C24]">
              {timeLeft.hours.toString().padStart(2, "0")}
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-400 mt-1 font-normal">
              Hours
            </span>
          </div>
          <span className="text-lg sm:text-2xl text-neutral-600">:</span>
          <div className="flex flex-col items-center bg-neutral-900 border border-neutral-800 p-3 sm:p-4 min-w-[60px] sm:min-w-[72px]">
            <span className="text-2xl sm:text-4xl font-normal text-[#ED1C24]">
              {timeLeft.minutes.toString().padStart(2, "0")}
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-400 mt-1 font-normal">
              Mins
            </span>
          </div>
          <span className="text-lg sm:text-2xl text-neutral-600">:</span>
          <div className="flex flex-col items-center bg-neutral-900 border border-neutral-800 p-3 sm:p-4 min-w-[60px] sm:min-w-[72px]">
            <span className="text-2xl sm:text-4xl font-normal text-[#ED1C24]">
              {timeLeft.seconds.toString().padStart(2, "0")}
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-400 mt-1 font-normal">
              Secs
            </span>
          </div>
        </div>

        {/* Right: CTA */}
        <div>
          <Link
            to="/productlist?category=sale"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#ED1C24] hover:bg-white hover:text-black text-white font-medium text-xs uppercase tracking-[0.16em] transition-all"
          >
            <span>Shop Black Friday Deals &rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
