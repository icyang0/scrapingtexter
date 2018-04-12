const request = require('axios');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const { differenceWith, isEqual } = require('lodash');
const { extractListingsFromHTML } = require('./helpers');

module.exports.getdonkeyjobs = (event, context, callback) => {
  let newJobs, allJobs;

  request('https://www.thedonkeysanctuary.org.uk/vacancies')
    .then(({ data }) => {
      allJobs = extractListingsFromHTML(data);

      // Retrieve yesterday's jobs
      return dynamo.scan({
        TableName: 'donkeyjobs'
      }).promise();
    })
    .then(response => {
      // Figure out which jobs are new
      let yesterdaysJobs = response.Items[0] ? response.Items[0].jobs : [];

      newJobs = differenceWith(allJobs, yesterdaysJobs, isEqual);

      // Get the ID of yesterday's jobs which can now be deleted
      const jobsToDelete = response.Items[0] ? response.Items[0].listingId : null;

      // Delete old jobs
      if (jobsToDelete) {
        return dynamo.delete({
          TableName: 'donkeyjobs',
          Key: {
            listingId: jobsToDelete
          }
        }).promise();
      } else return;
    })
    .then(() => {
      // Save the list of today's jobs
      return dynamo.put({
        TableName: 'donkeyjobs',
        Item: {
          listingId: new Date().toString(),
          jobs: allJobs
        }
      }).promise();
    })
    .then(() => {
      callback(null, { jobs: newJobs });
    })
    .catch(callback);
};