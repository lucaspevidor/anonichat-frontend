export interface IMessage {
  id: string,
  senderName: string,
  content: string,
  roomId: string,
  createdAt: string,
}

export interface IRoom {
  id: string,
  name: string,
  memberIDs: string[]
  ownerId: string
  messages: IMessage[]
}

export interface IAppState {
  rooms: IRoom[],
  loading: {
    room: boolean,
    messages: boolean
  }
  selectedRoom: IRoom | undefined,
}

type RoomAddedAction = {
  type: "room_added",
  payload: {
    room: IRoom
  }
}

type RoomFirstLoadAction = {
  type: "room_first_load",
  payload: {
    rooms: IRoom[]
  }
}

type RoomChangedAction = {
  type: "room_changed",
  payload: {
    id: string,
    newRoom: IRoom
  }
}

type RoomDeletedAction = {
  type: "room_deleted",
  payload: {
    id: string,
  }
}

type SelectedRoomSet = {
  type: "selected_room_set",
  payload: {
    selectedRoom: IRoom
  }
}

type MessageAddedAction = {
  type: "message_added",
  payload: {
    message: IMessage,
  }
}

type MessageMultipleAddedAction = {
  type: "message_multiple_added",
  payload: {
    messages: IMessage[]
  }
}

type MessageDeletedAction = {
  type: "message_deleted",
  payload: {
    messageId: string,
    roomId: string,
  }
}

type LoadingSetRoomAction = {
  type: "loading_room_set",
  payload: {
    room: boolean;
  }
}

type RoomAction = RoomAddedAction | RoomFirstLoadAction | RoomChangedAction | RoomDeletedAction | SelectedRoomSet;
type MessageAction = MessageAddedAction | MessageMultipleAddedAction | MessageDeletedAction;
type LoaderAction = LoadingSetRoomAction;
export type ReduxAction = RoomAction | MessageAction | LoaderAction;

export function Reducer(state: IAppState, action: ReduxAction): IAppState {
  switch (action.type) {
    case "room_added":
      return {
        ...state,
        rooms: [...state.rooms, action.payload.room],
      }
    case "room_first_load":
      return {
        ...state,
        rooms: [...action.payload.rooms]
      }
    case "room_changed":
      return {
        ...state,
        rooms: state.rooms.map(room => {
          if (room.id !== action.payload.id)
            return room

          return action.payload.newRoom;
        })
      }
    case "room_deleted":
      return {
        ...state,
        rooms: state.rooms.filter(r => r.id !== action.payload.id)
      }

    case "selected_room_set":
      return {
        ...state,
        selectedRoom: action.payload.selectedRoom
      }

    case "message_added":
      return {
        ...state,
        rooms: state.rooms.map(room => {
          if (room.id !== action.payload.message.roomId)
            return room

          room.messages = [...room.messages, action.payload.message]
          return room
        })
      }
    case "message_multiple_added":
      let newRooms = [...state.rooms];
      action.payload.messages.forEach(message => {
        newRooms = newRooms.map(room => {
          if (room.id !== message.roomId) return room;

          room.messages = [...room.messages, message]
          return room;
        })
      })
      return {
        ...state,
        rooms: newRooms
      }
    case "message_deleted":
      return {
        ...state,
        rooms: state.rooms.map(room => {
          if (room.id !== action.payload.roomId)
            return room

          room.messages = room.messages.filter(m => m.id !== action.payload.messageId);
          return room;
        })
      }

    case "loading_room_set":
      return {
        ...state,
        loading: {
          ...state.loading,
          room: action.payload.room
        }
      }
    default:
      throw new Error("Invalid action type");
  }
}