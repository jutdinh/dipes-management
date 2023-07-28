import React from "react";
import { getDayMonth } from "../../../node_modules/react-timelines/src/utils/formatDate";

const CustomTooltip = ({ element }) => {
    const { title, start, end } = element;
  
    return (
      <div className="custom-tooltip">
        <div>{title}</div>
        <div>
          <strong>Start:</strong> {getDayMonth(start)}
        </div>
        <div>
          <strong>End:</strong> {getDayMonth(end)}
        </div>
      </div>
    );
  };
export default CustomTooltip;
