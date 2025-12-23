import understandingAgent from "../services/agents/understandingAgent.js";
import retrievalAgent from "../services/agents/retrievalAgent.js";
import reasoningAgent from "../services/agents/reasoningAgent.js";
import verificationAgent from "../services/agents/verificationAgent.js";

export async function runOrchestrator(query) {
  // 1️⃣ Understand
  const understanding = await understandingAgent.analyze(query);

  // 2️⃣ Retrieve
  const retrieval = await retrievalAgent.retrieve(query, understanding);

  if (!retrieval.result.retrievedChunks.length) {
    return {
      success: false,
      answer:
        "This information is not present in the uploaded documents."
    };
  }

  // 3️⃣ Reason
  const answer = await reasoningAgent.generateAnswer(
    query,
    understanding,
    retrieval.result.retrievedChunks
  );

  // 4️⃣ Verify
  const verification = await verificationAgent.verify(
    query,
    answer,
    retrieval.result
  );

  if (verification.result.finalVerdict !== "approved") {
    return {
      success: false,
      answer:
        "This query requires human assistance or more documentation.",
      verification: verification.result
    };
  }

  return {
    success: true,
    answer,
    verification: verification.result,
    sources: retrieval.result.sources
  };
}
