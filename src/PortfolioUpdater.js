function updatePortfolio() {
  const updateTime = getLastUpdateTimestamp();
  const newTransactions = getSheetTransactionsSince(updateTime);

  if(newTransactions.length === 0)
    return;

  let portfolios = getPortfolios();

  for(const transaction of newTransactions) {
    if(transaction.userAction === "Buy") {
      addTransactionToPortfolio(portfolios, transaction);
    } else if(transaction.userAction === "Sell") {
      portfolios = removeTransactionFromPortfolio(portfolios, transaction);
    }
  }

  const dataRange = GLOBAL.portfoliosSpreadsheet.getRange("A2:D1000");
  
  dataRange.clear();
  
  const rangeValues = portfolios.map(portfolioToDataRow);

  for(let i = rangeValues.length; i < dataRange.getValues().length; i++) {
    rangeValues.push(["", "", "", ""]);
  }

  dataRange.setValues(rangeValues);
}


function getPortfolios() {
  return GLOBAL.portfoliosSpreadsheet.getRange("A2:D1000")
    .getValues()
    .filter(v => v[0] !== '')
    .map(v => dataRowToPortfolio(v));
}

function addTransactionToPortfolio(portfolios, transaction) {
  portfolios.push(createPortfolioFromTransaction(transaction));
}

function removeTransactionFromPortfolio(portfolios, transaction) {
  // Logger.log("Removing transaction "+JSON.stringify(transaction));

  for(const portfolio of portfolios) {
    if(portfolio.crypto !== transaction.transactionCryptoMarket)
      continue;

    // Logger.log("Found correct wallet. Amount of coin left in wallet: "+portfolio.amountLeft+". Amount left in transaction: "+transaction.amount);

    if(portfolio.amountLeft > transaction.amount) {
      portfolio.amountLeft -= transaction.amount;

      break;
    } else {
      transaction.amount -= portfolio.amountLeft;

      delete portfolios[portfolios.indexOf(portfolio)];
    }
  }

  return portfolios.filter(v => v); // To filter out null values
}

function portfolioToDataRow(portfolio) {
  return [
    portfolio.crypto,
    portfolio.amount,
    portfolio.amountLeft,
    portfolio.buyRate
  ];
}

function createPortfolioFromTransaction(transaction) {
  return {
    crypto: transaction.transactionCryptoMarket,
    amount: transaction.amount - transaction.commissionValue,
    amountLeft: transaction.amount - transaction.commissionValue,
    buyRate: transaction.rate,
  };
}

function dataRowToPortfolio(row) {
  return {
    crypto: row[0],
    amount: +row[1],
    amountLeft: +row[2],
    buyRate: +row[3],
  };
}