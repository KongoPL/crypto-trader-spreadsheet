function CRON_RequestUpdateData() {
  const refreshCell = GLOBAL.summarySpreadsheet.getRange("B14").getCell(1,1);

  if(refreshCell.getValue()) {
    CRON_UpdateData();
  }
}


function CRON_UpdateData() {
  updateCurrentExchangeRates();
  updateTransactionsInSheet();
  updatePortfolio();
  updateSummary();

  updateLastUpdateTimestamp();
}