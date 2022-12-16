import React from "reactn";
import { Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/pro-solid-svg-icons";
import styled from "styled-components";
import set from "lodash.set";

import RuleItem from "./RuleItem";
import RuleAction from "./RuleAction";

const StyledList = styled.div`
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 1px solid #ccc;
`;

const EventDetails = styled.div`
  margin-left: 1rem;
  padding: 0.5rem;
  background-color: #f0f0f0;
`;

const RuleCondition = ({
  condition,
  event = null,
  eventType,
  schema,
  onChange,
  onEventChange,
  onRemove,
}) => {
  const condKey = condition.any ? "any" : "all";
  const defaultFact = Object.keys(schema.fields)[0];

  const handleChange = (newRule, ruleIndex) => {
    const updates = [...condition[condKey]];
    updates[ruleIndex] = newRule;
    onChange({ [condKey]: [...updates] });
  };

  const handleRemove = (ruleIndex) => {
    const updates = condition[condKey].filter(
      (v, index) => index !== ruleIndex
    );
    onChange({ [condKey]: [...updates] });
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <Form.Select
        value={condKey}
        style={{ maxWidth: 200, display: "inline-block" }}
        onChange={(e) => onChange({ [e.target.value]: condition[condKey] })}
      >
        <option value="all">All</option>
        <option value="any">Any</option>
      </Form.Select>
      <Button
        variant="btn-light"
        onClick={() =>
          onChange({
            [condKey]: [
              ...condition[condKey],
              { fact: defaultFact, operator: "equal", value: "" },
            ],
          })
        }
      >
        <FontAwesomeIcon icon={faPlus} fixedWidth={true} /> Rule
      </Button>
      <Button
        variant="btn-light"
        onClick={() =>
          onChange({ [condKey]: [...condition[condKey], { any: [] }] })
        }
      >
        <FontAwesomeIcon icon={faPlus} fixedWidth={true} /> Group
      </Button>
      <Button variant="btn-light" onClick={() => onRemove()}>
        <FontAwesomeIcon icon={faTrash} fixedWidth={true} /> Remove
      </Button>
      <StyledList>
        {condition[condKey].map((rule, ruleIndex) => {
          if (rule.any || rule.all) {
            return (
              <RuleCondition
                key={ruleIndex}
                condition={rule}
                eventType={eventType}
                schema={schema}
                onChange={(newRule) => handleChange(newRule, ruleIndex)}
                onRemove={() => handleRemove(ruleIndex)}
              />
            );
          }

          return (
            <RuleItem
              key={ruleIndex}
              rule={rule}
              eventType={eventType}
              schema={schema}
              onChange={(newRule) => handleChange(newRule, ruleIndex)}
              onRemove={() => handleRemove(ruleIndex)}
            />
          );
        })}
      </StyledList>
      {event ? (
        <EventDetails>
          <Button
            variant="outline-secondary"
            onClick={() => {
              const updates = { ...event };
              updates.params.actions.push({
                type: "intros",
                message: "Custom message",
              });
              onEventChange(updates);
            }}
          >
            <FontAwesomeIcon icon={faPlus} fixedWidth={true} /> Add Success
            Action
          </Button>
          {event.params.actions
            ? event.params.actions.map((action, actionIndex) => {
                return (
                  <RuleAction
                    key={actionIndex}
                    action={action}
                    eventType={eventType}
                    schema={schema}
                    onChange={(newAction) => {
                      const list = [...event.params.actions];
                      list[actionIndex] = newAction;
                      onEventChange({ ...event, params: { actions: list } });
                    }}
                    onRemove={() => {
                      const list = [...event.params.actions].filter(
                        (v, i) => i !== actionIndex
                      );
                      onEventChange({ ...event, params: { actions: list } });
                    }}
                  />
                );
              })
            : null}
        </EventDetails>
      ) : null}
    </div>
  );
};

export default RuleCondition;
