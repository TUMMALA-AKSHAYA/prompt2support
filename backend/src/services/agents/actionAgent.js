class ActionAgent {
  async determineActions(query, understanding, answer, verification) {
    const actions = [];

    if (['high', 'critical'].includes(understanding.priority)) {
      actions.push({
        type: 'create_ticket',
        data: {
          subject: query.substring(0, 100),
          priority: understanding.priority,
          category: understanding.category
        }
      });
    }

    if (
      understanding.requiresHumanEscalation ||
      verification.finalVerdict === 'escalate_to_human'
    ) {
      actions.push({
        type: 'schedule_calendar_event',
        data: {
          title: 'Customer Support Callback',
          priority: understanding.priority
        }
      });
    }

    actions.push({
      type: 'draft_email',
      data: {
        subject: `Re: ${understanding.category}`,
        body: answer
      }
    });

    if (understanding.intent === 'send_email') {
      actions.push({
        type: 'send_email',
        data: {
          to: understanding.entities?.email,
          subject: 'Support Response',
          body: answer
        }
      });
    }

    return actions;
  }
}

export default new ActionAgent();
