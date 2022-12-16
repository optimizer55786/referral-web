import React, { useState, useEffect } from "reactn";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/pro-solid-svg-icons";

import RuleCondition from "./RuleCondition";

const schemas = {
  referral_source: {
    fields: {
      referral_source_name: { label: "Referral Source Name", type: "string" },
      referral_source_npi: { label: "Referral Source NPI", type: "string" },
      referral_source_type: { label: "Referral Source Type", type: "string" },
    },
    presets: {
      "referral-source-activity": {
        label: "Referral Source User Activity",
        paths: {
          totalActivity: { label: "Total Activity", type: "number" },
          daysSinceLastActivity: {
            label: "Days Since Last Activity",
            type: "number",
          },
          daysSinceLastVisit: {
            label: "Days Since Last Visit",
            type: "number",
          },
        },
      },
      "referral-source-referrals": {
        label: "Referral History",
        paths: {
          totalReferrals: {
            label: "Total Referrals",
            type: "number",
          },
          daysSinceLastReferral: {
            label: "Days Since Last Referral",
            type: "number",
          },
          daysSinceLastAdmit: {
            label: "Days Since Last Admit",
            type: "number",
          },
        },
      },
    },
    actions: {
      read: [
        { label: "Add Intro Question", key: "intros" },
        { label: "Add Hot Topic", key: "hot-topic" },
      ],
      write: [{ label: "Trigger Alert", key: "alert" }],
    },
  },
  referral: {},
  schedule: {},
  lead: {},
};

const RulesetEditor = ({ rules, eventType, onChange }) => {
  const [eventSchema, setEventSchema] = useState("referral_source");

  useEffect(() => {
    if (!eventType) {
      return;
    }

    const schema = eventType.split("::")[0];
    setEventSchema(schema);
  }, [eventType]);

  return (
    <>
      <Button
        variant="light"
        className="mb-3"
        onClick={() => {
          onChange([
            ...rules,
            {
              conditions: { any: [] },
              event: { type: "actions", params: { actions: [] } },
            },
          ]);
        }}
      >
        <FontAwesomeIcon icon={faPlus} fixedWidth={true} /> Rule Block
      </Button>

      <div>
        {rules.map((cond, condIndex) => {
          return (
            <RuleCondition
              key={condIndex}
              condition={cond.conditions}
              event={cond.event}
              eventType={eventType}
              schema={schemas[eventSchema]}
              onChange={(newCond) => {
                const updates = [...rules];
                updates[condIndex].conditions = newCond;
                onChange(updates);
              }}
              onEventChange={(newEvent) => {
                const updates = [...rules];
                updates[condIndex].event = newEvent;
                onChange(updates);
              }}
              onRemove={() => {
                const updates = [...rules].filter((c, i) => i !== condIndex);
                onChange(updates);
              }}
            />
          );
        })}
      </div>
    </>
  );
};

export default RulesetEditor;
