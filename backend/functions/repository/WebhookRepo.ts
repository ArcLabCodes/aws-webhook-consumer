
import { String } from "aws-sdk/clients/appstream";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { IWebhookEntity } from "functions/models/webhook.entity";
import uuid from "short-uuid";

export interface IWebhookRepo {

    GetWebhooks(): Promise<IWebhookEntity[]>;
    GetWebhooksById(webhookId: string): Promise<IWebhookEntity | null>;
    CreateWebhook(name: string): Promise<IWebhookEntity | null>;
}

export class WebhookRepo implements IWebhookRepo {

    constructor(private dynamoDb: DocumentClient) {

    }

    async GetWebhooks(): Promise<IWebhookEntity[]> {
        const queryResult = await this.dynamoDb.query({
            TableName: process.env.webhooklogsTable || "",
            KeyConditionExpression: `#PK = :pk and begins_with(#SK, :sk)`,
            ExpressionAttributeNames: {
                "#PK": "PK",
                "#SK": "SK"
            },
            ExpressionAttributeValues: {
                ":pk": "WH",
                ":sk": "WH#"
            }
        }).promise();

        const result: IWebhookEntity[] = (queryResult.Items || []).map(item => ({
            id: (item.SK.replace('WH#', '')) as string,
            name: (item.name) as string
        }));

        return result;
    }


    async GetWebhooksById(webhookId: string): Promise<IWebhookEntity | null> {

        const queryResult = await this.dynamoDb.query({
            TableName: process.env.webhooklogsTable || "",
            KeyConditionExpression: `#PK = :pk and #SK = :sk)`,
            ExpressionAttributeNames: {
                "#PK": "PK",
                "#SK": "SK"
            },
            ExpressionAttributeValues: {
                ":pk": "WH",
                ":sk": `WH#${webhookId}`
            }
        }).promise();

        const result: IWebhookEntity[] = (queryResult.Items || []).map(item => ({
            id: (item.SK.replace('WH#', '')) as string,
            name: (item.name) as string
        }));

        return result[0] ?? null;

    }


    async CreateWebhook(name: string): Promise<IWebhookEntity | null> {

        // Crate the webhook entity
        const wh: IWebhookEntity = { id: uuid.generate(), name: name };

        try {
            // save the entity to dynamodb
            const result = await this.dynamoDb.put({
                TableName: process.env.webhooklogsTable || "",
                Item: {
                    PK: `WH`,
                    SK: `WH#${wh.id}`,
                    name: wh.name
                }
            }).promise();

            // return the entity
            return wh;
        }
        catch (ex: any) {
            console.log(ex);
            return null;
        }
    }
}

