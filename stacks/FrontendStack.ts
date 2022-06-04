import { StackContext, StaticSite, use } from "@serverless-stack/resources";
import { MyStack } from "./MyStack";

export function FrontendStack({ stack }: StackContext) {

    const { api } = use(MyStack);

    // const site = new StaticSite(stack, "AngularSite", {
    //     path: "frontend",
    //     buildOutput: "dist",
    //     buildCommand: "ng build --output-path dist",
    //     errorPage: "redirect_to_index_page",
    //     cdk: {
    //         distribution: null
    //     },
    //     // To load the API URL from the environment in development mode (environment.ts)
    //     environment: {
    //         DEV_API_URL: api.url,
    //     },
    // });

    // stack.addOutputs({
    //     FrontendUrl: site.url
    // });

}
