import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import AWS from 'aws-sdk';
import * as WehbookRequestEntity from '../models/webhookRequest.entity';
import { IWebhookRequestRepo, WebhookRequestRepo } from "functions/repository/WebhookRequestRepo";
import { INewWebhookRequestEntry } from "../models/webhookRequest.entity";
import { json } from "stream/consumers";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const webhookRequestRepo: IWebhookRequestRepo = new WebhookRequestRepo(dynamoDb);

const sns = new AWS.SNS();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {

	const webhookId = event.pathParameters?.id ?? 'undefined'

	const newRequestEntry: INewWebhookRequestEntry = {
		webhookId: webhookId,
		pathParams: event.pathParameters,
		queryParams: event.queryStringParameters,
		headers: event.headers,
		body: JSON.parse(event.body || "{}"),
	};

	const requestEntry = await webhookRequestRepo.CreateRequestLog(newRequestEntry);

	await sns.publish({
		TopicArn: process.env.webhookTopicArn,
		Message: JSON.stringify(requestEntry),
		MessageStructure: "string"
	}).promise();

	return {
		statusCode: 200
	};
};
