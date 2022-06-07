import AWS from 'aws-sdk';
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { IWebhookRepo, WebhookRepo } from "functions/repository/WebhookRepo";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const webhookRepo: IWebhookRepo = new WebhookRepo(dynamoDb);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {

    const data = JSON.parse(event.body || '{}');

    if (data.name === undefined) {
        return {
            statusCode: 400,
            contentType: 'application/json',
            body: JSON.stringify({
                error: "name: Required"
            })
        };
    }

    const webhook = await webhookRepo.CreateWebhook(data.name);

    return {
        statusCode: 200,
        contentType: 'application/json',
        body: JSON.stringify({
            webhookId: webhook?.id,
            webhookName: webhook?.name,
            webhookUrl: `https://${event.requestContext.domainName}/wh/${webhook?.id}`
        })
    };
};
