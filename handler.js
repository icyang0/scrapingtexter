'use strict';

var fs = require('fs');

//const {extractTicketsFromHTML} = require('./helpers');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const { differenceWith, isEqual } = require('lodash');
const request = require('axios');
var config = fs.readFileSync('./app_config.json', 'utf8');
config = JSON.parse(config);


var sns = new AWS.SNS({ region: config.AWS_REGION});


module.exports.gettickets = (event, context, callback) => {
	let newDates, JSONtoPass, yesterdaysDates, butts;
	
	request('http://global.smtowntravel.com/')
	.then(({data}) => {
		
		var goop = data.toString();
		var number = goop.indexOf("M Cultour Package")
		var dateOfTickets = goop.substring(number, number+30)
		
		JSONtoPass = dateOfTickets
	
		
		// Retrieve yesterday's jobs
		return dynamo.scan({
			TableName: 'tickets'
		}).promise();
	})
	
    .then(response => {

		// Figure out which jobs are new
		//let yesterdaysDates = response.Items[0] ? response.Items[0].dates : [];
		//yesterdaysDates = response.Items[0] ? response.Items[0].dates : [];
		yesterdaysDates = response.Items[0].dates;
		//newDates = differenceWith(JSONtoPass, yesterdaysDates, isEqual);
		butts = JSONtoPass.localeCompare(yesterdaysDates);

		//if the date isnt the same as yesterday, put new date in database, and send me a text
		if (butts != 0) {
			newDates = JSONtoPass;
			
			
			var snsMessage = 'SIGN UP NOW!!2'; //Send SNS notification containing email from form.
			sns.publish({ TopicArn: config.NEW_SIGNUP_TOPIC, Message: snsMessage }, function(err, data) {
				if (err) {
					console.log('Error publishing SNS message: ' + err);
				} else {
					console.log('SNS message sent.');
				}
			});
			
			
			// Save the list of today's jobs
			return dynamo.put({
				TableName: 'tickets',
					Item: {
						listingId: new Date().toString(),
						dates: JSONtoPass
					}
			}).promise();
			
			
			
			
		}
		
		var snsMessage = 'all good'; //Send SNS notification containing email from form.
		sns.publish({ TopicArn: config.NEW_SIGNUP_TOPIC, Message: snsMessage }, function(err, data) {
			if (err) {
				console.log('Error publishing SNS message: ' + err);
			} else {
				console.log('SNS message sent.');
			}
		});

		// Get the ID of yesterday's jobs which can now be deleted
/* 		const datesToDelete = response.Items[0] ? response.Items[0].listingId : null;

		// Delete old jobs
		if (datesToDelete) {
 			return dynamo.delete({
				TableName: 'tickets',
				Key: {
					listingId: datesToDelete
				}
			}).promise();
		} else return;  */
    })
    .then(() => {

		callback(null, { newDates }); 
		
	})	
    .catch(callback);
	
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
  
  
/* 	request('http://global.smtowntravel.com/onEvent/step_1.asp?Master_Idx=363&Master_Lang=EN&Main_res_day=&Main_res_seq=')
    .then(({data}) => {
      const tickets = extractTicketsFromHTML(data);
      callback(null, {tickets});
    })
    .catch(callback); */
	
	
	//request('http://global.smtowntravel.com/onEvent/step_1.asp?Master_Idx=363&Master_Lang=EN&Main_res_day=&Main_res_seq=')
	
////-----------------------------------------------------------------------'



////-----------------------------------------------------------------------'


/* 	axios.post('http://global.smtowntravel.com/member/login.asp?ref=/onEvent/index.asp', {
		Mail: 'remuusx3@gmail.com',
		pwd: '7GIDVi5KugurnsyMY1SL'
	})
	.then(function (response) {
		//console.log(response);
		
		fs.writeFile("\output.txt", data, function(err) {
			if(err) {
				return console.log(err);
			}
			console.log("The file was saved!");
		}); 
		
		
		
	})
	.catch(function (error) {
		console.log(error);
	}); */


	
	
};
