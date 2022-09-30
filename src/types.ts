/*
 *  Paged Markdown 3
 *  Lesosoftware 2022
 */

declare global
{
	interface HTMLCollection
	{
	  [Symbol.iterator](): Iterator<HTMLElement>;
	}
	interface HTMLCollectionOf<T extends Element>
	{
		[Symbol.iterator](): Iterator<T>;
	}
	interface NodeListOf<TNode extends Node>
	{
		[Symbol.iterator](): Iterator<TNode>;
	}
}

export {};
