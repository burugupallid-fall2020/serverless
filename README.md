# serverless


![AWS LAMBDA](https://d2908q01vomqb2.cloudfront.net/632667547e7cd3e0466547863e1207a8c0c0c549/2017/11/15/Email-Pausing-Diagram-BG.png)

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