const pug = require('pug');

// Helper para compilar e renderizar
function renderPug(fileName, data) {
  return pug.renderFile(`./views/${fileName}.pug`, data);
}

exports.emdListPage = (elist, d) =>
    renderPug('index', {list: elist, date: d});

exports.emdPage = (e, d) =>
    renderPug('emd', {emd: e, date: d});

exports.emdFormPage = (d, e) =>
    renderPug('form', {date: d, emd: e});

exports.emdStatsPage = (s, d) =>
    renderPug('stats', {stats: s, date: d});

exports.errorPage = (msg, d) => renderPug('error', {message: msg, date: d});
