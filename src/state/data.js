const initialState = {
  ticker: {
    channel: {},
  },
  trades: {
    channel: {},
  },
  book: {
    channel: {},
    asks: {},
    bids: {},
  },
};

const BOOK_SET_CHANNEL = 'BOOK_SET_CHANNEL';
export const setBookChannel = payload => ({
  type: BOOK_SET_CHANNEL,
  payload,
});

const BOOK_SET_BIDS = 'BOOK_SET_BIDS';
const BOOK_SET_ASKS = 'BOOK_SET_ASKS';
const BOOK_REMOVE_BIDS = 'BOOK_REMOVE_BIDS';
const BOOK_REMOVE_ASKS = 'BOOK_REMOVE_ASKS';

export const updateBookData = data => {
  const [price, count, amount] = data;
  let type = null;
  let payload = null;
  if (count > 0) {
    payload = { price, amount, count };
    if (amount > 0) {
      type = BOOK_SET_BIDS;
    } else {
      type = BOOK_SET_ASKS;
    }
  } else {
    payload = price;
    if (amount > 0) {
      type = BOOK_REMOVE_BIDS;
    } else {
      type = BOOK_REMOVE_ASKS;
    }
  }

  return {
    type,
    payload,
  };
};

const BOOK_REPLACE = 'BOOK_REPLACE';
export const replaceBookData = data => {
  const book = { asks: {}, bids: {} };
  for (const d of data) {
    const [price, count, amount] = d;
    if (amount > 0) {
      book.bids[price] = { price, count, amount };
    } else {
      book.asks[price] = { price, count, amount };
    }
  }
  return {
    type: BOOK_REPLACE,
    payload: book,
  };
};

const TRADE_ADD = 'TRADE_ADD';

export const updateTradesData = data => {
  const [id, mts, amount, price] = data;

  return {
    type: TRADE_ADD,
    payload: { id, mts, amount, price },
  };
};

const TRADES_REPLACE = 'TRADES_REPLACE';
export const replaceTradesData = (symbol, array) => {
  const data = {};
  for (const [id, mts, amount, price] of array) {
    data[id] = { id, mts, amount, price };
  }
  return {
    type: TRADES_REPLACE,
    payload: { symbol, data },
  };
};

const TICKER_SET_CHANNEL = 'TICKER_SET_CHANNEL';
export const setTickerChannel = payload => ({
  type: TICKER_SET_CHANNEL,
  payload,
});

const TRADES_SET_CHANNEL = 'TRADES_SET_CHANNEL';
export const setTradesChannel = payload => ({
  type: TRADES_SET_CHANNEL,
  payload,
});

const TICKER_SET_DATA = 'TICKER_SET_DATA';

export const setTickerData = (symbol, array) => {
  const [
    bid,
    bidSize,
    ask,
    askSize,
    dailyChange,
    dailyChangePerc,
    lastPrice,
    volume,
    high,
    low,
  ] = array;

  const data = {
    bid,
    bidSize,
    ask,
    askSize,
    dailyChange,
    dailyChangePerc,
    lastPrice,
    volume,
    high,
    low,
  };
  return {
    type: TICKER_SET_DATA,
    payload: {
      symbol,
      data,
    },
  };
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case BOOK_SET_CHANNEL:
      return { ...state, book: { ...state.book, channel: payload } };
    case TICKER_SET_CHANNEL:
      return { ...state, ticker: { ...state.ticker, channel: payload } };
    case TRADES_SET_CHANNEL:
      return { ...state, trades: { ...state.trades, channel: payload } };
    case BOOK_SET_BIDS: {
      return {
        ...state,
        book: {
          ...state.book,
          bids: { ...state.book.bids, [payload.price]: payload },
        },
      };
    }
    case BOOK_SET_ASKS: {
      return {
        ...state,
        book: {
          ...state.book,
          asks: { ...state.book.asks, [payload.price]: payload },
        },
      };
    }
    case BOOK_REMOVE_BIDS: {
      const bids = {};
      for (const key in state.book.bids) {
        // eslint-disable-next-line eqeqeq
        if (key != payload && state.book.bids.hasOwnProperty(key)) {
          bids[key] = state.book.bids[key];
        }
      }
      return {
        ...state,
        book: { ...state.book, bids },
      };
    }
    case BOOK_REMOVE_ASKS: {
      const asks = {};
      for (const key in state.book.asks) {
        // eslint-disable-next-line eqeqeq
        if (key != payload && state.book.asks.hasOwnProperty(key)) {
          asks[key] = state.book.asks[key];
        }
      }
      return {
        ...state,
        book: { ...state.book, asks },
      };
    }
    case BOOK_REPLACE: {
      return {
        ...state,
        book: { ...state.book, ...payload },
      };
    }
    case TICKER_SET_DATA: {
      return {
        ...state,
        ticker: { ...state.ticker, [payload.symbol]: payload.data },
      };
    }
    case TRADES_REPLACE: {
      return {
        ...state,
        trades: { ...state.trades, [payload.symbol]: payload.data },
      };
    }
    default:
      return state;
  }
};
