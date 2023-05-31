export interface User {
  id: number
  first_name: string
  last_name: string
  username: string
}

export interface Links {
  "next": string
  "previous": string
}

export interface IGame {
  "id": number
  "status": string
  "user": User | null | number
  "start_at": string | number
  "end_at": string | number
  "width": number
  "height": number
  "players": IUserGame[]
  "maps": any
  "results": any
  "is_multiple": boolean
}

export interface ITurnMessage {
  game: number
  step: IStep,
  status: string
  results: { [key: string]: number | null | undefined },
  maps: { [key: string]: number | null | undefined }
}

export interface IUserGame {
  "id": number
  "status": string
  "user": User
  "game": IGame
  "start_at": string
  "end_at": string
  "since"?: string
  "score": number
  "steps": IStep[]
}

export interface ILottery {
  "id": number
  "prize": number
  "number": number
  "open_at": string
}

export interface Setting {
  is_multiple: boolean
  width: number
  height: number
}

export interface IStep {
  time: number
  cord: string
  user: number | null
  status?: string
}

export interface ResponseLogin {
  access: string
  refresh: string
}

export interface ResponseGames {
  "links": Links
  "count": number
  "page_size": number
  "num_pages": number
  "results": IGame[]
}

export interface ResponseUserGames {
  "links": Links
  "count": number
  "page_size": number
  "num_pages": number
  "results": IUserGame[]
}

export interface PlayingTurn {
  end_at: number
  id: number
}

export interface MessageTurn {
  game: number
  playing: PlayingTurn
}
