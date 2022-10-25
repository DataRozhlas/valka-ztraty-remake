import ky from "ky";
import { useQuery } from "@tanstack/react-query";
import { csvParse } from "d3-dsv";

const fetchData = async (url: string) => {
  if (url.slice(-3) === "csv") {
    const raw = await ky.get(url).text();
    const result = csvParse(raw);
    return result;
  }
  if (url.slice(-4) === "json") {
    const result = await ky.get(url).json();
    return result;
  }
};

const useData = (url: string, key: string) => {
  return useQuery([key], () => fetchData(url));
};

export { useData, fetchData };
