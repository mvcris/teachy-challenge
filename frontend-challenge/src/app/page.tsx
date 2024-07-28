'use client';

import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from './components/Table';
import { InfiniteScroll } from './components/InfiniteScroll';
import {
  getMovie, getPeople, People, SwapiResponse,
} from './api';
import { cmToMeters } from './utils';

export default function Home() {
  const [peopleResult, setPeopleResult] = useState<SwapiResponse<People>>({
    count: 0,
    results: [],
  });
  const [page, setPage] = useState(1);
  const [prevPage, setPrevPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [films, setFilms] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const fetchPeople = async () => {
      if (page !== prevPage && !loading && (peopleResult.next || page === 1)) {
        setLoading(true);
        try {
          const data = await getPeople(page);
          setPeopleResult((prevResult) => ({
            ...data,
            results: [...prevResult.results, ...data.results],
          }));
          setPrevPage(page);
        } catch (e) {
          toast.error('Erro ao buscar os personagens, por favor tente novamente mais tarde');
        }
        setLoading(false);
      }
    };
    fetchPeople();
  }, [page, prevPage, loading, peopleResult.next]);

  useEffect(() => {
    peopleResult.results?.forEach((person) => {
      person.films.forEach((film) => {
        if (!films.has(film)) {
          films.set(film, '');
          setFilms(new Map(films));
          getMovie(film)
            .then((data) => {
              films.set(film, data.title);
              setFilms(new Map(films));
            })
            .catch((e) => {
              toast.error(`Erro ao buscar o filme ${film}`);
              films.delete(film);
              setFilms(new Map(films));
            });
        }
      });
    });
  }, [peopleResult, films]);

  const getMovieName = (film: string) => films.get(film) || '';

  const onScrollEnd = () => {
    setPage((page) => page + 1);
  };

  return (
    <main className="flex min-h-screen flex-col items-start p-12">
      <h1 className="text-xl font-semibold mb-4">Personagens dos filmes Star Wars</h1>
      <InfiniteScroll onScrollEnd={onScrollEnd}>
        <div className="people-list overflow-y-scroll w-full h-[300px]">
          <Table>
            <TableHeader>
              <TableHead>Nome</TableHead>
              <TableHead>Altura</TableHead>
              <TableHead>Nº de espaçonaves</TableHead>
              <TableHead className="p-2 font-normal text-sm text-left w-[40%]">Filmes</TableHead>
            </TableHeader>
            <TableBody>
              {peopleResult.results?.map((person) => (
                <TableRow key={person.name}>
                  <TableCell>{person.name}</TableCell>
                  <TableCell>
                    {cmToMeters(person.height)}
                    m
                  </TableCell>
                  <TableCell>{person.starships.length}</TableCell>
                  <TableCell>
                    {person.films.map((film, index) => {
                      const movieName = getMovieName(film);
                      if (movieName) {
                        return (
                          <span key={film}>
                            {movieName}
                            {' '}
                            {index < person.films.length - 1 ? ', ' : ''}
                          </span>
                        );
                      }
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </InfiniteScroll>
      {loading && <p>Carregando...</p>}
      <ToastContainer />
    </main>
  );
}
