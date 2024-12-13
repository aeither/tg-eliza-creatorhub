
import { type EnvironmentName, Payments, type TaskLogMessage, generateStepId } from '@nevermined-io/payments';

const NVM_API_KEY = process.env.NVM_API_KEY
const NVM_ENVIRONMENT = "staging"
const PLAN_DID = "did:nv:572d7048e4f1b4f340c6063d285998c0c5ff33602a950fbe242c25c0cb712e47"
const AGENT_DID = "did:nv:cb728c3fe9b60b9775153ea03aa2c23e35152f7e8b271ce46e18852cf09d44db"

export async function handleInitStep(step: any, payments: any) {
    const scriptStepId = generateStepId();
    const characterStepId = generateStepId();
    const imageStepId = generateStepId();

    const steps = [
        { step_id: scriptStepId, task_id: step.task_id, name: "generateScript", predecessor: step.step_id },
        { step_id: characterStepId, task_id: step.task_id, name: "extractCharacters", predecessor: scriptStepId },
        { step_id: imageStepId, task_id: step.task_id, name: "generateImagesForCharacters", predecessor: characterStepId },
    ];

    await payments.query.createSteps(step.did, step.task_id, { steps });
}

const main = async () => {
    console.log("hello world");
    const payments = Payments.getInstance({
        nvmApiKey: NVM_API_KEY,
        environment: NVM_ENVIRONMENT as EnvironmentName,
    })

    const balanceResult = await payments.getPlanBalance(PLAN_DID)
    console.log("🚀 ~ main ~ balanceResult:", balanceResult)


    if (balanceResult.balance < 1) {
        await payments.orderPlan(PLAN_DID)
    }

    const accessConfig = await payments.getServiceAccessConfig(AGENT_DID)
    const queryOpts = {
        accessToken: accessConfig.accessToken,
        proxyHost: accessConfig.neverminedProxyUri
    }

    console.log("🚀 ~ main ~ accessConfig:", accessConfig)

    const aiTask = {
        query: "hello world",
        name: 'text2speech',
        additional_params: [],
        artifacts: [],
    }

    // await payments.query.subscribe(() => {}, {
    //     joinAgentRooms: [AGENT_DID],
    //     subscribeEventTypes: ['step-updated'],
    // })

    const taskResult = await payments.query.createTask(AGENT_DID, aiTask, queryOpts, async (data) => {
        const taskLog: TaskLogMessage = JSON.parse(data)
        console.log("🚀 ~ taskResult ~ taskLog:", taskLog)
    })

    console.log("🚀 ~ taskResult ~ taskResult:", taskResult)

    // TODO
    // if (balanceResult.balance < 1) {
    //     const orderResult = await payments.orderPlan(PLAN_DID);
    //     if (!orderResult.success) {
    //         await payments.query.updateStep(step.did, {
    //             ...step,
    //             step_status: "Failed",
    //             output: "Insufficient balance and failed to order credits.",
    //         });
    //         return false;
    //     }
    // }
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


