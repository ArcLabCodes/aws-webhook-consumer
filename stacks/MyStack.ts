import { StackContext, Api, Table } from "@serverless-stack/resources";

export function MyStack({ stack }: StackContext) {

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
					webhooklogsTable: ddbWebhooklogs.tableName
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

	stack.addOutputs({
		ApiEndpoint: api.url,
	});

	return {
		api
	};
}
