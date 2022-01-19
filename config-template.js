const GLOBAL = {
  transactionsSpreadsheet: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Transactions"),
  portfoliosSpreadsheet: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Portfolios"),
  exchangeRateSpreadsheet: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Exchange Rates"),
  summarySpreadsheet: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Summary"),
  historicExchangeRatesSpreadsheet: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Historic Exchange Rates"),
  realisedPortfoliosSpreadsheet: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Realised Portfolios"),
  executeTimeStart: Date.now()
};

let ZondaApiInstance;

function Initialize() {
  ZondaApiInstance = CreateZondaApiInstance();

  ZondaApiInstance.authorize(
    'public_key',
    'private_key'
  );
}