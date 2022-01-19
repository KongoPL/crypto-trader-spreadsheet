function updateCurrentExchangeRates() {
  const exchangeRange = GLOBAL.exchangeRateSpreadsheet.getRange("A2:C100");
  const exchangeRates = exchangeRange.getRichTextValues();

  for(const currency of exchangeRates) {
    const richCode = currency[0];

    const code = richCode.getText();

    if(code === '')
      break;

    const exchangeRate = ZondaApiInstance.getExchangeRate(code, 'PLN');
    const dayOpenRate = ZondaApiInstance.getMarketStats(code, 'PLN').stats.r24h;

    currency[1] = currency[1].copy().setText(exchangeRate).build();
    currency[2] = currency[2].copy().setText((exchangeRate / dayOpenRate) - 1).build();
  }

  exchangeRange.setRichTextValues(exchangeRates);
  exchangeRange.setNumberFormats(exchangeRange.getValues().map(v => [false, "0.00", "[Color 10]+0.00%;[Red]-0.00%"]));
}

function getExchangeRateCellAddress(currency) {
  return GLOBAL.exchangeRateSpreadsheet.getName()+"!B"+_getExchangeRateRow(currency);
}

function getExchangeRateChangeCellAddress(currency) {
  return GLOBAL.exchangeRateSpreadsheet.getName()+"!C"+_getExchangeRateRow(currency)
}

function  _getExchangeRateRow(currency) {
  return GLOBAL.exchangeRateSpreadsheet.getRange("A2:A").createTextFinder(currency).findNext().getRowIndex();
}