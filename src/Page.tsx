import React from "react";
import Player from "./Player";
import { Stream } from "./models";
import { nowMs } from "./now";
import MaterialIcon from "@material/react-material-icon";
import { Button } from "./Button";
import Visualization from "./Visualization";
import moment from "moment";
import { DEBUG_STARTS_ON_REFRESH } from "./debug";

interface Props {
  volume: number;
  stream: Stream;
  onClickNext: () => void;
  onClickPrev: () => void;
  startsAtMs: number;
}

interface State {
  playing: boolean;
  finished: boolean;
}

class Page extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      playing: false,
      finished: false,
    };
  }

  render() {
    const {
      volume,
      stream: { url, color, title, subtitle },
      onClickNext,
      onClickPrev,
    } = this.props;

    let startsAtMs = DEBUG_STARTS_ON_REFRESH ? nowMs() : this.props.startsAtMs;

    let centerComponent = null;
    const now = nowMs();
    if (now < startsAtMs) {
      // rerender in a second to refresh the time
      setTimeout(() => {
        this.forceUpdate();
      }, 1000);
      centerComponent = (
        <div>
          <h4>Starting {moment(startsAtMs).fromNow()}</h4>
        </div>
      );
    } else if (this.state.finished) {
      centerComponent = (
        <div>
          <h4>Thanks for listening :)</h4>
        </div>
      );
    } else {
      centerComponent = (
        <>
          <div>
            <h2>{title}</h2>
          </div>
          <div>
            <h4>{subtitle}</h4>
          </div>
        </>
      );
    }

    return (
      <div id="pageContainer">
        <div id="page">
          <Player
            url={url}
            volume={volume}
            startsAtMs={startsAtMs}
            onBuffering={() => {
              this.setState({
                playing: false,
              });
            }}
            onPlaying={() => {
              this.setState({
                playing: true,
              });
            }}
            onWaiting={() => {
              this.setState({
                playing: false,
              });
            }}
            onFinished={() => {
              this.setState({
                playing: false,
                finished: true,
              });
            }}
          />
          {/* prev button */}
          <Button onClick={onClickPrev}>
            <MaterialIcon icon="arrow_back" />
          </Button>
          <div
            style={{
              margin: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {centerComponent}
          </div>
          {/* next button */}
          <Button onClick={onClickNext}>
            <MaterialIcon icon="arrow_forward" />
          </Button>
        </div>
        <Visualization color={color} paused={!this.state.playing} />
      </div>
    );
  }
}

export default Page;
