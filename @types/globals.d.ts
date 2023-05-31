import { io, Socket } from "socket.io-client";
import {DefaultEventsMap} from "@socket.io/component-emitter";
export {};

declare global {
  interface Window {
    SOUND_TAP: any
    SOUND_OVER: any
    socket: Socket<DefaultEventsMap>
  }
}
