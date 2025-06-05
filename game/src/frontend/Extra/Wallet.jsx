import React, { useState, useEffect } from 'react';
import { Send, Repeat, DollarSign, Eye, EyeOff, Copy, CheckCircle, AlertCircle, X, ArrowLeft, Plus } from 'lucide-react';
// import './Wallet.css'









const Wallet = () => {
  const [balance, setBalance] = useState(125.50);
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [transferData, setTransferData] = useState({
    publicKey: '',
    amount: '',
    selectedToken: 'ETH'
  });
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'received', amount: 0.5, token: 'ETH', from: '0x742d...8f3a', timestamp: '2 hours ago', status: 'completed' },
    { id: 2, type: 'sent', amount: 0.2, token: 'SOL', to: '0x8b2c...9d4e', timestamp: '1 day ago', status: 'completed' },
    { id: 3, type: 'sent', amount: 1.0, token: 'ETH', to: '0x1a5f...2c8b', timestamp: '3 days ago', status: 'pending' }
  ]);
  const [notification, setNotification] = useState(null);
  const [cryptoData, setCryptoData] = useState([
    { symbol: 'SOL', name: 'Solana', balance: 2.5, usdValue: 85.25, price: 34.10, change: '+2.5%', changePositive: true },
    { symbol: 'ETH', name: 'Ethereum', balance: 0.75, usdValue: 1245.50, price: 1660.67, change: '+1.8%', changePositive: true },
    { symbol: 'BTC', name: 'Bitcoin', balance: 0.025, usdValue: 875.00, price: 35000.00, change: '-0.5%', changePositive: false }
  ]);

  const publicKey = "0x742d35Cc6bd4C2e9c4B2S8f3a1B7D5E9F2C4A8D6";

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showNotification('Copied to clipboard!');
  };

  const handleTransfer = () => {
    if (!transferData.publicKey || !transferData.amount) {
      showNotification('Please fill all fields', 'error');
      return;
    }

    if (parseFloat(transferData.amount) <= 0) {
      showNotification('Amount must be greater than 0', 'error');
      return;
    }

    const selectedCryptoData = cryptoData.find(c => c.symbol === transferData.selectedToken);
    if (parseFloat(transferData.amount) > selectedCryptoData.balance) {
      showNotification('Insufficient balance', 'error');
      return;
    }

    // Update balances
    setCryptoData(prev => prev.map(crypto => 
      crypto.symbol === transferData.selectedToken 
        ? { ...crypto, balance: crypto.balance - parseFloat(transferData.amount) }
        : crypto
    ));

    // Add transaction
    const newTransaction = {
      id: transactions.length + 1,
      type: 'sent',
      amount: parseFloat(transferData.amount),
      token: transferData.selectedToken,
      to: transferData.publicKey,
      timestamp: 'Just now',
      status: 'pending'
    };
    setTransactions(prev => [newTransaction, ...prev]);

    // Reset form
    setTransferData({ publicKey: '', amount: '', selectedToken: 'ETH' });
    setActiveTab('home');
    showNotification('Transfer initiated successfully!');
  };

  const formatBalance = (balance) => {
    return showBalance ? balance.toFixed(2) : '****';
  };

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const renderHome = () => (
    <div className="space-y-6">
      {/* Balance Section */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-purple-200 text-sm mb-1">Total Balance</p>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">
                ${formatBalance(balance)}
              </h1>
              <button 
                onClick={() => setShowBalance(!showBalance)}
                className="text-purple-200 hover:text-white transition-colors"
              >
                {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-green-300 text-sm">+$12.50 +2.1%</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-purple-200 text-sm">Public Key:</span>
          <span className="text-sm font-mono">{truncateAddress(publicKey)}</span>
          <button 
            onClick={() => copyToClipboard(publicKey)}
            className="text-purple-200 hover:text-white transition-colors"
          >
            <Copy size={16} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveTab('send')}
            className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-white/30 transition-all"
          >
            <Send size={18} />
            <span className="font-medium">Send</span>
          </button>
          <button 
            onClick={() => setActiveTab('swap')}
            className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-white/30 transition-all"
          >
            <Repeat size={18} />
            <span className="font-medium">Swap</span>
          </button>
          <button 
            onClick={() => setActiveTab('buy')}
            className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-white/30 transition-all"
          >
            <Plus size={18} />
            <span className="font-medium">Buy</span>
          </button>
        </div>
      </div>

      {/* Crypto Holdings */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Your Assets</h2>
        {cryptoData.map((crypto) => (
          <div 
            key={crypto.symbol}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
            onClick={() => setSelectedCrypto(crypto)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{crypto.symbol}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">{crypto.name}</h3>
                  <p className="text-sm text-gray-500">{crypto.balance} {crypto.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800 dark:text-gray-200">${crypto.usdValue.toFixed(2)}</p>
                <p className={`text-sm ${crypto.changePositive ? 'text-green-500' : 'text-red-500'}`}>
                  {crypto.change}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Recent Activity</h2>
        {transactions.slice(0, 3).map((tx) => (
          <div key={tx.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  tx.type === 'sent' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  <Send size={16} className={tx.type === 'sent' ? '' : 'rotate-180'} />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200 capitalize">{tx.type}</p>
                  <p className="text-sm text-gray-500">
                    {tx.type === 'sent' ? `To: ${truncateAddress(tx.to)}` : `From: ${truncateAddress(tx.from)}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${tx.type === 'sent' ? 'text-red-600' : 'text-green-600'}`}>
                  {tx.type === 'sent' ? '-' : '+'}{tx.amount} {tx.token}
                </p>
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${
                    tx.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></span>
                  <p className="text-xs text-gray-500">{tx.timestamp}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSend = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => setActiveTab('home')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold">Send Crypto</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
        {/* Token Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Select Token</label>
          <select 
            value={transferData.selectedToken}
            onChange={(e) => setTransferData(prev => ({...prev, selectedToken: e.target.value}))}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {cryptoData.map(crypto => (
              <option key={crypto.symbol} value={crypto.symbol}>
                {crypto.name} ({crypto.balance} {crypto.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Public Key Input */}
        <div>
          <label className="block text-sm font-medium mb-2">Recipient's Public Key</label>
          <input
            type="text"
            value={transferData.publicKey}
            onChange={(e) => setTransferData(prev => ({...prev, publicKey: e.target.value}))}
            placeholder="0x742d35Cc6bd4C2e9c4B2S8f3a1B7D5E9F2C4A8D6"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
          />
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium mb-2">Amount</label>
          <div className="relative">
            <input
              type="number"
              value={transferData.amount}
              onChange={(e) => setTransferData(prev => ({...prev, amount: e.target.value}))}
              placeholder="0.00"
              step="0.001"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <span className="absolute right-3 top-3 text-gray-500 text-sm">{transferData.selectedToken}</span>
          </div>
          {transferData.selectedToken && (
            <p className="text-xs text-gray-500 mt-1">
              Available: {cryptoData.find(c => c.symbol === transferData.selectedToken)?.balance} {transferData.selectedToken}
            </p>
          )}
        </div>

        {/* Transaction Fee */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
          <div className="flex justify-between text-sm">
            <span>Network Fee</span>
            <span>~$2.50</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="font-medium">Total</span>
            <span className="font-medium">
              {transferData.amount} {transferData.selectedToken} + Fee
            </span>
          </div>
        </div>

        {/* Send Button */}
        <button 
          onClick={handleTransfer}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
        >
          <Send size={18} />
          Send {transferData.selectedToken}
        </button>
      </div>
    </div>
  );

  const renderSwap = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => setActiveTab('home')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold">Swap Tokens</h2>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
        <Repeat size={48} className="mx-auto mb-4 text-purple-600" />
        <h3 className="text-lg font-semibold mb-2">Token Swap Coming Soon</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Exchange your tokens directly within the wallet. This feature will be available soon!
        </p>
      </div>
    </div>
  );

  const renderBuy = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => setActiveTab('home')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold">Buy Crypto</h2>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
        <DollarSign size={48} className="mx-auto mb-4 text-green-600" />
        <h3 className="text-lg font-semibold mb-2">Buy with Card</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Purchase cryptocurrency using your debit or credit card. Secure and instant transactions.
        </p>
        <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
          Connect Payment Method
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 min-h-screen shadow-xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="font-semibold text-gray-800 dark:text-gray-200">Wallet</span>
          </div>
          <div className="text-sm text-gray-500">Account 1</div>
        </div>

        {/* Main Content */}
        <div className="p-4 pb-20">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'send' && renderSend()}
          {activeTab === 'swap' && renderSwap()}
          {activeTab === 'buy' && renderBuy()}
        </div>

        {/* Bottom Navigation */}
        {activeTab === 'home' && (
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex justify-around">
              <button className="flex flex-col items-center gap-1 text-purple-600">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <DollarSign size={18} />
                </div>
                <span className="text-xs">Home</span>
              </button>
              <button 
                onClick={() => setActiveTab('send')}
                className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
              >
                <div className="w-8 h-8 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg flex items-center justify-center transition-colors">
                  <Send size={18} />
                </div>
                <span className="text-xs">Send</span>
              </button>
              <button 
                onClick={() => setActiveTab('swap')}
                className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
              >
                <div className="w-8 h-8 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg flex items-center justify-center transition-colors">
                  <Repeat size={18} />
                </div>
                <span className="text-xs">Swap</span>
              </button>
              <button 
                onClick={() => setActiveTab('buy')}
                className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors"
              >
                <div className="w-8 h-8 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg flex items-center justify-center transition-colors">
                  <Plus size={18} />
                </div>
                <span className="text-xs">Buy</span>
              </button>
            </div>
          </div>
        )}

        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 left-4 right-4 z-50 p-4 rounded-lg flex items-center gap-3 ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="flex-1">{notification.message}</span>
            <button onClick={() => setNotification(null)}>
              <X size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;