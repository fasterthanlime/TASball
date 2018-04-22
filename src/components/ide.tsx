import React = require("react");
import { connect, Dispatchers, actionCreatorsList } from "./connect";
import { RootState, OpCode, EditedCell, CellSelection } from "../types";
import styled from "./styles";

import SimControls from "./sim-controls";
import Op from "./op";
import CellEditor from "./cell-editor";

const IDEDiv = styled.div`
  width: 100%;
  position: relative;

  &:focus {
    outline: none;
  }
`;

const Ops = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: start;
`;

const Filler = styled.div`
  flex-grow: 1;
`;

class IDE extends React.PureComponent<Props & DerivedProps> {
  render() {
    const { showCode, editedCell } = this.props;
    return (
      <IDEDiv tabIndex={0} onKeyDown={this.onKeyDown}>
        <SimControls />
        {showCode ? this.renderOps() : <p>Code hidden</p>}
        {editedCell ? <CellEditor addr={editedCell.addr} /> : null}
      </IDEDiv>
    );
  }

  renderOps(): JSX.Element {
    const { pc, code, editedCell, cellSelection } = this.props;
    let ops = [];
    for (let addr = 0; addr < this.props.code.length; addr++) {
      const op = code[addr];
      let active = addr == pc;
      let selected =
        addr >= cellSelection.start &&
        addr < cellSelection.start + cellSelection.size;
      ops.push(
        <Op
          key={addr}
          op={op}
          addr={addr}
          active={active}
          selected={selected}
          edited={editedCell && addr == editedCell.addr}
          onClick={this.onOpClick}
          onDoubleClick={this.onOpDoubleClick}
        />,
      );
    }
    ops.push(<Filler key="filler" />);
    return <Ops>{ops}</Ops>;
  }

  onOpClick = (ev: React.MouseEvent<HTMLElement>) => {
    const addr = ev.currentTarget.dataset.addr;
    if (addr) {
      let start = parseInt(addr, 10);
      let size = 1;
      if (ev.shiftKey) {
        let prevSel = this.props.cellSelection;
        if (prevSel.size > 0) {
          if (start >= prevSel.start && start < prevSel.start + prevSel.size) {
            // ignore
            return;
          } else {
            if (start > prevSel.start) {
              size = start - prevSel.start + 1;
              start = prevSel.start;
            } else {
              size = prevSel.start + prevSel.size - start;
            }
          }
        }
      }
      this.props.setCellSelection({ start, size });
    }
  };

  onOpDoubleClick = (ev: React.MouseEvent<HTMLElement>) => {
    const addr = ev.currentTarget.dataset.addr;
    if (addr) {
      this.props.editCellStart({ addr: parseInt(addr, 10) });
    }
  };

  onKeyDown = (ev: React.KeyboardEvent<HTMLElement>) => {
    const cs = this.props.cellSelection;
    if (ev.key == "Escape") {
      this.props.editCellStop({});
    } else if (ev.key == "Delete") {
      this.props.cellYank({});
    } else if (ev.key == "Backspace") {
      this.props.cellClear({});
    } else if (ev.key == "x") {
      if (ev.ctrlKey) {
        this.props.cellCut({});
      }
    } else if (ev.key == "c") {
      if (ev.ctrlKey) {
        this.props.cellCopy({});
      }
    } else if (ev.key == "v") {
      if (ev.ctrlKey) {
        this.props.cellPaste({});
      }
    } else if (ev.key == "h" || ev.key == "ArrowLeft") {
      this.props.setCellSelection({ start: cs.start - 1, size: 1 });
    } else if (ev.key == "l" || ev.key == "ArrowRight") {
      this.props.setCellSelection({ start: cs.start + 1, size: 1 });
    } else if (ev.key == "Enter") {
      if (cs.size > 0) {
        this.props.editCellStart({ addr: cs.start });
      }
    } else {
      console.log(`key = ${ev.key}`);
    }
  };
}

interface Props {}

const actionCreators = actionCreatorsList(
  "setPage",
  "floaty",
  "editCellStart",
  "editCellStop",
  "setCellSelection",
  "cellYank",
  "cellClear",
  "cellCut",
  "cellCopy",
  "cellPaste",
);

type DerivedProps = {
  pc: number;
  code: OpCode[];
  showCode: boolean;
  editedCell: EditedCell;
  cellSelection: CellSelection;
} & Dispatchers<typeof actionCreators>;

export default connect<Props>(IDE, {
  actionCreators,
  state: (rs: RootState) => ({
    pc: rs.simulation.pc,
    code: rs.simulation.code,
    showCode: rs.ui.showCode,
    editedCell: rs.ui.editedCell,
    cellSelection: rs.ui.cellSelection,
  }),
});
