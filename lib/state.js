/**
 * ==========================================================================
 * State Management Utilities
 * ==========================================================================
 */

/**
 * Creates a simple state holder with a getter, setter, and subscriber.
 * (Like React's useState)
 *
 * @template T
 * @param {T} initialValue - The initial value of the state.
 * @returns {[() => T, (newValue: T | ((prevState: T) => T)) => void, (listener: (value: T) => void) => () => void]}
 * A tuple containing:
 * 1. getState: A function that returns the current state.
 * 2. setState: A function to update the state. Can take a new value or a function that receives the previous state.
 * 3. subscribe: A function to register a listener for state changes. Returns an unsubscribe function.
 */
export function createState(initialValue) {
  let value = initialValue;
  const listeners = new Set();

  const getState = () => value;

  const setState = (updater) => {
    const oldValue = value;
    if (typeof updater === 'function') {
      value = updater(value);
    } else {
      value = updater;
    }
    if (oldValue !== value || (typeof value === 'object' && value !== null)) {
      listeners.forEach(listener => listener(value));
    }
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return [getState, setState, subscribe];
}

/**
 * Creates a state holder managed by a reducer function.
 * (Like React's useReducer)
 *
 * @template S, A
 * @param {(state: S, action: A) => S} reducer - A function that determines how the state changes.
 * @param {S} initialState - The initial state.
 * @param {function} [initializer] - Optional function to compute the initial state lazily.
 * @returns {[() => S, (action: A) => void, (listener: (value: S) => void) => () => void]}
 * A tuple containing:
 * 1. getState: A function that returns the current state.
 * 2. dispatch: A function to send an action to the reducer.
 * 3. subscribe: A function to register a listener for state changes. Returns an unsubscribe function.
 */
export function createReducer(reducer, initialState, initializer) {
  let value = initializer ? initializer(initialState) : initialState;
  const listeners = new Set();

  const getState = () => value;

  const dispatch = (action) => {
    const oldValue = value;
    value = reducer(value, action);
    if (oldValue !== value || (typeof value === 'object' && value !== null)) {
      listeners.forEach(listener => listener(value));
    }
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return [getState, dispatch, subscribe];
}