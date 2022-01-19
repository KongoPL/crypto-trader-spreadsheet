function updateTransactionsInSheet() {
  const lastUpdateTimestamp = getLastUpdateTimestamp();

  if(isNaN(lastUpdateTimestamp))
    throw new Error("Unable to update transactions in sheet - timestamp is not a number!");

  const transactions = getAllTransactionsSince(lastUpdateTimestamp + 1);

  for(const transaction of transactions) {
    GLOBAL.transactionsSpreadsheet.appendRow(
      transactionToDataRow(transaction)
    );
  }

  return !!transactions.length;
}

function getAllTransactionsSince(fromTime = 0) {
  const transactions = [];
  let nextPageCursor = 'start';

  while(true) { // :)
    const response = ZondaApiInstance.getTransactionsHistory({
      markets: [], 
      fromTime: fromTime.toString(),
      nextPageCursor
    });
    
    if(response.status !== "Ok")
      throw new Error("Unable to fetch all transactions! Response:\n"+JSON.stringify(response));

    transactions.push(...response.items);
    
    if(response.nextPageCursor === nextPageCursor || response.nextPageCursor === null)
      break; // End of list
    else
      nextPageCursor = response.nextPageCursor;
  }

  return transactions.reverse();
}

function transactionToDataRow(transaction) {
    // const currencies = transaction.market.split("-");
    // const currencyFrom = (transaction.userAction === "Buy" ? currencies[1] : currencies[0]);
    // const currencyTo = (transaction.userAction === "Buy" ? currencies[0] : currencies[1]);

  return [
    transaction.userAction,
    transaction.time,
    transaction.market,
    transaction.amount,
    transaction.rate,
    transaction.commissionValue
  ];
}


function dataRowToTransaction(data) {
  return {
    userAction: data[0],
    time: data[1],
    market: data[2],
    amount: data[3],
    rate: data[4],
    commissionValue: data[5],

    transactionCryptoMarket: data[2].split("-")[0]
  };
}

function getSheetTransactionsSince(time) {
  time = +time;

  return GLOBAL.transactionsSpreadsheet.getRange("A2:Z10000")
    .getValues()
    .filter(v => v[0] !== '')
    .map(v => dataRowToTransaction(v))
    .filter(v => +v.time > time)
  ;
}