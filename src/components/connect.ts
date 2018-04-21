import { connect as reduxConnect } from "react-redux";

import { RootState, Dispatch, ActionCreator } from "../types";
import { dispatcher, actions } from "../actions";

type ActionCreators = {
  [key: string]: ActionCreator<any>;
};

export type Dispatchers<T extends ActionCreators> = {
  [k in keyof T]: (payload: T[k]["payload"]) => void
};

interface StateMapper {
  (rs: RootState, props: any): any;
}

interface DispatchMapper {
  (dispatch: Dispatch, props: any): any;
}

interface ConnectOpts {
  state?: StateMapper;
  dispatch?: DispatchMapper;
  actionCreators?: ActionCreators;
}

type actionTypes = typeof actions;

export function actionCreatorsList<K extends keyof actionTypes>(
  ...input: K[]
): Pick<actionTypes, K> {
  const res: Pick<actionTypes, K> = {} as any;
  for (const k of input) {
    res[k] = actions[k];
  }
  return res;
}

export function connect<TProps>(
  component: React.ComponentClass<any>,
  opts: ConnectOpts = {},
): React.ComponentClass<TProps> {
  let { dispatch, actionCreators } = opts;
  if (actionCreators) {
    let oldDispatch = dispatch;
    dispatch = (d, props) => {
      const result: any = oldDispatch ? oldDispatch(d, props) : {};
      for (const key of Object.keys(actionCreators!)) {
        result[key] = dispatcher(d, actionCreators![key]);
      }
      return result;
    };
  }

  return reduxConnect(opts.state, dispatch)(component);
}
