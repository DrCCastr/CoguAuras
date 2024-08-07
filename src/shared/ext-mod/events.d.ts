type Tuple<T = unknown> = [T] | [undefined, string];

declare namespace SafeFunctions {
	interface Server {
		BindToInvokeServer(Name: string, func: (Player: Player, ...args: unknown[]) => unknown): void;
		UnbindInvokeServer(Name: string): void;
		StopInvokeServer(Name: string): void;
		InvokeClient(Player: Player, Name: string, Timeout: number, ...args: unknown[]): Tuple;
	}

	interface Client {
		BindToInvokeClient(Name: string, func: (...args: unknown[]) => unknown): void;
		UnbindInvokeClient(Name: string): void;
		StopInvokeClient(Player: Player, Name: string): void;
		InvokeServer(Name: string, Timeout: number, ...args: unknown[]): Tuple;
	}
}

declare const SafeFunctions: SafeFunctions.Server & SafeFunctions.Client;
export = SafeFunctions;
