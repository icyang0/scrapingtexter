const request = require('axios');
const {extractTicketsFromHTML} = require('./helpers');

module.exports.gettickets = (event, context, callback) => {
 // request('https://www.thedonkeysanctuary.org.uk/vacancies')
	request('http://global.smtowntravel.com/onEvent/step_1.asp?Master_Idx=363&Master_Lang=EN&Main_res_day=&Main_res_seq=')
    .then(({data}) => {
      const tickets = extractTicketsFromHTML(data);
      callback(null, {tickets});
    })
    .catch(callback);
};