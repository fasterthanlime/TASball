import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState, SimulationState } from "../types";

import Button from "./button";
import Controls from "./controls";
import Simulation from "./simulation";
import Clicker from "./clicker";
import MapPicker from "./map-picker";
import styled from "./styles";

class Game extends React.PureComponent<Props & DerivedProps> {
  render() {
    return (
      <>
        <Controls />
        {this.renderMain()}
      </>
    );
  }

  renderMain(): JSX.Element {
    const { simulation, pickingMap } = this.props;
    if (simulation) {
      return <Simulation />;
    }
    if (pickingMap) {
      return <MapPicker />;
    }
    return <Clicker />;
  }

  onMenu = () => {
    this.props.setPage({ page: "menu" });
  };
}

interface Props {}

const actionCreators = actionCreatorsList("setPage");

type DerivedProps = {
  simulation: SimulationState;
  pickingMap: boolean;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(Game, {
  actionCreators,
  state: (rs: RootState) => ({
    simulation: rs.simulation,
    pickingMap: rs.ui.pickingMap,
  }),
});
