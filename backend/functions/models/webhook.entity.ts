import { DocumentClient } from "aws-sdk/clients/dynamodb";

export interface IWebhookEntity {
    id: string | undefined;
    name: string;
};

