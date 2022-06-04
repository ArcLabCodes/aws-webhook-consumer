
import { String } from "aws-sdk/clients/appstream";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { IWebhookEntity } from "functions/models/webhook.entity";
import { INewWebhookRequestEntry, IWebhookRequestEntity } from "functions/models/webhookRequest.entity";
import uuid from "short-uuid";

export interface IWebhookRequestRepo {
    GetRequests(webhookId: string): Promise<IWebhookRequestEntity[]>;
    CreateRequestLog(entry: INewWebhookRequestEntry): Promise<IWebhookRequestEntity | null>;
}

export class WebhookRequestRepo implements IWebhookRequestRepo {

    constructor(private dynamoDb: DocumentClient) {
    }

    async CreateRequestLog(request: INewWebhookRequestEntry): Promise<IWebhookRequestEntity | null> {

        const entry: IWebhookRequestEntity = {
            ...request,
            requestId: uuid.generate(),
            createdAt: new Date(),
        }

        try {
            const result = await this.dynamoDb.put({
                TableName: process.env.webhooklogsTable || "",
                Item: {
                    PK: `WH#${entry.webhookId}`,
                    SK: `RQ#${entry.requestId}`,
                    createdAt: entry.createdAt.toString(),
                    payload: JSON.stringify(request)
                }
            }).promise();

            return entry;
        }
        catch (err: any) {
            console.log(err);
            return null;
        }

    }

    async GetRequests(webhookId: string): Promise<IWebhookRequestEntity[]> {

        const queryResult = await this.dynamoDb.query({
            TableName: process.env.webhooklogsTable || "",
            KeyConditionExpression: `#PK = :pk and begins_with(#SK, :sk)`,
            ExpressionAttributeNames: {
                "#PK": "PK",
                "#SK": "SK"
            },
            ExpressionAttributeValues: {
                ":pk": `WH#${webhookId}`,
                ":sk": "RQ#"
            }
        }).promise();

        const result: IWebhookRequestEntity[] = (queryResult.Items ?? []).map(item => {
            const payload = JSON.parse(item.payload);
            return payload;
        });

        return result;
    }

}