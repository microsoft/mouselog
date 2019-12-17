import React from "react";
import {Circle, Image, Layer, Line, Stage} from "react-konva";
import {getPoints} from "./Shared";
import {Text as KonvaText} from "react-konva/";
import {Button, Col, Row, Slider} from "antd";

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      sliderValue: 0,
      isPaused: true,
      cursorImage: null,
    };
  }

  componentWillMount() {
    this.initImage();
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      if (!this.state.isPaused) {
        if (this.state.sliderValue === this.props.trace.events.length - 1) {
          this.setState({
            sliderValue: 0,
            isPaused: true,
          });
        } else {
          this.setState({
            sliderValue: this.state.sliderValue + 1,
          });
        }
      }

    }, 100);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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
              {
                trace !== null ? <Image x={trace.events[this.state.sliderValue].x * scale} y={trace.events[this.state.sliderValue].y * scale} image={this.state.cursorImage} /> : null
              }
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

  onSliderChange(value) {
    this.setState({
      sliderValue: value,
    })
  }

  togglePaused() {
    this.setState({
      isPaused: !this.state.isPaused,
    });
  }

  renderSlider() {
    const min = 0;
    const max = this.props.trace.events.length - 1;

    let marks = {};
    marks[min] = `${min}`;
    marks[max] = `${max}`;

    return (
        <Slider marks={marks} value={this.state.sliderValue} onChange={this.onSliderChange.bind(this)} min={min} max={max} />
    )
  }

  getLastTimestamp() {
    if (this.props.trace === null) {
      return '0.000';
    }

    return this.props.trace.events.slice(-1)[0].timestamp;
  }

  render() {
    return (
      <div>
        {
          this.renderCanvas()
        }
        <Row style={{marginTop: '5px'}} >
          <Col span={1}>
            <Button type="primary" shape="circle" icon={this.state.isPaused ? "caret-right" : "pause"} onClick={this.togglePaused.bind(this)} />
          </Col>
          <Col span={23}>
            <Row>
              <Col span={2}>
                <div style={{marginTop: '9px', textAlign: 'center'}}>
                  0.000
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
                    this.getLastTimestamp()
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
