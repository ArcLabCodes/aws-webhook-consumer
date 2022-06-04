import { MyStack } from "./MyStack";
import { App } from "@serverless-stack/resources";
import { FrontendStack } from "./FrontendStack";

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "backend",
    bundle: {
      format: "esm",
    },
  });

  app.stack(MyStack);
  app.stack(FrontendStack);
}
