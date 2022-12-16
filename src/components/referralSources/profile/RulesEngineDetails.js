import React, { useEffect, useState } from "reactn";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn, faInfoCircle } from "@fortawesome/pro-solid-svg-icons";

import ContentBlock from "../../common/ContentBlock";
import SmallCard from "../../common/SmallCard";

const RulesEngineDetails = ({ refSource, rulesEngineEvents }) => {
  const [introQuestions, setIntroQuestions] = useState(null);
  const [hotTopics, setHotTopics] = useState(null);

  useEffect(() => {
    if (!rulesEngineEvents || rulesEngineEvents.length === 0) {
      setIntroQuestions(null);
      setHotTopics(null);
      return;
    }

    const intros = [];
    const topics = [];

    rulesEngineEvents.forEach((event) => {
      event.params.actions.forEach((act) => {
        if (act.type === "intros") {
          intros.push(act);
        } else if (act.type === "hot-topic") {
          topics.push(act);
        }
      });
    });

    setIntroQuestions(intros);
    setHotTopics(topics);
  }, [rulesEngineEvents]);

  return (
    <Row>
      {introQuestions && introQuestions.length > 0 ? (
        <Col className="mb-3">
          <ContentBlock title="Intro Questions">
            {introQuestions.map((row, rowIndex) => (
              <SmallCard key={rowIndex}>
                <FontAwesomeIcon icon={faInfoCircle} fixedWidth={true} />{" "}
                {row.message}
              </SmallCard>
            ))}
          </ContentBlock>
        </Col>
      ) : null}

      {hotTopics && hotTopics.length > 0 ? (
        <Col className="mb-3">
          <ContentBlock title="Hot Topics">
            {hotTopics.map((row, rowIndex) => (
              <SmallCard key={rowIndex}>
                <FontAwesomeIcon icon={faBullhorn} fixedWidth={true} />{" "}
                {row.message}
              </SmallCard>
            ))}
          </ContentBlock>
        </Col>
      ) : null}
    </Row>
  );
};

export default RulesEngineDetails;
