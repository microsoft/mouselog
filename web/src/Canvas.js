import React from "react";
import {Circle, Layer, Line, Stage} from "react-konva";
import {getPoints} from "./Shared";
import {Text as KonvaText} from "react-konva/";

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
    };
  }

  renderRuler(width, height, scale) {
    let objs = [];

    for (let x = 0; x < width; x += 200) {
      objs.push(
          <Line
              points={[x * scale, 0, x * scale, 5]}
              stroke="black"
              strokeWidth={0.5}
          />
      );
      objs.push(
          <KonvaText
              x={x * scale - 25}
              y={10}
              text={x.toString()}
          />
      );
    }

    for (let y = 0; y < height; y += 200) {
      objs.push(
          <Line
              points={[0, y * scale, 5, y * scale]}
              stroke="black"
              strokeWidth={0.5}
          />
      );
      objs.push(
          <KonvaText
              x={10}
              y={y * scale - 10}
              text={y.toString()}
          />
      );
    }

    return objs;
  }

  renderEvents(trace, scale, focusIndex) {
    let objs = [];

    trace.events.forEach(function (event, index) {
      let radius = 2;
      if (focusIndex === index) {
        radius += 10;
      }

      if (event.type === 'mousemove') {
        objs.push(<Circle x={event.x * scale} y={event.y * scale} radius={radius} fill="blue"/>);
      } else if (event.type === 'touchmove') {
        objs.push(<Circle x={event.x * scale} y={event.y * scale} radius={radius} fill="purple"/>);
      } else if (event.type === 'click') {
        objs.push(<Circle x={event.x * scale} y={event.y * scale} radius={radius + 6} fill="red" opacity={0.5}/>);
      } else if (event.type === 'contextmenu') {
        objs.push(<Circle x={event.x * scale} y={event.y * scale} radius={radius + 6} fill="green" opacity={0.5}/>);
      }
    });

    return objs;
  }

  render() {
    const trace = this.props.trace;
    const size = this.props.size;
    const isBackground = this.props.isBackground;

    const scale = size.scale;
    const width = size.width;
    const height = size.height;

    if (!isBackground) {
      return (
          <Stage width={width} height={height}
                 style={{border: '1px solid rgb(232,232,232)', marginLeft: '5px', marginRight: '5px'}}>
            <Layer>
              <Line
                  points={getPoints(trace, scale)}
                  stroke="black"
                  strokeWidth={1}
              />
              {
                (trace !== null) ? this.renderRuler(trace.width, trace.height, scale) : null
              }
              {
                (trace !== null) ? this.renderEvents(trace, scale, this.props.focusIndex) : null
              }
              {
                (trace !== null && trace.ruleStart !== -1 && trace.ruleEnd !== -1) ? <Line
                        points={getPoints(trace, scale).slice(trace.ruleStart * 2, trace.ruleEnd * 2)}
                        stroke="red"
                        strokeWidth={2}
                    />
                    : null
              }
            </Layer>
          </Stage>
      )
    } else {
      return (
          <Stage width={width} height={height}
                 style={{
                   border: '1px solid rgb(232,232,232)',
                   marginLeft: '5px',
                   marginRight: '5px',
                   background: 'rgb(245,245,245)'
                 }}>
          </Stage>
      )
    }
  }

}

export default Canvas;
