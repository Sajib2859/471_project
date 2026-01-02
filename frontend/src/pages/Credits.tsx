import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const API_BASE = API_BASE_URL;
const USER_ID = '000000000000000000000004'; // Regular user from seed data

interface CreditBalance {
  userId: string;
  name: string;
  email: string;
  creditBalance: number;
  cashBalance: number;
}

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  description: string;
  balanceAfter: number;
  createdAt: string;
}

interface Redemption {
  _id: string;
  creditsRedeemed: number;
  cashAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

interface CreditSummary {
  currentBalance: number;
  cashBalance: number;
  totalEarned: number;
  totalSpent: number;
}

const Credits: React.FC = () => {
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [summary, setSummary] = useState<CreditSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'redeem'>('overview');

  // Redeem form
  const [redeemAmount, setRedeemAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [balanceRes, transactionsRes, redemptionsRes, summaryRes] = await Promise.all([
        axios.get(`${API_BASE}/users/${USER_ID}/credits/balance`),
        axios.get(`${API_BASE}/users/${USER_ID}/credits/transactions`),
        axios.get(`${API_BASE}/users/${USER_ID}/credits/redemptions`),
        axios.get(`${API_BASE}/users/${USER_ID}/credits/summary`)
      ]);

      setBalance(balanceRes.data.data);
      setTransactions(transactionsRes.data.data);
      setRedemptions(redemptionsRes.data.data);
      setSummary(summaryRes.data.data);
    } catch (error) {
      console.error('Error fetching credit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/users/${USER_ID}/credits/redeem`, {
        creditsToRedeem: parseInt(redeemAmount),
        paymentMethod,
        paymentDetails: {
          accountNumber,
          bankName,
          accountHolderName
        }
      });
      alert('Redemption request submitted successfully!');
      fetchData();
      setRedeemAmount('');
      setAccountNumber('');
      setBankName('');
      setAccountHolderName('');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error processing redemption');
    }
  };

  if (loading) {
    return <div className="loading">Loading credit information...</div>;
  }

  return (
    <>
      <section className="hero">
        <h1>Credit Management</h1>
        <p>Track your earnings, transactions, and redeem credits for cash</p>
      </section>

      <div className="container">
        {summary && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{summary.currentBalance}</div>
              <div className="stat-label">Current Credits</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">৳{summary.cashBalance}</div>
              <div className="stat-label">Cash Balance</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{summary.totalEarned}</div>
              <div className="stat-label">Total Earned</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{summary.totalSpent}</div>
              <div className="stat-label">Total Spent</div>
            </div>
          </div>
        )}

        <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e0e0e0'}}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '1rem 2rem',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              borderBottom: activeTab === 'overview' ? '3px solid #7cb342' : 'none',
              fontWeight: activeTab === 'overview' ? 'bold' : 'normal',
              color: activeTab === 'overview' ? '#7cb342' : '#757575'
            }}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            style={{
              padding: '1rem 2rem',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              borderBottom: activeTab === 'transactions' ? '3px solid #7cb342' : 'none',
              fontWeight: activeTab === 'transactions' ? 'bold' : 'normal',
              color: activeTab === 'transactions' ? '#7cb342' : '#757575'
            }}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('redeem')}
            style={{
              padding: '1rem 2rem',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              borderBottom: activeTab === 'redeem' ? '3px solid #7cb342' : 'none',
              fontWeight: activeTab === 'redeem' ? 'bold' : 'normal',
              color: activeTab === 'redeem' ? '#7cb342' : '#757575'
            }}
          >
            Redeem Credits
          </button>
        </div>

        {activeTab === 'overview' && balance && (
          <div>
            <h2 className="section-title">Account Overview</h2>
            <div className="card" style={{maxWidth: '600px', margin: '0 auto'}}>
              <h3>{balance.name}</h3>
              <p><strong>Email:</strong> {balance.email}</p>
              <p><strong>User ID:</strong> {balance.userId}</p>
              <div style={{marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px'}}>
                <p style={{fontSize: '1.2rem', marginBottom: '0.5rem'}}>💰 Available Credits</p>
                <p style={{fontSize: '3rem', fontWeight: 'bold', color: '#7cb342'}}>{balance.creditBalance}</p>
                <p style={{marginTop: '1rem', color: '#757575'}}>
                  Cash Equivalent: ৳{balance.cashBalance}
                </p>
              </div>
            </div>

            <h3 style={{marginTop: '3rem', marginBottom: '1rem'}}>Recent Redemptions</h3>
            <div className="card-grid">
              {redemptions.slice(0, 3).map((redemption) => (
                <div key={redemption._id} className="card">
                  <div style={{display: 'flex', justifyContent: 'between', alignItems: 'start'}}>
                    <div>
                      <p><strong>{redemption.creditsRedeemed} Credits</strong></p>
                      <p>৳{redemption.cashAmount}</p>
                    </div>
                    <span 
                      className="badge"
                      style={{
                        backgroundColor: redemption.status === 'completed' ? '#c8e6c9' : '#fff9c4',
                        color: redemption.status === 'completed' ? '#2c2c2c' : '#f57f17'
                      }}
                    >
                      {redemption.status}
                    </span>
                  </div>
                  <p style={{marginTop: '0.5rem', fontSize: '0.9rem', color: '#757575'}}>
                    {new Date(redemption.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div>
            <h2 className="section-title">Transaction History</h2>
            <div style={{maxWidth: '800px', margin: '0 auto'}}>
              {transactions.map((transaction) => (
                <div 
                  key={transaction._id} 
                  className="card"
                  style={{marginBottom: '1rem'}}
                >
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <h4 style={{marginBottom: '0.5rem', color: transaction.amount > 0 ? '#7cb342' : '#c62828'}}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount} Credits
                      </h4>
                      <p style={{fontSize: '0.9rem'}}>{transaction.description}</p>
                      <p style={{fontSize: '0.85rem', color: '#757575'}}>
                        {new Date(transaction.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <span className="badge" style={{
                        backgroundColor: transaction.type === 'earned' ? '#c8e6c9' : '#ffcdd2',
                        color: transaction.type === 'earned' ? '#2c2c2c' : '#c62828'
                      }}>
                        {transaction.type}
                      </span>
                      <p style={{marginTop: '0.5rem', fontSize: '0.9rem'}}>
                        Balance: {transaction.balanceAfter}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'redeem' && balance && (
          <div>
            <h2 className="section-title">Redeem Credits</h2>
            <div className="card" style={{maxWidth: '600px', margin: '0 auto'}}>
              <p style={{marginBottom: '1.5rem', textAlign: 'center'}}>
                Available Credits: <strong>{balance.creditBalance}</strong> (৳{balance.cashBalance})
              </p>

              <form onSubmit={handleRedeem}>
                <div className="form-group">
                  <label>Credits to Redeem</label>
                  <input
                    type="number"
                    className="form-control"
                    value={redeemAmount}
                    onChange={(e) => setRedeemAmount(e.target.value)}
                    max={balance.creditBalance}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    className="form-control"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="mobile_banking">Mobile Banking</option>
                    <option value="cash">Cash Pickup</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Account Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Bank/Provider Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Account Holder Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn" style={{width: '100%', marginTop: '1rem'}}>
                  Submit Redemption Request
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Credits;
