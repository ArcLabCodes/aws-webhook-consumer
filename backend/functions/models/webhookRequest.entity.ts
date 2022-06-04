import { DocumentClient } from "aws-sdk/clients/dynamodb";

interface Dictionary {
    [name: string]: string | undefined,
}

export interface IWebhookRequestEntity {
    webhookId: string,
    requestId: string | undefined,
    createdAt: Date,
    headers: Dictionary,
    pathParams: Dictionary | undefined,
    queryParams: Dictionary | undefined
    body: string | undefined,
}

export interface INewWebhookRequestEntry {
    webhookId: string,
    headers: Dictionary,
    pathParams: Dictionary | undefined,
    queryParams: Dictionary | undefined
    body: string | undefined
}
