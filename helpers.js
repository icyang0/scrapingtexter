const cheerio = require('cheerio');
//const moment = require('moment');

function extractTicketsFromHTML (html) {
  const $ = cheerio.load(html);
  //const vacancyRows = $('.view-Vacancies tbody tr');
  //const vacancyRows = $('<div class="content_sh">...</div>');

  const vacancies = [];
  /* vacancyRows.each((i, el) => {

    // Extract information from each row of the jobs table
   // let closing = $(el).children('.views-field-field-vacancy-deadline').first().text().trim();
   // let job = $(el).children('.views-field-title').first().text().trim();
    let job = $(el).children('table_basic').text();
   // let location = $(el).children('.views-field-name').text().trim();
    //closing = moment(closing.slice(0, closing.indexOf('-') - 1), 'DD/MM/YYYY').toISOString();

    //vacancies.push({closing, job, location});
    vacancies.push({$});
    //vacancies.push({job});
  });
   */
  
//return vacancyRows.text();
  return $;
}

module.exports = {
  extractTicketsFromHTML
};