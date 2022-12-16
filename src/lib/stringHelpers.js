import React from "react";
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function capitalizeWords(string) {
  return string.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
}

export function camelToSnake(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export const address = (obj) => {
  const parts = [];
  parts.push(obj.street_1 || "");
  if (obj.street_2) {
    parts.push(obj.street_2);
  }
  parts.push(obj.city || "");
  parts.push(`${obj.state || ""} ${obj.zip}`);
  return parts.join(", ");
};

export const nl2br = (text) => {
  return text.split("\n").map((item, key) => {
    return (
      <React.Fragment key={key}>
        {item}
        <br />
      </React.Fragment>
    );
  });
};
