import React from "react";
import {Circle, Image, Layer, Line, Stage} from "react-konva";
import {getPoints} from "./Shared";
import {Text as KonvaText} from "react-konva/";
import {Button, Col, Row, Slider} from "antd";
import { TaskTimer } from 'tasktimer';
import * as Setting from "./Setting";

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      firstTimestamp: 0.0,
      curTimestamp: 0.0,
      isPaused: true,
      cursorImage: null,
    };
  }

  componentWillMount() {
    this.initImage();
  }

  toFixed(x) {
    return Number(Number.parseFloat(x).toFixed(3));
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

      if (!this.state.isPaused && Setting.getEnablePlayerFastForward()) {
        const curEventIndex = this.getCurEvent(curTimestamp);
        const nextTimestamp = this.props.trace.events[curEventIndex + 1].timestamp - 2.0;
        if (curTimestamp < nextTimestamp) {
          curTimestamp = nextTimestamp;
        }
      }

      this.setState({
        curTimestamp: curTimestamp,
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

  renderEvents(trace, scale, focusIndex) {
    let objs = [];

    trace.events.forEach(function (event, index) {
      let radius = 2;
      if (focusIndex === index) {
        radius += 5;
      }

      if (event.type === 'mousemove') {
        objs.push(<Circle x={event.x * scale} y={event.y * scale} radius={radius} fill="blue"/>);
      } else if (event.type === 'touchmove') {
        objs.push(<Circle x={event.x * scale} y={event.y * scale} radius={radius} fill="purple"/>);
      } else if (event.type === 'click') {
        objs.push(<Circle x={event.x * scale} y={event.y * scale} radius={radius + 6} fill="red" opacity={0.5}/>);
      } else if (event.type === 'contextmenu') {
        objs.push(<Circle x={event.x * scale} y={event.y * scale} radius={radius + 6} fill="green" opacity={0.5}/>);
      } else if (event.button === 'X1' || event.button === 'X2') {
        objs.push(<Circle x={event.x * scale} y={event.y * scale} radius={radius + 6} fill="yellow" opacity={0.5}/>);
      }
    });

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

  getCurEvent() {
    const trace = this.props.trace;
    const fn = function(a, m, l, r) { return m != null ? m : l - 1 > 0 ? l - 1 : 0; };
    const curEventIndex = this.binarySearch(trace.events, this.state.curTimestamp, fn);
    return curEventIndex;
  }

  renderPointer(trace, scale) {
    if (trace === null) {
      return null;
    }

    const curEventIndex = this.getCurEvent();
    return <Image x={trace.events[curEventIndex].x * scale} y={trace.events[curEventIndex].y * scale} image={this.state.cursorImage} />
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
    this.setState({
      curTimestamp: value,
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
            <Col span={1}>
              <Button type="primary" shape="circle" icon={this.state.isPaused ? "caret-right" : "pause"}
                      onClick={this.togglePaused.bind(this)}/>
            </Col>
            <Col span={23}>
              <Row>
                <Col span={2}>
                  <div style={{marginTop: '9px', textAlign: 'center'}}>
                    {
                      this.printTimestamp(this.state.curTimestamp)
                    }
                  </div>
                </Col>
                <Col span={20}>
                  {
                    this.props.trace !== null ? this.renderSlider() : null
                  }
                </Col>
                <Col span={2}>
                  <div style={{marginTop: '9px', textAlign: 'center'}}>
                    {
                      this.printTimestamp(this.getLastTimestamp())
                    }
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
    )
  }
}

export default Canvas;
