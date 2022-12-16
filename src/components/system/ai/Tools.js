import React from "reactn";

import MainLayout from "../../layout/MainLayout";
import Tabs from "../../common/Tabs";

import QueryTest from "./components/QueryTest";
import QueryBuilderTest from "./components/QueryBuilderTest";

const Tools = () => {
  return (
    <MainLayout>
      <Tabs
        tabs={[
          {
            label: "Query Builder",
            content: <QueryBuilderTest />,
          },
          {
            label: "Query Test",
            content: <QueryTest />,
          },
        ]}
      />
    </MainLayout>
  );
};

export default Tools;
