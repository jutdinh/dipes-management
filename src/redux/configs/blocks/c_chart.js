import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Chart from 'react-apexcharts'
import $ from 'jquery';

export default (props) => {
  const { cache, gridState, preview } = useSelector(state => state)
  const { id, zIndex, insertComponent,
    renderFrontLiner,
    renderBackLiner,
    parent,
    content,
    params,
    fields,
  } = props

  const dispatch = useDispatch()

  const isActive = () => {

    /**
     * Nếu nhỏ này là có id là activeComponent hay hoverComponent thì kể như đang active
     */

    const { activeComponent, hoverComponent } = cache;
    if (activeComponent.indexOf(id) !== -1 || hoverComponent == id) {
      return true
    }
    return false
  }

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
          id
        }
      })
      $('#property-trigger').click()
    }

  }

  const ComponentHover = () => {

    /**
     *  Chuyển đổi trạng thái hover cho nhỏ này
     */

    dispatch({
      branch: "design-ui",
      type: "setHoverComponent",
      payload: {
        id
      }
    })
  }

  const state = {
    series: [{
      data: [15, 21]
    }],
    options: {
      chart: {
        height: 350,
        type: "bar",
        fontFamily: "UTM Avo",

        toolbar: {
          show: false
        },
        events: {
          click: function (chart, w, e) {
            // console.log(chart, w, e)
          }
        }
      },
      colors: [],
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: '12px',
          barHeight: "24px",
          distributed: true,

        }
      },
      dataLabels: {
        enabled: false,
      },

      title: {
        style: {
          fontSize: "32px",
        }
      },

      legend: {
        show: true
      },

      xaxis: {
        categories: [
          'Tiêu chí 1',
          'Tiếu chí 2',

        ],
        labels: {
          style: {
            colors: [],
            fontSize: '12px'
          }
        }
      },
    },
  };

  // if( preview ){
  //   return (
  //     <div>
  //       <div className="chart-criterias">
  //         <div className="row block-statis">
  //           { params?.map( field => <Criteria field={ field } /> ) }
  //         </div>
  //       </div>
  //       <div>
  //         <Chart options={state.options} series={state.series} type="bar" height={350} />
  //       </div>  
  //     </div>    
  //   )
  // }else{

  // }
  return (
    <div className="design-zone-container" style={{ zIndex }}>
      {renderFrontLiner(id, parent)}
      <div
        className={`design-zone chart-design ${isActive() ? "design-zone-active" : ""}`}
        onClick={SwitchingState} onMouseEnter={ComponentHover}
        style={{ zIndex }}
      >

        <span className="chart-title">{content}</span>
        <div className="chart-criterias">
          <div className="row block-statis">
            {params?.map(field => <Criteria field={field} />)}
            <div className="col-md-12 text-right">
              <button className="btn btn-secondary mr-3"><i class="fa fa-history mr-1 icon-search" />Làm mới</button>
              <button className="btn btn-primary mr-3"><i class="fa fa-search mr-1 icon-search" />Tìm Kiếm</button>
            </div>
          </div>
        </div>

        <div>
          <Chart options={state.options} series={state.series} type="bar" height={350} />
        </div>
        {/* <div id="html-dist"></div> */}

      </div>
      {renderBackLiner(id, parent)}
    </div>
  )
}


const Criteria = (props) => {
  const { field } = props;

  const { DATATYPE } = field.props

  let type = "text"

  if (["DATE", "DATETIME"].indexOf(DATATYPE) != -1) {
    if (DATATYPE == "DATE") {
      type = "date"
    } else {
      type = "datetime-local"
    }
  }
  if (["INT", "INT UNSIGNED", "BIGINT", "BIGINT UNSIGNED"].indexOf(DATATYPE) != -1) {
    type = "number"
  }

  if (DATATYPE == "BOOL") {
    type = "bool"
  }

  return (
    <div className="col-md-4 criteria">
      <div className="form-group">
        <div className="criteria-label">
          <label>{field.field_name}</label>
        </div>

        <div className="criteria-input">
          {
            type == "bool" ?
              <div>
                <select className="form-select form-control">
                  <option>{field.props.DEFAULT_TRUE}</option>
                  <option>{field.props.DEFAULT_FALSE}</option>
                </select>
              </div>
              :
              <div>
                <input className="form-control" type={type} />
              </div>
          }
        </div>
      </div>
    </div>
  )
}