class ActionAgent {
  async determineActions(query, understanding, answer, verification) {
    const actions = [];

    if (['high', 'critical'].includes(understanding.priority)) {
      actions.push({
        type: 'create_ticket',
        data: {
          subject: query.substring(0, 100),
          priority: understanding.priority,
          category: understanding.category,
          status: 'open'
        }
      });
    }

    if (understanding.requiresHumanEscalation || verification.finalVerdict === 'escalate_to_human') {
      actions.push({
        type: 'schedule_callback',
        data: {
          reason: 'Complex query requiring human agent',
          priority: understanding.priority
        }
      });
    }

    actions.push({
      type: 'draft_email',
      data: {
        subject: `Re: ${understanding.category} - Query Response`,
        body: answer,
        priority: understanding.priority
      }
    });

    if (understanding.intent === 'order_status' && understanding.entities.orderId) {
      actions.push({
        type: 'check_order_status',
        data: {
          orderId: understanding.entities.orderId
        }
      });
    }

    return {
      agent: 'Action',
      status: 'completed',
      result: {
        recommendedActions: actions,
        autoExecutable: actions.filter(a => a.type === 'draft_email'),
        requiresApproval: actions.filter(a => a.type !== 'draft_email')
      },
      timestamp: new Date()
    };
  }
}

module.exports = new ActionAgent();