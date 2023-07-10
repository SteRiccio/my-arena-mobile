import { io } from "socket.io-client";

import { RemoteService } from "./remoteService";

let webSocketInstance = null

const EVENTS = {
    jobUpdate: 'jobUpdate'
}

const open = async () => {
    close()

    const serverUrl = await RemoteService.getServerUrl()

    webSocketInstance = io(serverUrl, {withCredentials: true});
    
    return webSocketInstance
}

const close = () => {
    webSocketInstance?.close()
    webSocketInstance = null
}

export const WebSocketService = {
    EVENTS,

    open,
    close

}