const aws = require("aws-sdk");
const dynamo = new aws.DynamoDB.DocumentClient();
const ses = new aws.SES();
aws.config.update({ region: "us-east-1" });

exports.handler = (event, context, callback) => {
  let message = JSON.parse(event.Records[0].Sns.Message);
  console.log(message.email)
  var searchParams = {
    TableName: "csye6225",
    Key: {
      id: message.email + message.answer_id + message.question_id + message.type, 
      answer_text: message.answer_text
    }
  };
  dynamo.get(searchParams, function (error, data1) {
    if (error) {
      console.log("Error to retreived Data from DynamoDB", error);
    } else {
      console.log("Successessfully retreived Data from DynamoDB", data1);
      let checkDuplicate = false;
      if (data1.Item == null || data1.Item == undefined) {
        checkDuplicate = false;
      }
      if (!checkDuplicate) {
        var params = {
          Item: {
            id: message.email + message.answer_id + message.question_id + message.type, 
            from: "noreply@prod.bdsaisantosh.me",
            answer: message.answer_text
          },
          TableName: "csye6225"
        };
        dynamo.put(params, function (error, data) {
          if (error) {
            console.log("Error to Put Data from DynamoDB", error);
          } else {
            console.log("Successessfully added Data from DynamoDB", data);
            console.log(message.email)
            console.log(message.question_id)
            let HOST = "http://prod.bdsaisantosh.me/v1/question/" + message.question_id + "/answer/" + message.answer_id
            if (message.type == "updated") {
              var params = {
                Destination: {
                  ToAddresses: [message.email],
                },
                Message: {
                  Body: {
                    Text: { Data: "Answer is  " + HOST + "Updated" },
                  },

                  Subject: { Data: "Answer Posted for: " + message.question_text },
                },
                Source: "noreply@prod.bdsaisantosh.me",
              };
            } else if (message.type == "deleted") {
              var params = {
                Destination: {
                  ToAddresses: [message.email],
                },
                Message: {
                  Body: {
                    Text: { Data: "Answer is deleted for" + message.question_text },
                  },

                  Subject: { Data: "Answer deleted for: " + message.question_text },
                },
                Source: "noreply@prod.bdsaisantosh.me",
              };
            } else if (message.type == "created") {
              var params = {
                Destination: {
                  ToAddresses: [message.email],
                },
                Message: {
                  Body: {
                    Text: { Data: "Answer is  " + HOST + "Posted" },
                  },

                  Subject: { Data: "Answer Posted for: " + message.question_text },
                },
                Source: "noreply@prod.bdsaisantosh.me",
              };
            }
            return ses.sendEmail(params).promise()
          }
        });
      } else {
        console.log("CheckDuplicate Passed: sent the data to dynamoDB");
      }
    }
  });
};
