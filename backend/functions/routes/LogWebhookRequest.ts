import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import AWS from 'aws-sdk';
import * as WehbookRequestEntity from '../models/webhookRequest.entity';
import { IWebhookRequestRepo, WebhookRequestRepo } from "functions/repository/WebhookRequestRepo";
import { INewWebhookRequestEntry } from "../models/webhookRequest.entity";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const webhookRequestRepo: IWebhookRequestRepo = new WebhookRequestRepo(dynamoDb);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {

	const webhookId = event.pathParameters?.id ?? 'undefined'

	const requestEntry: INewWebhookRequestEntry = {
		webhookId: webhookId,
		pathParams: event.pathParameters,
		queryParams: event.queryStringParameters,
		headers: event.headers,
		body: event.body,
	};

	await webhookRequestRepo.CreateRequestLog(requestEntry);

	return {
		statusCode: 200
	};
};
