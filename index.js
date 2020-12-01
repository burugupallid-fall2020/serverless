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
      id: message.email
    }
  };
  dynamo.get(searchParams, function(error, data1) {
        if (error) {
      console.log("Error in get", error);
    } else {
      console.log("Success in get", data1);
      console.log(JSON.stringify(data1));
      let isPresent = false;
      if (data1.Item == null || data1.Item == undefined) {
        isPresent = false;
      } else {
       
        if (data1.Item.ttl > new Date().getTime()) {
          isPresent = true;
        }
      }
      if (!isPresent) {
        let currentTime = new Date().getTime();
        let ttl = process.env.timeToLive * 60 * 1000;
        let expiry = currentTime + ttl;
        var params = {
          Item: {
            id: message.email,
            token: context.awsRequestId,
            ttl: expiry,
            from: "noreply@prod.bdsaisantosh.me",
            answer: message.answer_text
          },
          TableName: "csye6225"
        };

        dynamo.put(params, function(error, data) {
          if (error) {
            console.log("Error", error);
          } else {
            console.log("Success", data);
              console.log(message.email)
              console.log(message.question_id)
              let HOST = "http://prod.bdsaisantosh.me/v1/question/" + message.question_id + "/answer/" + message.answer_id
              var params = {
                Destination: {
                  ToAddresses: [message.email],
                },
                Message: {
                  Body: {
                    Text: { Data: "Click here  " + HOST },
                  },
                  Subject: { Data: "Answer Posted for: "+ message.question_id},
                },
                Source: "noreply@prod.bdsaisantosh.me",
              };
              return ses.sendEmail(params).promise()
          }
        });
      } else {
        console.log("It is already present in the DynamoDB!!!");
      }
    }

  });
};
