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
    fields,
    group_by
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

  if( preview ){
    return (
      <div>
       
      </div>
      
    )
  }else{

    return (
      <div className="design-zone-container" style={{ zIndex }}>
        {renderFrontLiner(id, parent)}
        <div
          className={`design-zone chart-design ${isActive() ? "design-zone-active" : ""}`}
          onClick={SwitchingState} onMouseEnter={ComponentHover}
          style={{ zIndex }}
        > 
              {
                group_by.length == 2 &&
                  <table className="preview-table">
                    <thead>
                      <tr>
                        <th> </th>
                        <th>
                           { group_by[1].field_name }
                        </th>
                        <th>
                           { group_by[1].field_name }
                        </th>
                        <th>
                           { group_by[1].field_name }
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{group_by[0].field_name}</td><td></td><td></td><td></td>
                      </tr>
                      <tr>
                        <td>{group_by[0].field_name}</td><td></td><td></td><td></td>
                      </tr>
                    </tbody>
                  </table>
              }
            
          
          
          <div id="html-dist"></div>
  
        </div>
        {renderBackLiner(id, parent)}
      </div>
    )
  }
}