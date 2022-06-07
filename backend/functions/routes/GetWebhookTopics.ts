import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import AWS, { ProcessCredentials } from 'aws-sdk';
import { IWebhookRepo, WebhookRepo } from "functions/repository/WebhookRepo";
import * as WebhookEntity from '../models/webhook.entity';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const webhookRepo: IWebhookRepo = new WebhookRepo(dynamoDb);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {

    const webhooks = await webhookRepo.GetWebhooks();

    return {
        statusCode: 200,
        contentType: 'application/json',
        body: JSON.stringify(webhooks, null, 4)
    };
};