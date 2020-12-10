# serverless


#### CI/CD for Lambda

```
Trigger build for web application and AWS Lambda function

gh-actions will trigger Continuous Integration and Continuous Deployment 
```

#### Trigger SES to send Email 
```
Will trigger SES to send email on Create, Update and Delete an Answer

Lambda resource is created using Terraform, Look for infrastructure repository

Updates the record in dynamoDB and check for duplicates
```

#### Implement Lambda Function

```
Lambda function will be invoked by the SNS notification. Lambda function is responsible for sending email to the user.
User will receive email notification when an answer is posted to question I asked.
User will receive email notification when an answer to the question I posted is updated or deleted.
User will not receive duplicate email notifications.
DynamoDB to track duplication of email
```