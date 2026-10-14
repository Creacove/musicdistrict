export type PeopleEntry = {
  id: string
  name?: string
  location: string
  dancing: boolean
}

export type PeopleView = {
  availability: 'offline' | 'empty' | 'online'
  people: PeopleEntry[]
}

export function peopleInLocation(players: readonly PeopleEntry[], location: string, connected: boolean): PeopleView {
  if (!connected) return { availability: 'offline', people: [] }
  const people = players.filter(player => player.location === location)
  return { availability: people.length ? 'online' : 'empty', people }
}
