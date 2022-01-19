const GLOBAL = {
  transactionsSpreadsheet: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Transactions"),
  portfoliosSpreadsheet: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Portfolios"),
  exchangeRateSpreadsheet: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Exchange Rates"),
  summarySpreadsheet: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Summary"),
  historicExchangeRatesSpreadsheet: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Historic Exchange Rates"),
  realisedPortfoliosSpreadsheet: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Realised Portfolios"),
  executeTimeStart: Date.now()
};

const ZondaApiInstance = ZondaApi.get();

ZondaApiInstance.authorize(
    'more',
    'changes'
);