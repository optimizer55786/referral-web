import React from "reactn";
import { Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

import MainLayout from "../../layout/MainLayout";
import ContentBlock from "../../common/ContentBlock";
import Tabs from "../../common/Tabs";
import Loading from "../../common/Loading";
import { useApiGet } from "../../../hooks/useApi";

import IntegrationLogsContent from "./components/IntegrationLogsContent";
import FieldMappingsContent from "./components/FieldMappingsContent";
import AdvancedTransformContent from "./components/AdvancedTransformContent";

const Integrations = () => {
  const { isLoading, data } = useApiGet(
    "integrations",
    "/integrations",
    {},
    { onError: (err) => toast.error(err.message) }
  );

  return (
    <MainLayout>
      {isLoading ? (
        <Loading msg="Loading your integration data..." />
      ) : (
        <>
          <Row>
            <Col xs={12} sm={6} className="mb-3">
              <ContentBlock title="Processed">
                <p>Today, MTD, etc</p>
              </ContentBlock>
            </Col>
            <Col xs={12} sm={6} className="mb-3">
              <ContentBlock title="Errors">List of errors</ContentBlock>
            </Col>
          </Row>

          <Tabs
            tabs={[
              {
                label: "Integration Logs",
                content: <IntegrationLogsContent />,
              },
              {
                label: "Field Mappings",
                content: (
                  <FieldMappingsContent
                    integrationSettings={
                      data.integration_setting_id ? data : null
                    }
                  />
                ),
              },
              {
                label: "Advanced Transform",
                content: (
                  <AdvancedTransformContent
                    integrationSettings={
                      data.integration_setting_id ? data : null
                    }
                  />
                ),
              },
            ]}
          />
        </>
      )}
    </MainLayout>
  );
};

export default Integrations;
