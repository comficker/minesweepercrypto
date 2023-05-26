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
  "user": User | null
  "start_at": string | number
  "end_at": string | number
  "width": number
  "height": number
  "players": IUserGame[]
  "maps": any
  "results": any
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

export interface GameSize {
  width: number
  height: number
}

export interface Setting {
  refresh?: boolean
  soundOn?: boolean
  size: GameSize
}

export interface IStep {
  time: number
  cord: string
  user: number | null
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
