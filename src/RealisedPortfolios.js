// Method still in progress...
function BuildRealisedPortfoliosFromTransactionsAndPortfolios() {
  if(true) throw new Error("It is allowed only to run this method from apps-scripts level! Kill switch :)")

  const transactions = getSheetTransactionsSince(0);
  const portfolios = getPortfolios();

  // Process all the transactions up to the youngest portfolio
  const portfolioTransactions = transactions.filter(t => t.userAction === "Buy" && portfolios.find(p => t.amount - t.commissionValue === p.amount && p.crypto === t.transactionCryptoMarket));

  const youngestPortfolioTime = portfolioTransactions.sort((a, b) => a.time - b.time)[0].time;
  const transactionsToProcess = transactions.filter(t => t.time < youngestPortfolioTime);

  const pastPortfolios = [];
  const realisedTransactions = [];

  for(const transaction of transactionsToProcess) {
    if(transaction.userAction === "Buy") {
      pastPortfolios.push({
        market: transaction.transactionCryptoMarket,
        amountLeft: transaction.amount - transaction.commissionValue,
        rate: transaction.rate,
        time: transaction.time,
      });
    } else if(transaction.userAction === "Sell") {
      const transactionPortfolio = pastPortfolios.find(v => v.market === transaction.transactionCryptoMarket);

      transactionPortfolio.amountLeft -= transaction.amount;

      if(transactionPortfolio.amountLeft < 0) {
        // Magic ^^
      }

      realisedTransactions.push({
        dateSell: new Date(transaction.time),
        dateBuy: new Date(transactionPortfolio.time),
        market: transaction.transactionCryptoMarket,
        amount: transaction.amount,
        sellRate: transaction.rate,
        buyRate: transactionPortfolio.rate,
        profitPercent: (transaction.rate / transactionPortfolio.rate) - 1,
        profitMoney: (transaction.amount * transaction.rate) - (transaction.amount * transactionPortfolio.rate) - transaction.commissionValue
      });
    }
  }

  for(const realisedTransaction of realisedTransactions) {
    GLOBAL.realisedPortfoliosSpreadsheet.appendRow(realisedTransactionToDataRow(realisedTransaction));
  }
}


function realisedTransactionToDataRow(transaction) {
  const transactionCopy = {...transaction};

  transactionCopy.dateSell = Utilities.formatDate(transactionCopy.dateSell, "GMT+2", "yyyy-MM-dd HH:mm");
  transactionCopy.dateBuy = Utilities.formatDate(transactionCopy.dateBuy, "GMT+2", "yyyy-MM-dd HH:mm");

  return Object.values(transactionCopy);
}