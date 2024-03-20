import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chart from "react-apexcharts";
import $ from "jquery";

const BarcodeActivation = (props) => {
  const { cache, gridState, preview } = useSelector((state) => state);
  const {
    id,
    zIndex,
    insertComponent,
    renderFrontLiner,
    renderBackLiner,
    parent,
    content,
    params,
    fields,
  } = props;
  console.log(props);
  const dispatch = useDispatch();

  const isActive = () => {
    /**
     * Nếu nhỏ này là có id là activeComponent hay hoverComponent thì kể như đang active
     */

    const { activeComponent, hoverComponent } = cache;
    if (activeComponent.indexOf(id) !== -1 || hoverComponent == id) {
      return true;
    }
    return false;
  };

  const SwitchingState = () => {
    /**
     *  Chuyển đổi trạng thái active cho nhỏ này
     */

    const { activeComponent } = cache;
    if (activeComponent != id) {
      dispatch({
        branch: "design-ui",
        type: "setActiveComponent",
        payload: {
          id,
        },
      });
      $("#property-trigger").click();
    }
  };

  const ComponentHover = () => {
    /**
     *  Chuyển đổi trạng thái hover cho nhỏ này
     */

    dispatch({
      branch: "design-ui",
      type: "setHoverComponent",
      payload: {
        id,
      },
    });
  };

  return (
    <div className="design-zone-container" style={{ zIndex }}>
      {renderFrontLiner(id, parent)}
      <div
        className={`design-zone table-design chart-design ${
          isActive() ? "design-zone-active" : ""
        } `}
        onClick={SwitchingState}
        onMouseEnter={ComponentHover}
        style={{ zIndex }}
      >
        <span className="chart-title">{content}</span>
        <div className="chart-criterias">
          <div className="row block-statis">
            {params?.map((field) => (
              <Criteria field={field} />
            ))}
          </div>
        </div>
        <div className="preview">
         <div className="top-utils">
         <div className="table-name">
            <p className="main-input">
              {props?.name
                ? props.name
                : `Cập nhật bảng: ${props?.table.table_name}`}
            </p>
          </div>
         </div>
          <div className="preview-table border-0">
            <p className="fw-bold">{props?.master.table_name}</p>
              <select class="form-select" aria-label="Default select example">
                <option selected>001</option>
                <option value="1">002</option>
                <option value="2">003</option>
                <option value="3">004</option>
              </select>
              <div className="condition" >
                <p className="mt-3 mb-3">Điều kiện lọc: <span className="fw-bold">{props?.criteria.field_name}</span></p>
                <label className="mr-2">Từ: </label>
                <input></input>
                <label className="ml-4 mr-2">Đến: </label>
                <input></input>
              </div>
          </div>
        </div>
        {/* <div id="html-dist"></div> */}
      </div>
      {renderBackLiner(id, parent)}
    </div>
  );
};
export default BarcodeActivation;
const Criteria = (props) => {
  const { field } = props;

  const { DATATYPE } = field.props;

  let type = "text";

  if (["DATE", "DATETIME"].indexOf(DATATYPE) != -1) {
    if (DATATYPE == "DATE") {
      type = "date";
    } else {
      type = "datetime-local";
    }
  }
  if (
    ["INT", "INT UNSIGNED", "BIGINT", "BIGINT UNSIGNED"].indexOf(DATATYPE) != -1
  ) {
    type = "number";
  }

  if (DATATYPE == "BOOL") {
    type = "bool";
  }

  return (
    <div className="col-md-4 criteria">
      <div className="form-group">
        <div className="criteria-label">
          <label>{field.field_name}</label>
        </div>

        <div className="criteria-input">
          {type == "bool" ? (
            <div>
              <select className="form-select form-control">
                <option>{field.props.DEFAULT_TRUE}</option>
                <option>{field.props.DEFAULT_FALSE}</option>
              </select>
            </div>
          ) : (
            <div>
              <input className="form-control" type={type} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
