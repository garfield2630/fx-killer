"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PositionCalculatorPage() {
  const { language } = useLanguage();
  const isZh = language === 'zh';

  // Input states
  const [accountBalance, setAccountBalance] = useState<string>('10000');
  const [riskPercentage, setRiskPercentage] = useState<string>('2');
  const [stopLossPips, setStopLossPips] = useState<string>('50');
  const [currencyPair, setCurrencyPair] = useState<string>('EURUSD');
  const [accountCurrency, setAccountCurrency] = useState<string>('USD');
  const [takeProfitPips, setTakeProfitPips] = useState<string>('100');

  // Calculated results
  const [results, setResults] = useState({
    lotSize: 0,
    riskAmount: 0,
    pipValue: 0,
    potentialProfit: 0,
    riskRewardRatio: 0,
  });

  // Currency pair pip values (for standard lot)
  const pipValues: { [key: string]: number } = {
    'EURUSD': 10,
    'GBPUSD': 10,
    'AUDUSD': 10,
    'NZDUSD': 10,
    'USDJPY': 9.09, // Approximate, varies with exchange rate
    'USDCHF': 10,
    'USDCAD': 10,
    'XAUUSD': 10, // Gold
  };

  useEffect(() => {
    calculatePosition();
  }, [accountBalance, riskPercentage, stopLossPips, currencyPair, takeProfitPips]);

  const calculatePosition = () => {
    const balance = parseFloat(accountBalance) || 0;
    const risk = parseFloat(riskPercentage) || 0;
    const slPips = parseFloat(stopLossPips) || 0;
    const tpPips = parseFloat(takeProfitPips) || 0;

    if (balance <= 0 || risk <= 0 || slPips <= 0) {
      setResults({
        lotSize: 0,
        riskAmount: 0,
        pipValue: 0,
        potentialProfit: 0,
        riskRewardRatio: 0,
      });
      return;
    }

    const riskAmount = balance * (risk / 100);
    const pipValue = pipValues[currencyPair] || 10;
    const lotSize = riskAmount / (slPips * pipValue);
    const potentialProfit = lotSize * tpPips * pipValue;
    const riskRewardRatio = tpPips / slPips;

    setResults({
      lotSize: Math.round(lotSize * 100) / 100,
      riskAmount: Math.round(riskAmount * 100) / 100,
      pipValue: pipValue,
      potentialProfit: Math.round(potentialProfit * 100) / 100,
      riskRewardRatio: Math.round(riskRewardRatio * 100) / 100,
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
            {isZh ? '外汇仓位计算器' : 'Forex Position Size Calculator'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {isZh
              ? '根据账户余额、风险百分比和止损点数，精确计算推荐的交易手数'
              : 'Calculate the recommended lot size based on your account balance, risk percentage, and stop loss pips'}
          </p>
        </div>

        {/* Main Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Input Section */}
          <div className="bg-white dark:bg-gray-800 p-8 border-2 border-black dark:border-white">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6 pb-3 border-b-2 border-black dark:border-white">
              {isZh ? '输入参数' : 'Input Parameters'}
            </h2>

            <div className="space-y-6">
              {/* Account Balance */}
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">
                  {isZh ? '账户余额' : 'Account Balance'} ({accountCurrency})
                </label>
                <input
                  type="number"
                  value={accountBalance}
                  onChange={(e) => setAccountBalance(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white focus:border-black dark:focus:border-white outline-none"
                  placeholder="10000"
                />
              </div>

              {/* Risk Percentage */}
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">
                  {isZh ? '风险百分比 (%)' : 'Risk Percentage (%)'}
                </label>
                <input
                  type="number"
                  value={riskPercentage}
                  onChange={(e) => setRiskPercentage(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white focus:border-black dark:focus:border-white outline-none"
                  placeholder="2"
                  step="0.1"
                />
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {isZh ? '推荐：1-2%' : 'Recommended: 1-2%'}
                </p>
              </div>

              {/* Stop Loss Pips */}
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">
                  {isZh ? '止损点数 (Pips)' : 'Stop Loss (Pips)'}
                </label>
                <input
                  type="number"
                  value={stopLossPips}
                  onChange={(e) => setStopLossPips(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white focus:border-black dark:focus:border-white outline-none"
                  placeholder="50"
                />
              </div>

              {/* Take Profit Pips */}
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">
                  {isZh ? '止盈点数 (Pips)' : 'Take Profit (Pips)'}
                </label>
                <input
                  type="number"
                  value={takeProfitPips}
                  onChange={(e) => setTakeProfitPips(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white focus:border-black dark:focus:border-white outline-none"
                  placeholder="100"
                />
              </div>

              {/* Currency Pair */}
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">
                  {isZh ? '货币对' : 'Currency Pair'}
                </label>
                <select
                  value={currencyPair}
                  onChange={(e) => setCurrencyPair(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white focus:border-black dark:focus:border-white outline-none"
                >
                  <option value="EURUSD">EUR/USD</option>
                  <option value="GBPUSD">GBP/USD</option>
                  <option value="AUDUSD">AUD/USD</option>
                  <option value="NZDUSD">NZD/USD</option>
                  <option value="USDJPY">USD/JPY</option>
                  <option value="USDCHF">USD/CHF</option>
                  <option value="USDCAD">USD/CAD</option>
                  <option value="XAUUSD">XAU/USD (Gold)</option>
                </select>
              </div>

              {/* Account Currency */}
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">
                  {isZh ? '账户货币' : 'Account Currency'}
                </label>
                <select
                  value={accountCurrency}
                  onChange={(e) => setAccountCurrency(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white focus:border-black dark:focus:border-white outline-none"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CNY">CNY</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-black dark:bg-white p-8 border-2 border-black dark:border-white">
            <h2 className="text-2xl font-bold text-white dark:text-black mb-6 pb-3 border-b-2 border-white dark:border-black">
              {isZh ? '计算结果' : 'Calculation Results'}
            </h2>

            <div className="space-y-6">
              {/* Lot Size */}
              <div className="bg-white dark:bg-gray-900 p-4 border-2 border-white dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {isZh ? '推荐手数' : 'Recommended Lot Size'}
                </p>
                <p className="text-3xl font-bold text-black dark:text-white">
                  {results.lotSize.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {isZh ? '标准手' : 'Standard Lots'}
                </p>
              </div>

              {/* Risk Amount */}
              <div className="bg-white dark:bg-gray-900 p-4 border-2 border-white dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {isZh ? '风险金额' : 'Risk Amount'}
                </p>
                <p className="text-3xl font-bold text-black dark:text-white">
                  ${results.riskAmount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {riskPercentage}% {isZh ? '的账户余额' : 'of account balance'}
                </p>
              </div>

              {/* Potential Profit */}
              <div className="bg-white dark:bg-gray-900 p-4 border-2 border-white dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {isZh ? '潜在盈利' : 'Potential Profit'}
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-500">
                  ${results.potentialProfit.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {isZh ? '如果达到止盈' : 'If take profit is hit'}
                </p>
              </div>

              {/* Risk Reward Ratio */}
              <div className="bg-white dark:bg-gray-900 p-4 border-2 border-white dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {isZh ? '盈亏比' : 'Risk/Reward Ratio'}
                </p>
                <p className="text-3xl font-bold text-black dark:text-white">
                  1:{results.riskRewardRatio.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {results.riskRewardRatio >= 2
                    ? (isZh ? '✓ 优秀' : '✓ Excellent')
                    : results.riskRewardRatio >= 1.5
                    ? (isZh ? '⚠ 可接受' : '⚠ Acceptable')
                    : (isZh ? '✗ 过低' : '✗ Too Low')
                  }
                </p>
              </div>

              {/* Pip Value */}
              <div className="bg-white dark:bg-gray-900 p-4 border-2 border-white dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {isZh ? '每点价值' : 'Pip Value'}
                </p>
                <p className="text-2xl font-bold text-black dark:text-white">
                  ${results.pipValue.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {isZh ? '每标准手' : 'Per standard lot'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Guide */}
        <div className="bg-gray-50 dark:bg-gray-800 p-8 border-2 border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6 pb-3 border-b-2 border-black dark:border-white">
            {isZh ? '使用说明' : 'How to Use'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-black dark:text-white mb-3">
                {isZh ? '📝 计算公式' : '📝 Formula'}
              </h3>
              <div className="bg-white dark:bg-gray-900 p-4 border border-gray-300 dark:border-gray-700">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 font-mono">
                  {isZh ? '手数 = (账户余额 × 风险%) ÷ (止损点数 × 每点价值)' : 'Lot Size = (Balance × Risk%) ÷ (Stop Loss Pips × Pip Value)'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                  {isZh ? '示例：($10,000 × 2%) ÷ (50 × $10) = 0.4 手' : 'Example: ($10,000 × 2%) ÷ (50 × $10) = 0.4 lots'}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-black dark:text-white mb-3">
                {isZh ? '⚠️ 重要提示' : '⚠️ Important Notes'}
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-black dark:text-white font-bold">•</span>
                  <span>{isZh ? '建议单笔风险不超过2%' : 'Recommended risk per trade: max 2%'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black dark:text-white font-bold">•</span>
                  <span>{isZh ? '盈亏比建议至少1:2' : 'Risk/Reward ratio: minimum 1:2'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black dark:text-white font-bold">•</span>
                  <span>{isZh ? '止损一旦设置不得移动扩大亏损' : 'Never move stop loss to increase loss'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black dark:text-white font-bold">•</span>
                  <span>{isZh ? '所有持仓总风险建议不超过6%' : 'Total risk for all positions: max 6%'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Example */}
        <div className="bg-white dark:bg-gray-800 p-8 border-2 border-black dark:border-white">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6 pb-3 border-b-2 border-black dark:border-white">
            {isZh ? '实战案例' : 'Real Example'}
          </h2>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p className="font-bold text-black dark:text-white">
              {isZh ? '场景：' : 'Scenario:'}
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white font-bold">•</span>
                <span>{isZh ? '账户余额：$10,000' : 'Account Balance: $10,000'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white font-bold">•</span>
                <span>{isZh ? '风险百分比：2%' : 'Risk Percentage: 2%'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white font-bold">•</span>
                <span>{isZh ? '止损：50点' : 'Stop Loss: 50 pips'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white font-bold">•</span>
                <span>{isZh ? '止盈：100点' : 'Take Profit: 100 pips'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white font-bold">•</span>
                <span>{isZh ? '货币对：EUR/USD' : 'Currency Pair: EUR/USD'}</span>
              </li>
            </ul>

            <p className="font-bold text-black dark:text-white mt-6">
              {isZh ? '计算结果：' : 'Results:'}
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white font-bold">•</span>
                <span>{isZh ? '推荐手数：0.4手' : 'Recommended Lot Size: 0.4 lots'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white font-bold">•</span>
                <span>{isZh ? '风险金额：$200' : 'Risk Amount: $200'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white font-bold">•</span>
                <span>{isZh ? '潜在盈利：$400' : 'Potential Profit: $400'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black dark:text-white font-bold">•</span>
                <span>{isZh ? '盈亏比：1:2（优秀）' : 'Risk/Reward: 1:2 (Excellent)'}</span>
              </li>
            </ul>

            <div className="bg-black dark:bg-white text-white dark:text-black p-4 mt-6 border-2 border-black dark:border-white">
              <p className="font-bold mb-2">
                {isZh ? '💡 关键洞察：' : '💡 Key Insight:'}
              </p>
              <p className="text-sm">
                {isZh
                  ? '即使这笔交易止损，你只损失账户的2%（$200），但账户还剩$9,800，可以继续交易。这就是风险管理的威力！'
                  : 'Even if this trade hits stop loss, you only lose 2% ($200). You still have $9,800 to continue trading. This is the power of risk management!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
