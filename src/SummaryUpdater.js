function updateSummary() {
  const balances = ZondaApiInstance.getBalancesList().balances
    .filter(v => v.totalFunds > 0);

  const values = balances.map((v, i) => [
    v.currency,
    v.availableFunds,
    v.type === "CRYPTO" ? "="+getExchangeRateCellAddress(v.currency)+" * B"+(i + 2) : v.availableFunds,
    v.type === "CRYPTO" ? "=C"+(i+2)+" - (1 / (1 + "+getExchangeRateChangeCellAddress(v.currency)+")) * C"+(i+2) : ""
  ]);

  const balancesRange = GLOBAL.summarySpreadsheet.getRange("A2:D20");
  const rangeValues = balancesRange.getValues();

  for(let i = values.length; i < rangeValues.length; i++) {
    values.push(rangeValues[i]);
  }

  const cellFormats = balances.map(v => [false, "0.00000000", "#,##0.00_ PLN", "[Color 10]+0.00_ PLN;[Red]-0.00_ PLN"]);

  for(let i = cellFormats.length; i < rangeValues.length; i++)
    cellFormats.push([false,false,false,false]);

  balancesRange.clearContent();
  balancesRange.setValues(values);
  balancesRange.setNumberFormats(cellFormats);

  // Summary
  GLOBAL.summarySpreadsheet.getRange(`A${balances.length+2}:D${balances.length+2}`).setRichTextValues([
    [
    SpreadsheetApp.newRichTextValue()
      .setText("Summary")
      .setTextStyle(
        SpreadsheetApp.newTextStyle().setBold(true).build()
      )
      .build(),
      SpreadsheetApp.newRichTextValue().setText("").build(),
      SpreadsheetApp.newRichTextValue().setText("=SUM(C2:C"+(2 + balances.length - 1)+")").build(),
      SpreadsheetApp.newRichTextValue().setText("=SUM(D2:D"+(2 + balances.length - 1)+")").build()
    ]
  ]).setNumberFormats([[false, "0.00000000", "#,##0.00_ PLN", "[Color 10]+0.00_ PLN;[Red]-0.00_ PLN"]]);
}

function getLastUpdateTimestamp() {
  return +GLOBAL.summarySpreadsheet.getRange("B12").getValue();
}

function updateLastUpdateTimestamp() {
  GLOBAL.summarySpreadsheet.getRange("B12")
    .setValue(GLOBAL.executeTimeStart)
    .setNumberFormat("0");

  GLOBAL.summarySpreadsheet.getRange("B13")
    .setValue(Utilities.formatDate(new Date(), "GMT+2", "yyyy-MM-dd HH:mm"))
    .setNumberFormat("yyyy-mm-dd hh:mm")
}