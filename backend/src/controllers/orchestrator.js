import understandingAgent from "../services/agents/understandingAgent.js";
import retrievalAgent from "../services/agents/retrievalAgent.js";
import reasoningAgent from "../services/agents/reasoningAgent.js";
import verificationAgent from "../services/agents/verificationAgent.js";

export async function runOrchestrator(query) {
  // 1️⃣ Understand
  const understanding = await understandingAgent.analyze(query);

  // 2️⃣ Retrieve
  const retrievedChunks = retrievalAgent.retrieve(query, 5);

  if (!retrievedChunks.length) {
    return {
      success: false,
      answer:
        "This information is not present in the uploaded documents."
    };
  }

  // 3️⃣ Reason
  const answer = await reasoningAgent.answer(
    query,
    retrievedChunks
  );

  // 4️⃣ Verify
  const verification = await verificationAgent.verify(
    query,
    answer,
    retrievedChunks
  );

  if (verification.finalVerdict !== "approved") {
    return {
      success: false,
      answer:
        "This query requires human assistance or more documentation.",
      verification
    };
  }

  return {
    success: true,
    answer,
    verification,
    sources: retrievedChunks.map(c => c.metadata?.filename).filter(Boolean)
  };
}
