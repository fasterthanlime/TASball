import * as React from "react";
import { connect, actionCreatorsList, Dispatchers } from "./connect";
import { formatMoney } from "../format";
import styled from "./styles";

import Button from "./button";
import Icon from "./icon";
import ActivityButton from "./activity-button";
import ExpenseButton from "./expense-button";
import { activities } from "../activities";
import { expenses } from "../expenses";
import { RootState, Unlocked } from "../types";
import * as styles from "./styles";

const Columns = styled.div`
  display: flex;
  flex-direction: row;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0 1em;
`;

const Banner = styled.div`
  background: #444;
  color: white;
  font-weight: bold;
  padding: 1em;
  border-radius: 4px;
  text-align: center;
  animation: ${styles.animations.glow} 2s infinite;
  margin: 20px auto;

  a,
  a:focus,
  a:visited {
    color: rgb(240, 140, 140);
  }
`;

class Clicker extends React.PureComponent<Props & DerivedProps> {
  render() {
    return (
      <>
        <Banner>
          Check out{" "}
          <a href="https://supertasball.amos.me/" target="_blank">
            Super TASball
          </a>, the continuation of this project!
        </Banner>
        <Columns>
          <Column>
            <h3>Earn money</h3>
            <ActivityButton activity={activities.PlayDice} />
            <ActivityButton activity={activities.MineSatoshi} />
            <ActivityButton activity={activities.WashWindow} />
            <ActivityButton activity={activities.MowLawn} />
            <ActivityButton activity={activities.StealCar} />
          </Column>
          <Column>
            <h3>Spend money</h3>
            {this.renderExpenses()}
            <h3>Learn how to play the game</h3>
            <Button
              icon="video"
              onClick={() =>
                window.open(
                  "https://www.youtube.com/watch?v=c2lE4DDl5P0&yt:cc=on",
                )
              }
            >
              Watch a video tutorial
            </Button>
          </Column>
        </Columns>
      </>
    );
  }

  renderExpenses(): JSX.Element {
    const { unlocked } = this.props;
    return (
      <>
        {expenses.map((ex, i) => {
          if (ex.requires) {
            for (const req of ex.requires) {
              if (!unlocked[req]) {
                return null;
              }
            }
          }
          if (ex.unlock) {
            if (unlocked[ex.unlock]) {
              return null;
            }
          }
          return <ExpenseButton key={`expense-${i}`} expense={ex} />;
        })}
      </>
    );
  }
}

interface Props {}

const actionCreators = actionCreatorsList();
type DerivedProps = Dispatchers<typeof actionCreators> & {
  unlocked: Unlocked;
};

export default connect<Props>(Clicker, {
  actionCreators,
  state: (rs: RootState) => ({
    unlocked: rs.resources.unlocked,
  }),
});
