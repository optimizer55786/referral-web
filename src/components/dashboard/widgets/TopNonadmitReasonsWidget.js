import React from "reactn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons";
import styled from "styled-components";

import ContentBlock from "../../common/ContentBlock";

const StyledParagraph = styled.p`
  font-weight: 600;
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
`;

const TopNonadmitReasonsWidget = ({ data }) => {
  return (
    <ContentBlock
      title={
        <>
          <FontAwesomeIcon icon={faExclamationTriangle} fixedWidth={true} /> Top
          Nonadmit Reasons
        </>
      }
    >
      {data.nonadmitReasons.length === 0 ? (
        <p className="lead text-center">No data available.</p>
      ) : (
        <table className="w-100">
          <thead></thead>
          <tbody>
            {data.nonadmitReasons.map((reason, key) => (
              <tr key={key}>
                <td>
                  <StyledParagraph>
                    {key + 1}. {reason.nonadmit_reason}
                  </StyledParagraph>
                </td>
                <td className="text-end">
                  <StyledParagraph>{reason.count}</StyledParagraph>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </ContentBlock>
  );
};

export default TopNonadmitReasonsWidget;
