const understandingAgent = require('./agents/understandingAgent');
const retrievalAgent = require('./agents/retrievalAgent');
const reasoningAgent = require('./agents/reasoningAgent');
const verificationAgent = require('./agents/verificationAgent');
const actionAgent = require('./agents/actionAgent');

class Orchestrator {
  async processQuery(query) {
    try {
      console.log('\n[Orchestrator] Starting query processing:', query);

      const workflow = {
        query,
        steps: [],
        timestamp: new Date()
      };

      // Step 1: Understanding Agent - Analyze the query
      console.log('[Orchestrator] Step 1: Understanding Agent');
      const understanding = await understandingAgent.analyze(query);
      workflow.steps.push({
        agent: 'understanding',
        status: 'completed',
        output: understanding,
        timestamp: new Date()
      });
      console.log('[Orchestrator] Understanding:', JSON.stringify(understanding, null, 2));

      // Step 2: Retrieval Agent - Get relevant documents
      console.log('[Orchestrator] Step 2: Retrieval Agent');
      const retrievedContext = await retrievalAgent.search(query, understanding);
      workflow.steps.push({
        agent: 'retrieval',
        status: 'completed',
        output: {
          documentsFound: retrievedContext.length,
          sources: retrievedContext.map(doc => ({
            filename: doc.metadata?.filename,
            chunk: doc.metadata?.chunkIndex,
            relevance: doc.score
          }))
        },
        timestamp: new Date()
      });
      console.log('[Orchestrator] Retrieved', retrievedContext.length, 'relevant chunks');

      // Check if we have context
      if (retrievedContext.length === 0) {
        workflow.steps.push({
          agent: 'system',
          status: 'warning',
          output: 'No relevant documents found. Please upload documents first.',
          timestamp: new Date()
        });

        return {
          success: false,
          answer: "I don't have any documents uploaded yet. Please upload your policy documents, product catalogs, or FAQs first, then I can answer questions based on them.",
          confidence: 0,
          sources: [],
          workflow
        };
      }

      // Step 3: Reasoning Agent - Generate answer using ONLY retrieved context
      console.log('[Orchestrator] Step 3: Reasoning Agent');
      const answer = await reasoningAgent.generateAnswer(
        query,
        understanding,
        retrievedContext
      );
      workflow.steps.push({
        agent: 'reasoning',
        status: 'completed',
        output: { answer },
        timestamp: new Date()
      });
      console.log('[Orchestrator] Answer generated');

      // Step 4: Verification Agent - Verify the answer
      console.log('[Orchestrator] Step 4: Verification Agent');
      const verification = await verificationAgent.verify(
        query,
        answer,
        retrievedContext
      );
      workflow.steps.push({
        agent: 'verification',
        status: 'completed',
        output: verification,
        timestamp: new Date()
      });
      console.log('[Orchestrator] Verification:', JSON.stringify(verification, null, 2));

      // Step 5: Action Agent - Determine if actions needed
      console.log('[Orchestrator] Step 5: Action Agent');
      const actions = await actionAgent.determineActions(
        query,
        understanding,
        answer
      );
      workflow.steps.push({
        agent: 'action',
        status: 'completed',
        output: actions,
        timestamp: new Date()
      });
      console.log('[Orchestrator] Actions:', JSON.stringify(actions, null, 2));

      // Build final response
      const response = {
        success: true,
        answer: verification.isAccurate ? answer : verification.correctedAnswer || answer,
        confidence: verification.confidence,
        sources: retrievedContext.map(doc => ({
          filename: doc.metadata?.filename || 'Unknown',
          chunkIndex: doc.metadata?.chunkIndex,
          text: doc.text?.substring(0, 150) + '...',
          relevance: doc.score
        })),
        actions: actions.actions || [],
        warnings: verification.warnings || [],
        workflow
      };

      console.log('[Orchestrator] Query processing completed successfully\n');
      return response;

    } catch (error) {
      console.error('[Orchestrator] Error:', error);
      throw error;
    }
  }
}

module.exports = new Orchestrator();