export enum IPCChannels {
  CALCULATE = 'CALCULATE',
  CLEAR = 'CLEAR',

  HAS_CALCULATED = 'HAS_CALCULATED',

  GET_EXPRESSION = 'GET_EXPRESSION',
  SET_EXPRESSION = 'UPDATE_EXPRESSION',

  GET_ANSWER = 'GET_ANSWER',

  UPDATE_ANSWER = 'UPDATE_ANSWER',
  UPDATE_EXPRESSION = 'UPDATE_EXPRESSION',

  GET_HISTORY = 'GET_HISTORY',
  UPDATE_HISTORY = 'UPDATE_HISTORY',

  OPEN_HISTORY = 'OPEN_HISTORY',
  CLOSE_HISTORY = 'CLOSE_HISTORY',

  GET_CURRENT_THEME = 'GET_CURRENT_THEME',
  SET_THEME = 'SET_THEME',
  UPDATE_THEME = 'UPDATE_THEME',
}

export const OPERATORS = {
  add: '+',
  sub: '-',
  div: '/',
  mlt: '*',
  mod: '%',
  exp: '^',
};

export const ORDER_OF_OPERATION = [
  [[OPERATORS.mlt], [OPERATORS.div], [OPERATORS.mod], [OPERATORS.exp]],
  [[OPERATORS.add], [OPERATORS.sub]],
];

export type HistoryType = {
  expression: string;
  result: string;
};

export type Theme = {
  name: string;
  backgroundColor: {
    bottom: string;
    top: string;
  };
};

export const THEMES: Theme[] = [
  {
    name: 'Blue',
    backgroundColor: {
      top: '#83EAF1',
      bottom: '#009FFD',
    },
  },
  {
    name: 'Orange',
    backgroundColor: {
      top: '#EC9F05',
      bottom: '#FF4E00',
    },
  },
];
