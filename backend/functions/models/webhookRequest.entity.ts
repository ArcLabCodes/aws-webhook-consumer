
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
    body: any | undefined,
}

export interface INewWebhookRequestEntry {
    webhookId: string,
    headers: Dictionary,
    pathParams: Dictionary | undefined,
    queryParams: Dictionary | undefined
    body: any | undefined
}
