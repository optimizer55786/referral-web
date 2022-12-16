import React from "reactn";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import SmallCard from "./SmallCard";

const flatMap = (array, fn) => {
  var result = [];
  for (var i = 0; i < array.length; i++) {
    var mapping = fn(array[i]);
    result = result.concat(mapping);
  }
  return result;
}
const InfoCard = ({ info }) => {
  let result = [];
  if(info.links){
    for(let link of info.links){
      let text = result.length  === 0 ? info.text : result[result.length - 1];
      if(result.length) result.pop(); 
      result = flatMap(text.split(`$link${link.key}$`), function (part) {
        return [part, <Link to={link.to}>{link.label}</Link>];
      });
      result.pop();
    }
  }
  if(info.labels){
    for(let label of info.labels){
      let text = result.length  === 0 ? info.text : result[result.length - 1];
      if(result.length) result.pop(); 
      result = result.concat(flatMap(text.split(`$label${label.key}$`), function (part) {
        return [part, <abbr className={`text-${label.color} fw-${label.weight}`}>{label.label}</abbr>];
      }));
      result.pop();
    }
  }
  return (
    <SmallCard >
      {result}
    </SmallCard>
  );
};

InfoCard.propTypes = {
  title: PropTypes.object,
};

export default InfoCard;
