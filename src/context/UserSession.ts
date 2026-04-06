import {createContext} from "react";

export class UserSession {
	theme: string = "dark";
}

export const UserSessionContext = createContext(new UserSession());


export type UserSessionUpdate = ((s: UserSession) => any) | null;

export const UserSessionUpdateContext = createContext<UserSessionUpdate>(null);
