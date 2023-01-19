import {
  orkesConductorClient,
  WorkflowExecutor,
  workflow,
  waitTaskDuration,
  generateInlineTask,
  switchTask,
  terminateTask,
  httpTask,
} from "@io-orkes/conductor-javascript";

const KEY = '41e19c3a-a68f-436b-83f6-da7625f96b35'
const SECRET = 'H4BdJjDYFO9DIMYnrtOZFTNFQgpPE7nRTUoDhW6vCIEBw6Ka'
const CONDUCTOR_SERVER_URL = 'https://tmo-poc.orkesconductor.io/api'
// const SERVER_URL = 'https://tmo-poc.orkesconductor.io/api'

const createCheckoutWorkflow = () =>
  workflow("Demo-workflow", [
    // waitTaskDuration("confirmation_wait", "15 seconds"),
    httpTask(
      "http_test",
      {
        uri: "https://dummy.restapiexample.com/api/v1/employees",
        method: "GET",
        readTimeOut: 0
      },

    ),
    waitTaskDuration("confirmation_wait", "10 seconds"),
    //added simple task to check the work flow
    generateInlineTask({
      name: "console_test",
      inputParameters: {
        products: "${http_test.output.response.body.data}",
        expression: function ($) {
          return function () {
            var names = [];
            for (var i = 0; i < $.products.length; i++) {
              names.push($.products[i].employee_name);
            }
            return names
          };
        },
      },
    }),
    // switchTask("switch_has_credit", "${check_credit_ref.output.result}", {
    //   noCredit: [
    //     terminateTask(
    //       "termination_noCredit",
    //       "FAILED",
    //       "User has no credit to complete"
    //     ),
    //   ],
    //   hasCredit: [
    //     terminateTask(
    //       "termination_successfull",
    //       "COMPLETED",
    //       "User completed checkout successfully"
    //     ),
    //   ],
    // }),
  ]);

export const playConfig = {
  keyId: KEY,
  keySecret: SECRET,
  serverUrl: `${CONDUCTOR_SERVER_URL}`,
};

(async () => {
  const clientPromise = orkesConductorClient(playConfig);
  const client = await clientPromise;
  const executor = new WorkflowExecutor(client);
  const wf = createCheckoutWorkflow();
  executor.registerWorkflow(true, wf);
})();