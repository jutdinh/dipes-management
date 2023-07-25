import React, { useState, useEffect } from "react";
import Timeline from "react-timelines";
import moment from 'moment';
import "react-timelines/lib/css/style.css";
import { StatusEnum, StatusTask, Roles, StatusStatisticalTask } from '../enum/status';
import { useDispatch, useSelector } from 'react-redux';
import tasks from "../tasks/tasks";

const clickElement = element => alert(`Clicked element\n${JSON.stringify(element, null, 2)}`);
const MIN_ZOOM = 27;
const MAX_ZOOM = 35;

const TimelineChart = ({ data }) => {
  const { lang, proxy, auth, functions } = useSelector(state => state);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(MAX_ZOOM);
  const [start, setStart] = useState(moment().startOf('quarter').toDate());
  const [end, setEnd] = useState(moment().quarter(moment().quarter()).endOf('quarter').toDate());
  const [timebar, setTimebar] = useState([]);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const buildTimebar = () => {
      // ...your timebar initialization...
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      const months = [
        lang["january"],
        lang["february"],
        lang["march"],
        lang["april"],
        lang["may"],
        lang["june"],
        lang["july"],
        lang["august"],
        lang["september"],
        lang["october"],
        lang["november"],
        lang["december"],
      ];

      const years = Array.from({ length: 4 }, (_, i) => {
        const year = moment().year() + i;
        const quartersCells = quarters.map((q, j) => {
          return {
            id: `${year}-${q}`,
            title: `${year} ${q}`,
            start: moment({ year }).quarter(j + 1).startOf('quarter').toDate(),
            end: moment({ year }).quarter(j + 1).endOf('quarter').toDate(),
            children: Array.from({ length: 3 }, (_, k) => {
              const month = j * 3 + k;
              return {
                id: `${year}-${month + 1}`,
                title: months[month],
                start: moment({ year, month }).startOf('month').toDate(),
                end: moment({ year, month }).endOf('month').toDate(),
                children: Array.from({ length: moment({ year, month }).daysInMonth() }, (_, d) => {
                  const day = d + 1;
                  return {
                    id: `${year}-${month + 1}-${day}`,
                    title: `${day}`,
                    start: moment({ year, month, day }).startOf('day').toDate(),
                    end: moment({ year, month, day }).endOf('day').toDate(),
                  };
                })
              };
            }),
          };
        });

        return {
          id: `${year}`,
          title: `${year}`,
          start: moment({ year }).startOf('year').toDate(),
          end: moment({ year }).endOf('year').toDate(),
          cells: quartersCells,
        };
      });

      return [
        { id: 'years', title: lang["gantt.year"], cells: years },
        { id: 'quarters', title: lang["gantt.quarters"], cells: years.flatMap(year => year.cells) },
        { id: 'months', title: lang["gantt.months"], cells: years.flatMap(year => year.cells.flatMap(quarter => quarter.children)) },
        { id: 'days', title: lang["gantt.day"], cells: years.flatMap(year => year.cells.flatMap(quarter => quarter.children.flatMap(month => month.children))) },
      ];
    };

    const statusTaskView = [
      StatusTask.INITIALIZATION.color,
      StatusTask.IMPLEMENT.color,
      StatusTask.COMPLETE.color,
      StatusTask.PAUSE.color
    ]

    const styles = {
        container: {
            position: "relative",
        },

        images: {
            position: "absolute",
            right: 0,
            top: 0,
            padding: "0 8px",
        },
    }

    const tracks = data.map((task, index) => ({
      id: index + 1,
      title: (<div style={styles.container}>
        <div style={ styles.images }>
            { task.members?.map( mem =>                 
                <img style={{ width: "22px" }} class="img-responsive circle-image" src={proxy + mem.avatar} alt="#" />
            ) }
        </div>
        <span> Task {index + 1}</span>
    
    </div>),
      elements: [{
        id: 0,
        title:  task.task_name,
        start: moment(task.start).toDate(),
        end: moment(task.end).toDate(),
        // img: <img class="img-responsive circle-image" src={proxy + tasks.members?.avatar} alt="#" />,
        style: {
          backgroundColor: `${statusTaskView[task.task_status - 1]}`,
          borderRadius: `4px`,
          boxShadow: `0 5px 20px rgba(0, 0, 0, 0.05)`,
        }
      }]      
    }));

    setTimebar(buildTimebar());
    setTracks(tracks);

  }, [data, lang]); // dependencies for useEffect, adjust as needed

  const handleToggleOpen = () => setOpen(!open);
  const handleZoomIn = () => setZoom(Math.min(zoom + 4, MAX_ZOOM));
  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 2, MIN_ZOOM);
    if (newZoom === MIN_ZOOM) {
      setStart(moment().startOf('quarter').toDate());
      setEnd(moment().endOf('quarter').toDate());
    } else {
      setStart(moment().startOf('year').toDate());
      setEnd(moment().add(4, 'year').endOf('year').toDate());
    }
    setZoom(newZoom);
  }
  const handleToggleTrackOpen = track => {
    this.setState(state => {
      const tracksById = {
        ...state.tracksById,
        [track.id]: {
          ...track,
          isOpen: !track.isOpen
        }
      };

      return {
        tracksById,
        tracks: Object.values(tracksById)
      };
    });
  };
  const now = moment().toDate();

  return (
    <div className="app">
      <Timeline
        scale={{
          start,
          end,
          zoom,
          zoomMin: MIN_ZOOM,
          zoomMax: MAX_ZOOM
        }}  
        isOpen={open}
        toggleOpen={handleToggleOpen}
        zoomIn={handleZoomIn}
        zoomOut={handleZoomOut}
        clickElement={clickElement}
        timebar={timebar}
        tracks={tracks}
        now={now}
        toggleTrackOpen={handleToggleTrackOpen}
        enableSticky
        scrollToNow
      />
    </div>
  );
}

export default TimelineChart;
