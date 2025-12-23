import understandingAgent from "../services/agents/understandingAgent.js";
import retrievalAgent from "../services/agents/retrievalAgent.js";
import reasoningAgent from "../services/agents/reasoningAgent.js";
import verificationAgent from "../services/agents/verificationAgent.js";

class Orchestrator {
  async handleQuery(query) {
    // 1. Understanding
    const understanding = await understandingAgent.analyze(query);

    // 2. Retrieval
    const retrieval = await retrievalAgent.retrieve(query, understanding.result);

    if (!retrieval.result.retrievedChunks.length) {
      return {
        success: false,
        answer: "This information is not present in the uploaded documents."
      };
    }

    // 3. Reasoning
    const answer = await reasoningAgent.generateAnswer(
      query,
      understanding.result,
      retrieval.result.retrievedChunks
    );

    // 4. Verification
    const verification = await verificationAgent.verify(
      query,
      answer,
      retrieval.result
    );

    if (verification.result.finalVerdict !== "approved") {
      return {
        success: false,
        answer:
          "This query requires human assistance or more documents.",
        verification: verification.result
      };
    }

    return {
      success: true,
      answer,
      sources: retrieval.result.sources,
      confidence: verification.result.confidence
    };
  }
}

export default new Orchestrator();
