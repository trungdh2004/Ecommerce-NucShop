export interface ServerToClientEvents {
	noArg: () => void;
	basicEmit: (a: number, b: string, c: Buffer) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
	returnSocket: (id: string) => void;
	notification: (obj: any) => void;
	notificationAdmin: (obj: any) => void;
	newOrderShipper: (obj: any) => void;
	messageSender: (obj: any) => void;
	updateConversation: (obj: any) => void;
	roomMembers: (obj: any) => void;
}

export interface ClientToServerEvents {
	returnSocket: (id: string) => void;
	disconnect: (id: string | undefined) => void;
	joinChat: (id: string) => void;
	newMessage: (obj: any, obj2: any) => void;
	leaveRoom: (id: string) => void;
}
