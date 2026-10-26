/** Hoja de respuestas indicada por el organizador. */
var DEFAULT_SPREADSHEET_ID = '1ovVaWdxe8d6FB9LnrVajjbSXl3qX2xOf1ERP3QHa3MU';
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Evaluación de liderazgo')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** API para el formulario alojado en Netlify. */
function doPost(event) {
  var result;
  try {
    result = submitResponse(JSON.parse(event.postData.contents));
  } catch (error) {
    result = {ok: false, error: 'No se pudo guardar la respuesta. Revisa los datos e intenta nuevamente.'};
  }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function leadershipResult_(answers) {
  var score = answers.reduce(function (sum, n) { return sum + n; }, 0);
  var levels = [
    [42, 'Líder con propósito inspirador', 'Tu liderazgo está guiado por valores claros y un sentido profundo de contribución.'],
    [33, 'Líder con propósito en desarrollo', 'Tienes una buena base, pero puedes fortalecer tu coherencia y comunicación del propósito.'],
    [24, 'Líder funcional', 'Cumples tu rol, pero tu propósito no siempre está presente en tus decisiones.'],
    [10, 'Liderazgo sin propósito definido', 'Es momento de reflexionar sobre el sentido y la dirección de tu liderazgo.']
  ];
  var level = levels.filter(function (entry) { return score >= entry[0]; })[0];
  return {score: score, level: level[1], description: level[2]};
}

function receipt_(id, name, department, answers, date) {
  var result = leadershipResult_(answers);
  return {ok: true, id: id, name: name.replace(/^'/, ''), department: department.replace(/^'/, ''),
    score: result.score, level: result.level, description: result.description,
    date: Utilities.formatDate(new Date(date), 'America/Guatemala', 'dd/MM/yyyy')};
}

function submitResponse(data) {
  if (!data || typeof data.id !== 'string' || !/^[a-zA-Z0-9-]{10,80}$/.test(data.id) ||
      typeof data.name !== 'string' || !data.name.trim() || data.name.length > 150 ||
      typeof data.department !== 'string' || !data.department.trim() || data.department.length > 150 ||
      !Array.isArray(data.answers) || data.answers.length !== 10 ||
      !data.answers.every(function (n) { return Number.isInteger(n) && n >= 1 && n <= 5; })) {
    throw new Error('Datos inválidos. Revisa todos los campos.');
  }
  var spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || DEFAULT_SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error('Falta configurar la hoja de respuestas.');
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var book = SpreadsheetApp.openById(spreadsheetId);
    var sheet = book.getSheetByName('Respuestas');
    var headers = ['ID de envío', 'Fecha y hora', 'Nombre completo', 'Dependencia',
      'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'Puntaje total', 'Nivel de liderazgo'];
    if (!sheet) sheet = book.insertSheet('Respuestas');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#e4f0e7');
    }
    var actual = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    // Compatibilidad con la primera versión, que guardaba únicamente P1–P10.
    if (actual.slice(0, 14).join('|') === headers.slice(0, 14).join('|') && !actual[14] && !actual[15]) {
      sheet.getRange(1, 15, 1, 2).setValues([headers.slice(14)]);
      actual = headers;
    }
    if (actual.join('|') !== headers.join('|')) throw new Error('La hoja Respuestas tiene columnas diferentes.');
    var existing = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow()-1, 1)
      .createTextFinder(data.id).matchEntireCell(true).useRegularExpression(false).findNext() : null;
    if (existing) {
      var row = sheet.getRange(existing.getRow(), 1, 1, 14).getValues()[0];
      return receipt_(row[0], row[2], row[3], row.slice(4, 14), row[1]);
    }
    // Impide interpretar nombres o dependencias como fórmulas de hoja de cálculo.
    function safeText(value) { return "'" + value.trim(); }
    var date = new Date();
    var result = leadershipResult_(data.answers);
    sheet.appendRow([data.id, date, safeText(data.name), safeText(data.department)].concat(data.answers, [result.score, result.level]));
    sheet.getRange(sheet.getLastRow(), 2).setNumberFormat('yyyy-mm-dd hh:mm:ss');
    SpreadsheetApp.flush();
    return receipt_(data.id, data.name.trim(), data.department.trim(), data.answers, date);
  } finally {
    lock.releaseLock();
  }
}
