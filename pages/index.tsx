import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useData, dictionary } from "../hooks";
import { useQuery } from "@tanstack/react-query";

const translate = (string: string) => {
  const result = dictionary.find(word => {
    return word[0] === string;
  });
  if (typeof result === "undefined") console.log(string);
  return result ? result[1] : string;
};

const Home: NextPage = () => {
  const { data, isSuccess }: any = useData(
    "https://data.irozhlas.cz/oryx-cache/totals_by_type.csv",
    "data"
  );
  const updated = useData(
    "https://data.irozhlas.cz/oryx-cache/updated.json",
    "updated"
  );

  const processed = useQuery(
    ["processed"],
    () => {
      return data.map((item: { equipment_type: string }) => {
        return {
          ...item,
          type: translate(item.equipment_type),
        };
      });
    },
    { enabled: isSuccess }
  );

  return <div>ahoj</div>;
};

export default Home;
