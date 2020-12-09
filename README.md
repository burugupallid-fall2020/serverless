# serverless


![AWS LAMBDA](https://d1.awsstatic.com/product-marketing/Lambda/Diagrams/product-page-diagram_Lambda-HowItWorks.68a0bcacfcf46fccf04b97f16b686ea44494303f.png)

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