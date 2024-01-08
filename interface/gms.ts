import type {Links, User} from "~/interface/index";

export interface Member {
  id: number,
  user: User
  status: string
  score: number
  order: number
  timer: number
  mark_time: number
}

export interface Turn {
  id: number
  status: string
  timer: number
  cord: string
  score: number
}

export interface Room {
  id: number
  width: number
  height: number
  user: number
  is_multiplayer: boolean
  ticket: number
  num_bomb: number
  prize: number
  status: string
  start_at: number
  end_at: number

  turns: Turn[],
  gms_members: Member[]

  maps: { [key: string]: number | null }
  results: { [key: string]: number | null }
}

export interface PlayMessage {
  "room": number
  "results": { [key: string]: number | null }
  "current": Turn
  "next": {
    id: number
    mark_time: number
    status: string
  }
  "status": string
  "start_at": number
  'end_at': number
}

export interface MemberRequestMessage {
  "room": number
  "member": Member
}


export interface Options {
  width: number,
  height: number,
  is_flagging: boolean
  is_multiplayer: boolean,
  ticket: number
  num_bomb: number
}

export interface ResponseRoom {
  "links": Links
  "count": number
  "page_size": number
  "num_pages": number
  "results": Room[]
}

