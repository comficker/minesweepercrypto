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

export interface Score {
  "created": string
  "uid": string
  "channel": string
  "score": number
  "user": User
}

export interface ResponseScores {
  "links": Links
  "count": number
  "page_size": number
  "num_pages": number
  "results": Score[]
}

export interface ResponseLogin {
  access: string
  refresh: string
}

export interface IGame {
  "id": number
  "status": string
  "user": User
  "start_at": string
  "end_at": string
  "width": number
  "height": number
}


export interface ResponseGames {
  "links": Links
  "count": number
  "page_size": number
  "num_pages": number
  "results": IGame[]
}

export interface ILottery {
  "id": number
  "prize":number
  "number": number
  "open_at": string
}

export interface GameSize {
  width: number
  height: number
}

export interface Setting {
  size: GameSize
}

export interface IStep {
  time: number
  cord: string
  user: number | null
}
