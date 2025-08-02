import { States } from './states';

/**
 * Represents a single node in a pet's state sequence tree.
 * Each node defines a state and the possible states it can transition to.
 */
export interface ISequenceNode {
    state: States;
    possibleNextStates: States[];
}

/**
 * Represents the complete state transition tree for a pet type.
 * Defines the starting state and all valid state transitions.
 */
export interface ISequenceTree {
    startingState: States;
    sequenceStates: ISequenceNode[];
}
