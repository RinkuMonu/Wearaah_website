import React, { useMemo, useState, useEffect } from 'react';
import { CiWallet } from 'react-icons/ci';
import api from './service/axios';

const MyCoins = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [walletBalance, setWalletBalance] = useState(0);

    // Fetch transactions from API
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                
                const response = await api.get('/trancation');

                const result = response.data;
                
                if (result.success && result.data) {
                    // Format the transactions for display
                    const formattedTransactions = result.data.map(tx => ({
                        id: tx._id,
                        type: tx.type,
                        amount: tx.amount,
                        source: tx.description || tx.reasonSource,
                        date: new Date(tx.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                        }),
                        transactionId: tx.transactionId,
                        status: tx.status,
                        balanceAfter: tx.balanceAfter
                    }));
                    
                    setTransactions(formattedTransactions);
                    
                    // Get current wallet balance from the API response
                    if (result.data.length > 0 && result.data[0].walletId) {
                        setWalletBalance(result.data[0].walletId.availableBalance || 0);
                    }
                } else {
                    throw new Error('Invalid response structure');
                }
                
                setError(null);
            } catch (err) {
                console.error('Error fetching transactions:', err);
                // More detailed error message
                const errorMessage = err.response?.data?.message || err.message || 'Failed to load transactions. Please try again later.';
                setError(errorMessage);
                setTransactions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    // Calculate wallet balance from transactions
    const wallet = useMemo(() => {
        const totalEarned = transactions
            .filter((t) => t.type === 'credit')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalSpent = transactions
            .filter((t) => t.type === 'debit')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = totalEarned - totalSpent;
        return {
            totalCoins: walletBalance || Math.max(balance, 0),
            balance: walletBalance || Math.max(balance, 0),
        };
    }, [transactions, walletBalance]);

    // Get status badge color
    const getStatusBadgeColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'failed':
                return 'bg-red-100 text-red-700';
            case 'cancelled':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-blue-100 text-blue-700';
        }
    };

    if (loading) {
        return (
            <div className="bg-white p-4 sm:p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Loading transactions...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-4 sm:p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 sm:p-6">
            <div className="mb-6 rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold text-gray-900">TOTAL AVAILABLE COINS</h2>
                </div>
                <div className="flex items-center gap-2">
                    <CiWallet className="text-3xl" />
                    <div className="mb-1 text-3xl font-bold text-gray-900">{wallet.totalCoins} MYCOINS</div>
                </div>
                <div className="text-sm text-gray-600">Your total Mycoins is worth ₹{wallet.balance}.00</div>
                <p className="text-xs text-gray-500 leading-relaxed">
                    You can pay up to 100% of any order value through sale & promotion events of Coins.
                    Use them on the Payments page.
                </p>
            </div>

            <div className="mb-8">
                <h3 className="mb-4 text-sm font-semibold text-gray-900">COINS TRANSACTIONS</h3>
                <div className="overflow-x-auto rounded-lg border border-blue-200 bg-blue-50 p-4">
                    {transactions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No transactions found
                        </div>
                    ) : (
                        <div className="min-w-[620px]">
                            <div className="mb-2 grid grid-cols-6 text-xs font-semibold text-gray-700">
                                <span>DATE</span>
                                <span className="col-span-2">DESCRIPTION</span>
                                <span className="text-right">CREDIT/DEBIT</span>
                                <span className="text-right">TYPE</span>
                                <span className="text-right">STATUS</span>
                            </div>
                            {transactions.map((t) => (
                                <div key={t.id} className="grid grid-cols-6 items-center py-2 text-xs text-gray-700 border-b border-blue-100 last:border-0">
                                    <div>{t.date}</div>
                                    <div className="col-span-2">
                                        <div className="font-medium">{t.source}</div>
                                        {t.transactionId && (
                                            <div className="text-[10px] text-gray-500">{t.transactionId}</div>
                                        )}
                                    </div>
                                    <div className={`text-right font-semibold ${t.type === 'credit' ? 'text-emerald-700' : 'text-red-600'}`}>
                                        {t.type === 'credit' ? `+${t.amount}` : `-${t.amount}`}
                                    </div>
                                    <div className="text-right">
                                        <span className={`capitalize px-2 py-1 rounded-full text-[10px] font-medium ${
                                            t.type === 'credit' 
                                                ? 'bg-emerald-100 text-emerald-700' 
                                                : 'bg-red-100 text-red-600'
                                        }`}>
                                            {t.type}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className={`capitalize px-2 py-1 rounded-full text-[10px] font-medium ${getStatusBadgeColor(t.status)}`}>
                                            {t.status || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyCoins;