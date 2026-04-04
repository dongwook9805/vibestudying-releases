const SHEET_NAME = "Feedback";
const HEADERS = ["id", "nickname", "message", "page_url", "created_at", "status"];

function doGet(e) {
  const callback = e && e.parameter ? e.parameter.callback : "";
  const action = e && e.parameter ? e.parameter.action || "list" : "list";

  if (action !== "list") {
    return respond_({ ok: false, error: "Unsupported action" }, callback);
  }

  const sheet = getSheet_();
  const rows = sheet.getDataRange().getValues();
  const headerIndex = getHeaderIndex_(rows[0] || []);
  const posts = rows
    .slice(1)
    .map((row) => ({
      id: row[headerIndex.id] || "",
      nickname: row[headerIndex.nickname] || "익명",
      message: row[headerIndex.message] || "",
      page_url: row[headerIndex.page_url] || "",
      created_at: row[headerIndex.created_at] || "",
      status: row[headerIndex.status] || "public",
    }))
    .filter((post) => post.message && String(post.status).toLowerCase() === "public")
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
    .slice(0, 12);

  return respond_({ ok: true, posts: posts }, callback);
}

function doPost(e) {
  const payload = parsePayload_(e);
  const nickname = sanitizeText_(payload.nickname, 40) || "익명";
  const message = sanitizeText_(payload.message, 600);
  const pageUrl = sanitizeText_(payload.page_url, 500);

  if (!message) {
    return respond_({ ok: false, error: "Message is required" });
  }

  const sheet = getSheet_();
  sheet.appendRow([
    Utilities.getUuid(),
    nickname,
    message,
    pageUrl,
    new Date().toISOString(),
    "public",
  ]);

  return respond_({ ok: true });
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  return sheet;
}

function getHeaderIndex_(headers) {
  const normalized = headers.map((header) => String(header || "").trim());
  return {
    id: normalized.indexOf("id"),
    nickname: normalized.indexOf("nickname"),
    message: normalized.indexOf("message"),
    page_url: normalized.indexOf("page_url"),
    created_at: normalized.indexOf("created_at"),
    status: normalized.indexOf("status"),
  };
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return {};
  }

  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    return {};
  }
}

function sanitizeText_(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function respond_(payload, callback) {
  const json = JSON.stringify(payload);
  if (callback) {
    return ContentService.createTextOutput(callback + "(" + json + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}
