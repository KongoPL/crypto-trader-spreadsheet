function getExchangeHistoricRates() {
  const lastMonthDate = (new Date(2021, 10, 0));
  const endOfDayTime = lastMonthDate.getTime() + 86400000 - 1;

  const data = ZondaApiInstance.getCandlesHistory("BTC", "PLN", 86400, lastMonthDate.getTime(), endOfDayTime);
  const endOfDayRate = data.items[0][1].c;

  GLOBAL.historicExchangeRatesSpreadsheet.appendRow([
    "BTC", 
    Utilities.formatDate(new Date(endOfDayTime), "GMT+2", "yyyy-MM-dd HH:mm:ss"),
    endOfDayTime, 
    endOfDayRate
  ]);
}