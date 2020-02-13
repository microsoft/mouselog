/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */

import React from "react";
import {Circle, Group, Image, Layer, Line, Stage} from "react-konva";
import {getPoints} from "./Shared";
import {Text as KonvaText} from "react-konva/";
import {Button, Col, Row, Slider, message} from "antd";
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import { TaskTimer } from 'tasktimer';
import * as Setting from "./Setting";

class Canvas extends React.Component {
  constructor(props) {
    super(props);

    const curEventIndex = this.getCurEvent(0.0);
    if (this.props.clickHandler !== undefined) {
      this.props.clickHandler(curEventIndex);
    }

    this.state = {
      classes: props,
      firstTimestamp: 0.0,
      curTimestamp: 0.0,
      curEventIndex: curEventIndex,
      isPaused: true,
      cursorImage: null,
    };
  }

  componentWillMount() {
    this.initImage();
  }

  printTimestamp(f) {
    return f.toFixed(3);
  }

  getLastTimestamp() {
    return this.props.trace !== null ? this.props.trace.events[this.props.trace.events.length - 1].timestamp : 0.0;
  }

  incrementTimestamp() {
    if (!this.state.isPaused) {
      let curTimestamp;
      if (this.state.curTimestamp >= this.getLastTimestamp()) {
        curTimestamp = 0.0;
        this.setState({
          isPaused: true,
        });
      } else {
        curTimestamp = this.state.curTimestamp + 0.1;
      }

      const curEventIndex = this.getCurEvent(curTimestamp);
      if (!this.state.isPaused && Setting.getEnablePlayerFastForward()) {
        if (curEventIndex + 1 < this.props.trace.events.length) {
          const nextTimestamp = this.props.trace.events[curEventIndex + 1].timestamp - 2.0;
          if (curTimestamp < nextTimestamp) {
            message.success(`Will skip ${this.printTimestamp(nextTimestamp - curTimestamp)} seconds ..`);
            curTimestamp = nextTimestamp;
          }
        }
      }

      // if (curEventIndex !== this.state.curEventIndex) {
      //   if (this.props.clickHandler !== undefined) {
      //     this.props.clickHandler(curEventIndex);
      //   }
      // }

      this.setState({
        curTimestamp: curTimestamp,
        curEventIndex: curEventIndex,
      });
    }
  }

  componentDidMount() {
    const timer = new TaskTimer(100);

    timer.on('tick', () => {
      this.incrementTimestamp();
    });

    timer.start();
    this.timer = timer;
  }

  updateFromTableToCanvas(curEventIndex) {
    if (this.props.trace !== null) {
      this.setState({
        curTimestamp: this.props.trace.events[curEventIndex].timestamp,
        curEventIndex: curEventIndex,
      });
    }
  }

  componentWillUnmount() {
    this.timer.stop();
  }

  initImage() {
    const zoomLevel = this.getZoomLevel();
    const image = new window.Image(12 * 0.9 / zoomLevel, 19 * 0.9 / zoomLevel);
    image.src = '/cursor.ico';
    image.onload = () => {
      this.setState({
        cursorImage: image
      });
    };
  }

  getZoomLevel() {
    const zoom = window.top.outerWidth / window.top.innerWidth;
    return Math.round(zoom * 100) / 100;
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

  renderEvents(trace, scale, hoverIndex) {
    let objs = [];
    let radius = 2;

    trace.events.forEach(function (event, index) {
      if (event.type === 'mousemove') {
        objs.push(<Circle x={event.x * scale} y={event.y * scale} radius={radius} fill="blue"/>);
      } else if (event.type === 'touchmove') {
        objs.push(<Circle x={event.x * scale} y={event.y * scale} radius={radius} fill="purple"/>);
      } else if (event.type === 'click') {
        objs.push(<Circle x={event.x * scale} y={event.y * scale} radius={radius + 6} fill="red" opacity={0.5}/>);
      } else if (event.type === 'mousedown') {
        objs.push(<Circle x={event.x * scale} y={event.y * scale} radius={radius + 6} fill="orange" opacity={0.5}/>);
      } else if (event.type === 'mouseup') {
        objs.push(<Circle x={event.x * scale} y={event.y * scale} radius={radius + 6} stroke={"red"} strokeWidth={3} opacity={0.5}/>);
      } else if (event.type === 'contextmenu') {
        objs.push(<Circle x={event.x * scale} y={event.y * scale} radius={radius + 6} fill="green" opacity={0.5}/>);
      } else if (event.button === 'X1' || event.button === 'X2') {
        objs.push(<Circle x={event.x * scale} y={event.y * scale} radius={radius + 6} fill="yellow" opacity={0.5}/>);
      }
    });

    if (hoverIndex !== undefined) {
      if (0 <= hoverIndex && hoverIndex < trace.events.length) {
        objs.push(<Circle x={trace.events[hoverIndex].x * scale} y={trace.events[hoverIndex].y * scale} radius={radius + 6} fill="black" opacity={0.5}/>);
      }
    }

    return objs;
  }

  // Binary search bounds
  // https://stackoverflow.com/questions/30805642/binary-search-bounds
  binarySearch(array, el, fn) {
    function aux(left,  right) {
      if (left > right) {
        return fn(array, null, left, right);
      }

      var middle = Math.floor((left + right) / 2);
      var value = array[middle].timestamp;

      if (value > el) {
        return aux(left, middle - 1);
      } if (value < el) {
        return aux(middle + 1, right);
      } else {
        return fn(array, middle, left, right);
      }
    }

    return aux(0, array.length - 1);
  }

  getCurEvent(curTimestamp) {
    if (this.props.trace === null) {
      return 0;
    }

    const fn = function(a, m, l, r) { return m != null ? m : l - 1 > 0 ? l - 1 : 0; };
    const curEventIndex = this.binarySearch(this.props.trace.events, curTimestamp, fn);
    return curEventIndex;
  }

  renderPointer(trace, scale) {
    if (trace === null) {
      return null;
    }

    return (
      <Group x={trace.events[this.state.curEventIndex].x * scale} y={trace.events[this.state.curEventIndex].y * scale} >
        <Circle radius={15} fill="yellow" opacity={0.5} />
        <Image image={this.state.cursorImage} />
      </Group>
    )
  }

  renderReason(trace, scale) {
    if (trace.ruleStart === -1) {
      return null;
    }

    if (trace.ruleEnd !== -1) {
      return (
        <Line
          points={getPoints(trace, scale).slice(trace.ruleStart * 2, trace.ruleEnd * 2)}
          stroke="red"
          strokeWidth={2}
        />
      )
    } else {
      const event = trace.events[trace.ruleStart];
      return (
        <Circle x={event.x * scale} y={event.y * scale} radius={20} stroke="red" strokeWidth={2} dash={[10, 5]} />
      )
    }
  }

  renderCanvas() {
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
                (trace !== null) ? this.renderEvents(trace, scale, this.props.hoverIndex) : null
              }
              {
                (trace !== null) ? this.renderReason(trace, scale) : null
              }
              {
                this.renderPointer(trace, scale)
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

  onSliderChange(value) {
    const curEventIndex = this.getCurEvent(value);
    if (this.props.clickHandler !== undefined) {
      this.props.clickHandler(curEventIndex);
    }

    this.setState({
      curTimestamp: value,
      curEventIndex: curEventIndex,
    })
  }

  togglePaused() {
    this.setState({
      isPaused: !this.state.isPaused,
    });
  }

  renderSlider() {
    const min = this.state.firstTimestamp;
    const max = this.getLastTimestamp();

    let marks = {};
    this.props.trace.events.forEach(function (event) {
      marks[event.timestamp] = '';
    });

    return (
        <Slider marks={marks} value={this.state.curTimestamp} onChange={this.onSliderChange.bind(this)} min={min}
                max={max} step={0.1}/>
    )
  }

  render() {
    return (
      <div>
        {
          this.renderCanvas()
        }
        <Row style={{marginTop: '5px'}}>
          <div style={{marginLeft: "10px", marginRight: "10px"}}>
            <Button type="primary" shape="circle" icon={this.state.isPaused ? <CaretRightOutlined /> : <PauseOutlined />} onClick={this.togglePaused.bind(this)}/>
          </div>
          <div style={{marginRight: "10px", marginTop: "4px"}}>
            {
              `${this.printTimestamp(this.state.curTimestamp)} (${this.state.curEventIndex})`
            }
          </div>
          <div style={{width: "calc(100% - 200px)", marginRight: "10px"}}>
            {
              this.props.trace !== null ? this.renderSlider() : null
            }
          </div>
          <div style={{marginTop: "4px"}}>
            {
              this.printTimestamp(this.getLastTimestamp())
            }
          </div>
        </Row>
      </div>
    );
  }
}

export default Canvas;
