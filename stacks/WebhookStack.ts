import { StackContext, Api, Table, Topic } from "@serverless-stack/resources";

export function WebhookStack({ stack }: StackContext) {

	const webhookTopic = new Topic(stack, "webhooknotifications");


	const ddbWebhooklogs = new Table(stack, "webhooklogs", {
		fields: {
			PK: "string",
			SK: "string",
		},
		primaryIndex: { partitionKey: "PK", sortKey: "SK" }
	});

	const api = new Api(stack, "api", {
		defaults: {
			function: {
				permissions: [ddbWebhooklogs],
				environment: {
					webhooklogsTable: ddbWebhooklogs.tableName,
					webhookTopicArn: webhookTopic.topicArn
				}
			}
		},
		routes: {
			"GET /": "functions/routes/GetWebhookTopics.handler",
			"GET /{id}": "functions/routes/GetWebhookREquests.handler",
			"POST /new": "functions/routes/CreateWebhookTopic.handler",
			"ANY /wh/{id}": "functions/routes/LogWebhookRequest.handler",
		},
	});

	api.attachPermissions([webhookTopic]);

	stack.addOutputs({
		ApiEndpoint: api.url,
		TopicArn: webhookTopic.topicArn
	});

	return {
		api
	};
}
