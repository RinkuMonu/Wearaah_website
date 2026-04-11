import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CiDeliveryTruck } from 'react-icons/ci';
import { FaRegStar, FaRegCopy, FaFileDownload, FaStar, FaCheck, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { PiMapPinSimpleArea, PiArrowLeft } from 'react-icons/pi';
import api from './service/axios';
import { Link } from 'react-router-dom';

// API service function
const fetchMyOrders = async ({ page = 1, limit = 10 }) => {
  const response = await api.get(`/order/my?page=${page}&limit=${limit}`);
  return response.data;
};


// Helper function to transform API order data to match your existing UI structure
const transformOrderData = (apiOrder) => {
  // Calculate total items count
  const totalItems = apiOrder.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  
  // Get the first item for product display
  const firstItem = apiOrder.items?.[0];
  
  // Map order status to display status
  const statusMap = {
    'placed': 'Placed',
    'confirmed': 'Confirmed',
    'shipped': 'Shipped',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled',
    'pending': 'Pending'
  };
  
  return {
    id: apiOrder.orderNumber || apiOrder._id,
    product: firstItem?.productName || 'Product',
    brand: firstItem?.productName?.split(' ')[0] || 'Brand',
    rating: 4.0, // You'll need to add rating to your API or calculate from reviews
    status: statusMap[apiOrder.orderStatus] || apiOrder.orderStatus,
    date: apiOrder.createdAt ? new Date(apiOrder.createdAt).toLocaleDateString() : '',
    price: apiOrder.finalAmoutAfterCoinDeliverycharges || apiOrder.totalAmount,
    items: apiOrder.items?.map(item => ({
      productId: item.productId,
      variantId: item.variantId,
      name: item.productName,
      qty: item.quantity,
      price: item.sellingPrice,
      image: getProductImage(item), // You'll need to add image URL to your API
      size: item.size,
      color: item.color,
      sku: item.sku
    })) || [],
    hasReviewed: false, // You'll need to track this from your API
    rawData: apiOrder // Keep raw data for detailed view
  };
};

// Helper function to get product image - you can enhance this based on your data structure
const getProductImage = (item) => {
  // If you have images in your API response, use them
  if (item.images && item.images.length > 0) {
    return item.images[0];
  }
  // Default placeholder image
  return '../images/plain.webp';
};

const OrdersList = () => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
   const [currentPage, setCurrentPage] = useState(1);
  // React Query hook
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['myOrders', currentPage],
    queryFn: () => fetchMyOrders({ page: currentPage, limit: 10 }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Extract orders from response
  const orders = useMemo(() => {
    if (!response?.success || !response?.orders) return [];
    return response.orders.map(order => transformOrderData(order));
  }, [response]);

  const totalPages = response?.totalPages || 1;
  const totalCount = response?.totalCount || 0;

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const matchesSearch =
          order.id.toLowerCase().includes(normalizedSearchTerm) ||
          order.product.toLowerCase().includes(normalizedSearchTerm);
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;

        return matchesSearch && matchesStatus;
      }),
    [orders, normalizedSearchTerm, filterStatus]
  );

  const goBack = useCallback(() => {
    setViewMode('list');
    setSelectedOrder(null);
  }, []);

  const handleOpenOrderDetails = useCallback((order) => {
    setSelectedOrder(order);
    setViewMode('details');
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-500 text-xl mb-4">⚠️ Failed to load orders</div>
        <p className="text-gray-600 mb-4">{error?.message || 'Something went wrong'}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (viewMode === 'details' && selectedOrder) {
    return <OrderDetailsPage order={selectedOrder} onBack={goBack} />;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center bg-white border rounded-2xl p-4 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">All Orders ({filteredOrders.length})</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="Placed">Placed</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onClick={() => handleOpenOrderDetails(order)}
          />
        ))}
      </div>
         {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            <FaChevronLeft className="text-sm" />
          </button>
          
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, idx) => {
              const pageNum = idx + 1;
              // Show first page, last page, and pages around current page
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg transition ${
                      currentPage === pageNum
                        ? 'bg-blue-500 text-white'
                        : 'border hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                (pageNum === currentPage - 2 && currentPage > 3) ||
                (pageNum === currentPage + 2 && currentPage < totalPages - 2)
              ) {
                return <span key={pageNum} className="w-10 h-10 flex items-center justify-center">...</span>;
              }
              return null;
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            <FaChevronRight className="text-sm" />
          </button>
        </div>
      )}

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="flex items-center justify-center mx-auto mb-4">
            <iframe
              className="lg:w-[400px] h-[300px]"
              src="https://lottie.host/embed/424c2a72-0548-4d23-a52b-e36d79336d43/QHunyzsZme.lottie"
              title="No orders animation"
            />
          </div>
          <h3 className="text-2xl font-semibold text-gray-500 mb-2">No orders found</h3>
          {searchTerm || filterStatus !== 'all' ? (
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          ) : (
            <p className="text-gray-400">You haven't placed any orders yet</p>
          )}
        </div>
      )}
    </div>
  );
};

const OrderDetailsPage = ({ order, onBack }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedReview, setSubmittedReview] = useState(null);
  const [copied, setCopied] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [existingReview, setExistingReview] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  // const handleSubmitReview = async (e) => {
  //   e.preventDefault();
  //   if (rating === 0) return;
    
  //   setSubmitting(true);
  //   await new Promise(resolve => setTimeout(resolve, 1500));
    
  //   const review = {
  //     rating,
  //     text: reviewText.trim() || '',
  //     timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  //   };
    
  //   setSubmittedReview(review);
  //   setSubmitting(false);
  //   setShowReviewForm(false);
  //   setRating(0);
  //   setReviewText('');
  // };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    setSubmitting(true);
    setReviewError('');

    try {
      // Get variantId from the first item (adjust if you need per-item reviews)
      const variantId = order.items[0]?.variantId;

      const response = await api.post('/review', {
        variantId,
        rating,
        title: reviewTitle.trim(),
        comment: reviewText.trim(),
      });

      if (response.data?.success) {
        const review = {
          rating,
          text: reviewText.trim(),
          title: reviewTitle.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setSubmittedReview(review);
        setShowReviewForm(false);
        setRating(0);
        setReviewText('');
        setReviewTitle('');
      }
    } catch (err) {
      setReviewError(err?.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchExistingReview = async () => {
      if (order.status !== 'Delivered' || !order.rawData?._id) return;

      setReviewLoading(true);
      try {
        const response = await api.get(`/review/byorderID?orderId=${order.rawData._id}`);
        const data = response.data;
        // ✅ Adjust field based on your actual API response shape
        const review = data?.review || data?.data || null;
        if (review) {
          setExistingReview({
            rating: review.rating,
           text: review.comment,        
            title: review.title,         
            name: review.userId?.name, 
            timestamp: review.createdAt
              ? new Date(review.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '',
          });
        }
      } catch (err) {
        // No review found or error — silently ignore, user can still submit
        console.error('Failed to fetch existing review:', err);
      } finally {
        setReviewLoading(false);
      }
    };

    fetchExistingReview();
  }, [order.rawData?._id, order.status]);

  const displayReview = submittedReview || existingReview;

  const totalItems = useMemo(
    () => order.items.reduce((sum, item) => sum + item.qty, 0),
    [order.items]
  );

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(order.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = order.id;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadInvoice = () => {
    // Implement invoice download logic here
    console.log('Download invoice for order:', order.id);
  };

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 py-1.5 px-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all text-sm"
        >
          <PiArrowLeft className="text-sm" />
          Back
        </button>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          {/* Order Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="font-mono text-lg bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold">
              {order.id}
            </div>
            <StatusBadge status={order.status} />
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
              Order Items ({order.items.length})
            </h3>
               
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {order.items.map((item, index) => (
                <Link key={index} to={`/product/${item.productId}`}>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                    <div className="w-14 h-14 bg-linear-to-br from-gray-100 rounded-lg flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '../images/plain.webp';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900 truncate">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        ₹{item.price.toLocaleString()}
                        {item.size && <span className="ml-2">Size: {item.size}</span>}
                        {item.color && <span className="ml-2">Color: {item.color}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm text-gray-900">x{item.qty}</div>
                      <div className="text-xs text-gray-500">₹{(item.price * item.qty).toLocaleString()}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="text-gray-600 mb-1">Total Amount</div>
              <div className="font-bold text-xl text-blue-900">₹{order.price.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="text-gray-600 mb-1">Items Count</div>
              <div className="text-sm font-semibold">{totalItems} items</div>
              <div className="text-xs text-gray-500 mt-1">{order.date}</div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.rawData?.shippingAddress && (
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                <PiMapPinSimpleArea className="text-blue-500" />
                Shipping Address
              </div>
              <div className="p-4 border border-gray-300 rounded-xl bg-white/50">
                <div className="font-semibold text-gray-900">{order.rawData.shippingAddress.fullName}</div>
                <div className="text-sm text-gray-700">
                  {order.rawData.shippingAddress.street}
                  {order.rawData.shippingAddress.landmark && `, ${order.rawData.shippingAddress.landmark}`}
                </div>
                <div className="text-sm text-gray-700">
                  {order.rawData.shippingAddress.city}, {order.rawData.shippingAddress.state}
                </div>
                <div className="text-sm text-gray-700">Pincode: {order.rawData.shippingAddress.pincode}</div>
                <div className="text-sm text-gray-700">Mobile: {order.rawData.shippingAddress.mobile}</div>
              </div>
            </div>
          )}

          {/* Payment & Delivery Info */}
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
              <CiDeliveryTruck className="text-green-500" />
              Delivery & Payment
            </div>
            <div className="p-3 bg-white border border-gray-300 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="text-sm text-gray-500">
                Payment: {order.rawData?.paymentMethod} • {order.rawData?.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
              </div>
              <StatusBadge status={order.status} className="px-3 py-1 text-xs" />
            </div>
          </div>

          {/* Review Section */}
         {/* Review Section */}
{order.status === 'Delivered' && (
  <div className="border-t pt-6">
    <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-6">
      <FaRegStar className="text-yellow-500 text-xl" />
      Your Review
    </div>

    {/* ✅ Loading state */}
    {reviewLoading ? (
      <div className="flex items-center gap-2 text-gray-500 text-sm py-4">
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        Loading review...
      </div>

    ) : displayReview ? (
      // ✅ Show existing (fetched) OR newly submitted review
      <div className="p-6 border border-gray-200 rounded-2xl mb-6">
        <div className="flex items-start gap-4 mb-2">
          <div className="w-12 h-12 border border-gray-200 rounded-2xl flex items-center justify-center shrink-0">
            <FaStar className="text-yellow-300 text-2xl" />
          </div>
          <div className="flex-1 min-w-0 relative">
            {/* ✅ Uses name from API response */}
            <div className="font-bold text-gray-900 text-lg mb-1">
              {displayReview.name || order.rawData?.shippingAddress?.fullName || 'Customer'}
            </div>
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-lg transition-all ${
                    i < displayReview.rating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm font-medium text-gray-600 ml-2">
                {displayReview.rating} stars
              </span>
            </div>
            <div className="text-xs absolute right-0 top-0 text-gray-500 bg-white/50 px-3 py-1 rounded-full inline-block">
              Submitted {displayReview.timestamp}
            </div>
          </div>
        </div>

        {/* ✅ Title display */}
        {displayReview.title && (
          <p className="text-gray-800 font-semibold text-sm pl-16 mb-1">
            {displayReview.title}
          </p>
        )}

        {/* ✅ Comment display */}
        {displayReview.text && (
          <p className="text-gray-700 leading-relaxed text-base pl-16">
            {displayReview.text}
          </p>
        )}
      </div>

    ) : !showReviewForm ? (
      // ✅ No review yet — show Write Review button
      <button
        onClick={() => setShowReviewForm(true)}
        className="w-full text-yellow-500 py-3 px-8 rounded-xl bg-yellow-100 font-bold border border-yellow-200 flex items-center justify-center gap-3 text-base"
      >
        <FaRegStar className="text-xl" />
        Write Your First Review
      </button>

    ) : (
      // ✅ Review form
      <form onSubmit={handleSubmitReview} className="space-y-6 p-1">
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-4">
            Rate this order
          </label>
          <div className="flex gap-1 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer transition-all text-3xl hover:scale-110 ${
                  star <= rating
                    ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg'
                    : 'text-gray-300 hover:text-yellow-400 hover:drop-shadow-lg'
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          {!rating && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Click a star to rate
            </p>
          )}
        </div>

        <div className="mb-0">
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Share your experience
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
            placeholder="Tell us about your order experience..."
            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-3 focus:ring-yellow-500 focus:border-yellow-500 resize-none text-base"
            maxLength={500}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {reviewText.length}/500
          </div>
        </div>

        <div className="mb-0">
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Title (Optional)
          </label>
          <input
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            placeholder="Give your review a title..."
            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-3 focus:ring-yellow-500 focus:border-yellow-500 text-base"
            maxLength={100}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {reviewTitle.length}/100
          </div>
          {reviewError && (
            <p className="text-sm text-red-500 text-center mt-1">{reviewError}</p>
          )}
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={() => {
              setShowReviewForm(false);
              setRating(0);
              setReviewText('');
              setReviewTitle('');
              setReviewError('');
            }}
            className="w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-semibold transition-all text-base border border-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="text-blue-600 py-2 w-auto px-6 rounded-xl font-bold transition-all text-base border-gray-200 border bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <FaStar className="text-lg" />
                Submit Review
              </>
            )}
          </button>
        </div>
      </form>
    )}
  </div>
)}
          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <button 
              onClick={handleDownloadInvoice}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-all text-sm shadow-lg"
            >
              <FaFileDownload className="text-sm" />
              Download Invoice
            </button>
            <button
              onClick={handleCopyOrderId}
              className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold transition-all text-sm shadow-sm ${
                copied
                  ? 'bg-green-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-102'
              }`}
            >
              {copied ? (
                <>
                  <FaCheck className="text-sm animate-pulse" />
                  Copied!
                </>
              ) : (
                <>
                  <FaRegCopy className="text-sm" />
                  Copy Order ID
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderCard = memo(({ order, onClick }) => (
  <div onClick={onClick} className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all cursor-pointer">
    <div className="flex items-start justify-between mb-4">
      <div className="font-mono text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full truncate max-w-[150px]">
        {order.id}
      </div>
      <StatusBadge status={order.status} />
    </div>

    <div className="space-y-3 mb-4">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 bg-linear-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-xl shrink-0 overflow-hidden">
          <img 
            src={order.items[0]?.image || '../images/plain.webp'} 
            alt={order.product} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '../images/plain.webp';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 text-sm leading-tight truncate">{order.product}</div>
          <div className="text-xs text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <FaRegStar
            key={i}
            className={`text-sm transition-colors ${i < Math.floor(order.rating)
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
            }`}
            size={14}
          />
        ))}
        <span className="text-sm text-gray-500 ml-1">({order.rating})</span>
      </div>
    </div>

    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
      <span>₹{order.price.toLocaleString()}</span>
      <span className="font-medium text-blue-600 group-hover:underline">View Details</span>
    </div>
  </div>
));

const StatusBadge = memo(({ status, className = '' }) => {
  const colors = {
    'Placed': 'bg-blue-100 text-blue-800',
    'Confirmed': 'bg-indigo-100 text-indigo-800',
    'Shipped': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'Pending': 'bg-yellow-100 text-yellow-800'
  };
  return (
    <span className={`px-4 py-2 text-sm font-semibold rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'} ${className}`}>
      {status}
    </span>
  );
});

export default OrdersList;