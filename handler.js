'use strict';


const request = require('axios');
const {extractTicketsFromHTML} = require('./helpers');

module.exports.gettickets = (event, context, callback) => {
 /*  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  }; */

 // callback(null, response);
 // callback(null, 'Hello Poop!');

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
  
  //request('https://www.thedonkeysanctuary.org.uk/vacancies')
	request('http://global.smtowntravel.com/onEvent/step_1.asp?Master_Idx=363&Master_Lang=EN&Main_res_day=&Main_res_seq=')
    .then(({data}) => {
      const tickets = extractTicketsFromHTML(data);
      callback(null, {tickets});
    })
    .catch(callback);
};
