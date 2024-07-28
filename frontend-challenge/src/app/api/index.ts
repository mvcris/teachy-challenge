export type SwapiResponse<T> = {
    count: number;
    next?: string;
    previous?: string;
    results: T[];
}
export type People = {
    name: string;
    height: number;
    starships: string[];
    films: string[];
}
type Movie = {
    title: string;
}
const fetchOptions = {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
};

export const getPeople = async (page: number) => {
  const teste = await fetch(`https://swapi.dev/api/people/?page=${page}`, fetchOptions);
  return await teste.json() as SwapiResponse<People>;
};

export const getMovie = async (url: string) => {
  const teste = await fetch(url, fetchOptions);
  return await teste.json() as Movie;
};
