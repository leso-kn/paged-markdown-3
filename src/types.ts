
declare global {
	interface HTMLCollection {
	  [Symbol.iterator](): Iterator<HTMLElement>;
	}
  }
  export {};

declare global {
	interface HTMLCollectionOf<T extends Element> {
	  [Symbol.iterator](): Iterator<T>;
	}
  }
  export {};

declare global {
	interface NodeListOf<TNode extends Node> {
	  [Symbol.iterator](): Iterator<TNode>;
	}
  }
  export {};
