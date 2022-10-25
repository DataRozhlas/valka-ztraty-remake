import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useData } from "../hooks";

const Home: NextPage = () => {
  const data = useData(
    "https://data.irozhlas.cz/oryx-cache/totals_by_type.csv",
    "data"
  );
  const updated = useData(
    "https://data.irozhlas.cz/oryx-cache/updated.json",
    "updated"
  );

  return <div>ahoj</div>;
};

export default Home;
