const understandingAgent = require('./agents/understandingAgent');
const retrievalAgent = require('./agents/retrievalAgent');
const reasoningAgent = require('./agents/reasoningAgent');
const verificationAgent = require('./agents/verificationAgent');
const actionAgent = require('./agents/actionAgent');

class Orchestrator {
  async processQuery(query, options = {}) {
    const workflow = {
      query: query,
      startTime: new Date(),
      steps: [],
      finalResponse: null,
      status: 'processing'
    };

    try {
      // Step 1: Understanding
      console.log('[Orchestrator] Starting Understanding Agent...');
      const understanding = await understandingAgent.analyze(query);
      workflow.steps.push(understanding);

      // Step 2: Retrieval
      console.log('[Orchestrator] Starting Retrieval Agent...');
      const retrieval = await retrievalAgent.retrieve(query, understanding.result);
      workflow.steps.push(retrieval);

      // Step 3: Reasoning
      console.log('[Orchestrator] Starting Reasoning Agent...');
      const reasoning = await reasoningAgent.reason(query, understanding.result, retrieval.result);
      workflow.steps.push(reasoning);

      // Step 4: Verification
      console.log('[Orchestrator] Starting Verification Agent...');
      const verification = await verificationAgent.verify(
        query,
        reasoning.result.answer,
        retrieval.result
      );
      workflow.steps.push(verification);

      // Step 5: Actions (optional)
      if (options.generateActions) {
        console.log('[Orchestrator] Starting Action Agent...');
        const actions = await actionAgent.determineActions(
          query,
          understanding.result,
          reasoning.result.answer,
          verification.result
        );
        workflow.steps.push(actions);
      }

      // Build final response
      workflow.finalResponse = {
        answer: reasoning.result.answer,
        confidence: reasoning.result.confidence,
        sources: reasoning.result.sourcesUsed,
        verification: verification.result,
        understanding: understanding.result,
        actions: workflow.steps.find(s => s.agent === 'Action')?.result
      };

      workflow.status = 'completed';
      workflow.endTime = new Date();
      workflow.duration = workflow.endTime - workflow.startTime;

      return workflow;

    } catch (error) {
      console.error('[Orchestrator] Error:', error);
      workflow.status = 'failed';
      workflow.error = error.message;
      workflow.endTime = new Date();
      return workflow;
    }
  }
}

module.exports = new Orchestrator();