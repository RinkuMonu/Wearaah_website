import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiStar, FiEdit3, FiTrash2, FiThumbsUp, FiX,
  FiChevronLeft, FiChevronRight, FiPackage, FiAlertCircle,
  FiCheck, FiLoader,
} from "react-icons/fi";
import api from "../components/service/axios";
import { useAuth } from "../components/service/AuthContext";

/* ─── Star display ─────────────────────────────────────────── */
const Stars = ({ rating, size = 13 }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <FiStar
        key={s}
        size={size}
        className={
          s <= Math.round(rating)
            ? "fill-amber-400 text-amber-400"
            : "text-gray-200 fill-gray-200"
        }
      />
    ))}
  </div>
);

/* ─── Star picker ──────────────────────────────────────────── */
const StarPicker = ({ value, onChange, size = 24 }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        type="button"
        onClick={() => onChange(s)}
        className="transition-transform hover:scale-110 focus:outline-none"
      >
        <FiStar
          size={size}
          className={`transition-colors ${
            s <= value
              ? "fill-amber-400 text-amber-400"
              : "text-gray-300 hover:text-amber-300"
          }`}
        />
      </button>
    ))}
  </div>
);

/* ─── Toast ────────────────────────────────────────────────── */
const Toast = ({ toast }) => {
  if (!toast) return null;
  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2
        px-5 py-3 rounded-full shadow-xl text-sm font-medium
        ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}
    >
      {toast.type === "success" ? <FiCheck size={14} /> : <FiAlertCircle size={14} />}
      {toast.message}
    </div>
  );
};

/* ─── Breakdown row ────────────────────────────────────────── */
const BreakdownRow = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-xs font-medium text-gray-500 w-32 shrink-0">{label}</span>
    <StarPicker value={value} onChange={onChange} size={18} />
  </div>
);

/* ═══════════════════════════════════════════════════════════
   REVIEW FORM MODAL
═══════════════════════════════════════════════════════════ */
const ReviewModal = ({ item, existingReview, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    rating: existingReview?.rating || 0,
    title: existingReview?.title || "",
    comment: existingReview?.comment || "",
    ratingBreakdown: {
      fit: existingReview?.ratingBreakdown?.fit || 0,
      quality: existingReview?.ratingBreakdown?.quality || 0,
      valueForMoney: existingReview?.ratingBreakdown?.valueForMoney || 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEdit = Boolean(existingReview);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setBreakdown = (k, v) =>
    setForm((f) => ({ ...f, ratingBreakdown: { ...f.ratingBreakdown, [k]: v } }));

  const handleSubmit = async () => {
    if (!form.rating) { setError("Please select an overall rating."); return; }
    if (!form.comment.trim()) { setError("Please write a comment."); return; }
    setError("");
    setLoading(true);
    try {
      const payload = { variantId: item.variantId, ...form };
      if (isEdit) {
        await api.put(`/review/update/${existingReview._id}`, payload);
        onSuccess("Review updated successfully!");
      } else {
        await api.post("/review", payload);
        onSuccess("Review submitted successfully!");
      }
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {isEdit ? "Edit Review" : "Write a Review"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
              {item.productName} · Size {item.size} · {item.color}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <FiX size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Overall Rating *
            </label>
            <StarPicker value={form.rating} onChange={(v) => set("rating", v)} size={28} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Review Title
            </label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Summarise your experience..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#927f68]/30 focus:border-[#927f68] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Your Review *
            </label>
            <textarea
              value={form.comment}
              onChange={(e) => set("comment", e.target.value)}
              placeholder="Tell us about the fit, quality, and your overall experience..."
              rows={4}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#927f68]/30 focus:border-[#927f68] resize-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Detailed Ratings
            </label>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <BreakdownRow label="Fit" value={form.ratingBreakdown.fit} onChange={(v) => setBreakdown("fit", v)} />
              <BreakdownRow label="Quality" value={form.ratingBreakdown.quality} onChange={(v) => setBreakdown("quality", v)} />
              <BreakdownRow label="Value for Money" value={form.ratingBreakdown.valueForMoney} onChange={(v) => setBreakdown("valueForMoney", v)} />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 text-sm">
              <FiAlertCircle size={14} className="shrink-0" /> {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-[#927f68] hover:bg-[#7a6650] text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-[#927f68]/25 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <FiLoader size={14} className="animate-spin" />}
              {isEdit ? "Update Review" : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   REVIEW CARD
═══════════════════════════════════════════════════════════ */
const ReviewCard = ({ review, onEdit, onDelete, onLike }) => {
  const [likeLoading, setLikeLoading] = useState(false);
  const bd = review.ratingBreakdown || {};

  const handleLike = async () => {
    setLikeLoading(true);
    await onLike(review._id, review.isLiked ? "unlike" : "like");
    setLikeLoading(false);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {review.title?.[0]?.toUpperCase() || "R"}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {review.title || "(No title)"}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {new Date(review.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0">
          {review.rating} <FiStar size={9} className="fill-white" />
        </span>
      </div>

      <Stars rating={review.rating} />

      <p className="text-sm text-gray-600 leading-relaxed mt-2.5 mb-3">{review.comment}</p>

      {(bd.fit || bd.quality || bd.valueForMoney) ? (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {bd.fit > 0 && (
            <span className="text-[10px] bg-amber-50 border border-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              Fit {bd.fit}/5
            </span>
          )}
          {bd.quality > 0 && (
            <span className="text-[10px] bg-amber-50 border border-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              Quality {bd.quality}/5
            </span>
          )}
          {bd.valueForMoney > 0 && (
            <span className="text-[10px] bg-amber-50 border border-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              Value {bd.valueForMoney}/5
            </span>
          )}
        </div>
      ) : null}

      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all disabled:opacity-50
            ${review.isLiked
              ? "bg-[#927f68] text-white"
              : "bg-gray-100 text-gray-500 hover:bg-[#927f68]/10 hover:text-[#927f68]"
            }`}
        >
          <FiThumbsUp size={12} /> {review.likes || 0} Helpful
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(review)}
            className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-[#927f68] px-2 py-1.5 rounded-lg hover:bg-[#927f68]/10 transition-all"
          >
            <FiEdit3 size={12} /> Edit
          </button>
          <button
            onClick={() => onDelete(review._id)}
            className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-500 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-all"
          >
            <FiTrash2 size={12} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Order item row ───────────────────────────────────────── */
const OrderItemRow = ({ item, order, hasReview, onWriteReview }) => (
  <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 hover:bg-amber-50/50 rounded-xl border border-gray-100 hover:border-amber-200 transition-all group">
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-10 h-10 rounded-xl bg-[#927f68]/10 flex items-center justify-center shrink-0">
        <FiPackage size={16} className="text-[#927f68]" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{item.productName}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          Size: {item.size} · {item.color} · ₹{item.sellingPrice?.toLocaleString()}
        </p>
        <p className="text-[10px] text-gray-400 mt-0.5">#{order.orderNumber}</p>
      </div>
    </div>

    {hasReview ? (
      <div className="flex items-center gap-2 shrink-0">
        <span className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
          <FiCheck size={10} /> Reviewed
        </span>
      </div>
    ) : (
      <button
        onClick={() => onWriteReview(item, order)}
        className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-[#927f68] border border-[#927f68]/40 hover:border-[#927f68] hover:bg-[#927f68] hover:text-white px-3 py-1.5 rounded-xl transition-all"
      >
        <FiEdit3 size={12} /> Write Review
      </button>
    )}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
const ReviewPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = user?._id || user?.user?._id || null;

  // User's reviews (from /review/getreviews)
  const [userReviews, setUserReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Orders
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // UI
  const [activeTab, setActiveTab] = useState("pending");
  const [modal, setModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  /* ── Fetch user's reviews ── */
  const fetchUserReviews = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const res = await api.get("/review/getreviews");
      const reviews = res.data?.reviews || [];
      // Filter reviews for current user
      const myReviews = reviews.filter(r => r.userId?._id === currentUserId || r.userId === currentUserId);
      setUserReviews(myReviews);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  }, [currentUserId]);

  /* ── Fetch orders ── */
  const fetchOrders = useCallback(async (page = 1) => {
    setOrdersLoading(true);
    try {
      const res = await api.get(`/order/my?page=${page}&limit=10`);
      const data = res.data;
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(page);
    } catch {
      showToast("Failed to load orders.", "error");
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(1);
    fetchUserReviews();
  }, [fetchOrders, fetchUserReviews]);

  /* ── Build map of variantId -> user's review ── */
  const reviewByVariantId = {};
  userReviews.forEach((review) => {
    const variantId = review.variantId?._id || review.variantId;
    if (variantId) {
      reviewByVariantId[variantId] = review;
    }
  });

  /* ── All order items enriched with review status ── */
  const allItems = orders.flatMap((order) =>
    order.items.map((item) => {
      const myReview = reviewByVariantId[item.variantId] || null;
      return { item, order, myReview };
    })
  );

  const pendingItems = allItems.filter((x) => !x.myReview);
  const reviewedItems = allItems.filter((x) => x.myReview);

  /* ── Like handler ── */
  const handleLike = async (reviewId, action) => {
    try {
      await api.post(`/review/like/${reviewId}`, { action });
      await fetchUserReviews(); // Refresh reviews
    } catch {
      showToast("Failed to update like.", "error");
    }
  };

  /* ── Delete handler ── */
  const handleDelete = async (reviewId) => {
    try {
      await api.delete(`/review/delete/${reviewId}`);
      showToast("Review deleted.");
      setDeleteConfirm(null);
      await fetchUserReviews();
    } catch {
      showToast("Failed to delete.", "error");
    }
  };

  /* ── After submit/edit ── */
  const handleReviewSuccess = async (message) => {
    showToast(message);
    await fetchUserReviews();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap');
        .tab-active   { color: #927f68; border-bottom: 2px solid #927f68; background-color: #fffbf7; }
        .tab-inactive { color: #9ca3af; border-bottom: 2px solid transparent; }
      `}</style>

      <Toast toast={toast} />

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-base font-bold text-gray-900 mb-2">Delete Review?</h3>
            <p className="text-sm text-gray-400 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <ReviewModal
          item={modal.item}
          existingReview={modal.existingReview}
          onClose={() => setModal(null)}
          onSuccess={(msg) => {
            handleReviewSuccess(msg);
            setModal(null);
          }}
        />
      )}

      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
            >
              <FiChevronLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                My Reviews
              </h1>
              <p className="text-xs text-gray-400">
                {reviewedItems.length} review{reviewedItems.length !== 1 ? "s" : ""} written
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Orders", value: orders.length },
              { label: "Reviewed", value: reviewedItems.length, accent: true },
              { label: "Pending", value: pendingItems.length },
            ].map(({ label, value, accent }) => (
              <div
                key={label}
                className={`rounded-2xl p-4 text-center border ${
                  accent
                    ? "bg-[#927f68] border-[#927f68] text-white"
                    : "bg-white border-gray-100"
                }`}
              >
                <p className={`text-2xl font-bold ${accent ? "text-white" : "text-gray-900"}`}>
                  {value}
                </p>
                <p className={`text-xs mt-0.5 ${accent ? "text-white/80" : "text-gray-500"}`}>
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              {[
                { id: "pending", label: "Pending Reviews", count: pendingItems.length },
                { id: "reviewed", label: "My Reviews", count: reviewedItems.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3.5 text-sm font-semibold transition-all flex items-center justify-center gap-2
                    ${activeTab === tab.id ? "tab-active" : "tab-inactive hover:text-gray-600"}`}
                >
                  {tab.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                    ${activeTab === tab.id ? "bg-[#927f68] text-white" : "bg-gray-100 text-gray-500"}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="p-4 sm:p-5">
              {ordersLoading || reviewsLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-8 h-8 border-2 border-[#927f68] border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-gray-400">Loading...</p>
                </div>
              ) : activeTab === "pending" ? (
                pendingItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                      <FiCheck size={24} className="text-emerald-500" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">All caught up!</p>
                    <p className="text-xs text-gray-400">You've reviewed all your purchases.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingItems.map(({ item, order }) => (
                      <OrderItemRow
                        key={`${order._id}-${item._id}`}
                        item={item}
                        order={order}
                        hasReview={false}
                        onWriteReview={(i, o) => setModal({ item: i, order: o, existingReview: null })}
                      />
                    ))}
                  </div>
                )
              ) : (
                reviewedItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                    <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                      <FiStar size={24} className="text-amber-400" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">No reviews yet</p>
                    <p className="text-xs text-gray-400">Your submitted reviews will appear here.</p>
                    <button
                      onClick={() => setActiveTab("pending")}
                      className="mt-2 text-xs font-semibold text-[#927f68] border border-[#927f68]/40 px-4 py-2 rounded-xl hover:bg-[#927f68] hover:text-white transition-all"
                    >
                      Write your first review →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviewedItems.map(({ item, order, myReview }) => (
                      <div key={myReview._id} className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-400 px-1">
                          <FiPackage size={11} />
                          <span className="font-medium text-gray-500 truncate">{item.productName}</span>
                          <span>·</span>
                          <span>{item.size} / {item.color}</span>
                          <span>·</span>
                          <span className="truncate">{order.orderNumber}</span>
                        </div>
                        <ReviewCard
                          review={myReview}
                          onEdit={(r) => setModal({ item, order, existingReview: r })}
                          onDelete={(id) => setDeleteConfirm(id)}
                          onLike={handleLike}
                        />
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-5 py-3">
              <button
                onClick={() => fetchOrders(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#927f68] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft size={16} /> Previous
              </button>
              <span className="text-sm text-gray-500 font-medium">
                Page <span className="text-gray-900 font-bold">{currentPage}</span> of {totalPages}
              </span>
              <button
                onClick={() => fetchOrders(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#927f68] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <FiChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReviewPage;