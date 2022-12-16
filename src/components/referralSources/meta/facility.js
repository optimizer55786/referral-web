const fields = [
  {
    label: "Facility Type",
    type: "select",
    name: "facilityType",
    options: [
      {
        label: "Group",
        value: "group",
      },
      {
        label: "Hospital",
        value: "hospital",
      },
      {
        label: "Private Practice",
        value: "private_practice",
      },
    ],
  },
  {
    label: "Website",
    type: "text",
    name: "website",
  },
  {
    label: "Phone",
    type: "phone",
    name: "phone",
  },
  {
    label: "Fax",
    type: "phone",
    name: "fax",
  },
];

export default fields;
