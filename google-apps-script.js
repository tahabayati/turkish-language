const HEADERS = ['ID', 'Created At', 'Turkish Word', 'English Meaning', 'Part of Speech', 'Alternatives', 'Notes', 'Image URL', 'Image Formula'];

function doGet() {
  try {
    const sheet = getSheet_();
    const words = sheet.getDataRange().getValues().slice(1).filter(row => row[0]).map(rowToWord_);
    return json_({ status: 'success', words });
  } catch (error) { return json_({ status: 'error', message: String(error) }); }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const sheet = getSheet_();
    if ((data.action || 'create') === 'create') return json_(createWord_(sheet, data));
    if (data.action === 'update') return json_(updateWord_(sheet, data));
    if (data.action === 'delete') return json_(deleteWord_(sheet, data.id));
    throw new Error('Unknown action: ' + data.action);
  } catch (error) { return json_({ status: 'error', message: String(error) }); }
}

function getSheet_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  return sheet;
}

function createWord_(sheet, data) {
  requireFields_(data);
  if (findRow_(sheet, data.turkishWord)) throw new Error('Word already exists');
  const id = Utilities.getUuid();
  sheet.appendRow([id, new Date(), data.turkishWord, data.englishMeaning, data.partOfSpeech, data.alternatives, data.notes, data.imageUrl || '', imageFormula_(data.imageUrl)]);
  return { status: 'success', action: 'create', id: id };
}

function updateWord_(sheet, data) {
  if (!data.id) throw new Error('ID is required');
  const row = findRowById_(sheet, data.id);
  if (!row) throw new Error('Word not found');
  requireFields_(data);
  sheet.getRange(row, 1, 1, 9).setValues([[data.id, sheet.getRange(row, 2).getValue(), data.turkishWord, data.englishMeaning, data.partOfSpeech, data.alternatives, data.notes, data.imageUrl || '', imageFormula_(data.imageUrl)]]);
  return { status: 'success', action: 'update', id: data.id };
}

function deleteWord_(sheet, id) {
  const row = findRowById_(sheet, id);
  if (!row) throw new Error('Word not found');
  sheet.deleteRow(row);
  return { status: 'success', action: 'delete', id: id };
}

function findRow_(sheet, word) {
  const target = String(word || '').trim().toLocaleLowerCase('tr-TR');
  const values = sheet.getRange(2, 3, Math.max(sheet.getLastRow() - 1, 1), 1).getValues();
  const index = values.findIndex(row => String(row[0]).trim().toLocaleLowerCase('tr-TR') === target);
  return index < 0 ? 0 : index + 2;
}

function findRowById_(sheet, id) {
  const values = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1).getValues();
  const index = values.findIndex(row => String(row[0]) === String(id));
  return index < 0 ? 0 : index + 2;
}

function rowToWord_(row) { return { id: row[0], createdAt: row[1], turkishWord: row[2], englishMeaning: row[3], partOfSpeech: row[4], alternatives: row[5], notes: row[6], imageUrl: row[7] }; }
function requireFields_(data) { ['turkishWord', 'englishMeaning', 'partOfSpeech', 'alternatives', 'notes'].forEach(field => { if (typeof data[field] !== 'string') throw new Error(field + ' is required'); }); }
function imageFormula_(url) { return url ? '=IMAGE("' + String(url).replace(/"/g, '""') + '")' : ''; }
function json_(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
