/**
 * Wedding RSVP receiver for Google Sheets.
 * Paste this into Extensions > Apps Script from inside your Google Sheet.
 *
 * If you change the EVENTS in index.html, add or rename the matching ids in EVENT_IDS below.
 */

const EVENT_IDS = ["wedding", "reception"];

const HEADERS = [
  "Timestamp", "Name", "Contact", "Guests"
].concat(EVENT_IDS);

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000); // avoids two guests overwriting each other

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("combined");

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    const d = JSON.parse(e.postData.contents);

    const row = [
      new Date(),
      d.name || "",
      d.contact || "",
      d.guests || ""
    ].concat(EVENT_IDS.map(id => d[id] || ""));

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Opening the web app link in a browser shows this, which is a quick way to confirm it is live.
function doGet() {
  return ContentService.createTextOutput("RSVP endpoint is live.");
}