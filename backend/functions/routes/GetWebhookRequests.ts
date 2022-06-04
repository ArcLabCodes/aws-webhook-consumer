import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import AWS from 'aws-sdk';
import { IWebhookRequestRepo, WebhookRequestRepo } from "functions/repository/WebhookRequestRepo";
import * as WehbookRequestEntity from '../models/webhookRequest.entity';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const webhookRequestRepo: IWebhookRequestRepo = new WebhookRequestRepo(dynamoDb);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {

    const webhookId = event.pathParameters?.id ?? 'undefined';

    const results = webhookRequestRepo.GetRequests(webhookId);

    return {
        statusCode: 200,
        contentType: 'application/json',
        body: JSON.stringify(results, null, 4)
    };
};
