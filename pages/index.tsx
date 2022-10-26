import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { useData, dictionary, usePostMessageWithHeight } from "../hooks";
import { MultipleSelect, Legenda, Graf } from "../components";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";

const isMobile = false;

const translate = (string: string) => {
  const result = dictionary.find(word => {
    return word[0] === string;
  });
  if (typeof result === "undefined") console.log(string);
  return result ? result[1] : string;
};

const Home: NextPage = () => {
  const { containerRef, postHeightMessage } = usePostMessageWithHeight(
    "cro_znicena_technika"
  );
  const [processed, setProcessed] = useState([]);
  const [datum, setDatum] = useState("");
  const [vybrane, setVybrane] = useState([
    "Všechny druhy vojenské techniky",
    "Tanky",
    "Bojová vozidla pěchoty",
  ]);
  const [maxLength, setMaxLength] = useState(2020);
  const { data, isSuccess }: any = useData(
    "https://data.irozhlas.cz/oryx-cache/totals_by_type.csv",
    "data"
  );
  const updated = useData(
    "https://data.irozhlas.cz/oryx-cache/updated.json",
    "updated"
  );

  useEffect(() => {
    const vybranaData = processed.filter((d: { type: string }) =>
      vybrane.includes(d.type)
    );
    const newMax = vybranaData.reduce(
      (acc: number, curr: { type_total: number }) => {
        const total = curr.type_total;
        return total > acc ? total : acc;
      },
      0
    );
    setMaxLength(newMax);
  }, [vybrane, processed]);

  useEffect(() => {
    if (typeof data === "undefined") {
      return;
    }
    const result = data.map(
      (item: {
        equipment_type: string;
        destroyed: string;
        abandoned: string;
        captured: string;
        damaged: string;
        type_total: string;
      }) => {
        return {
          ...item,
          destroyed: +item.destroyed,
          abandoned: +item.abandoned,
          captured: +item.captured,
          damaged: +item.damaged,
          type_total: +item.type_total,
          type: translate(item.equipment_type),
        };
      }
    );
    setProcessed(result);
  }, [data]);

  useEffect(() => {
    if (typeof updated.data === "undefined") {
      return;
    }
    const result = new Date(updated.data.updated).toLocaleString("cs-CZ", {
      dateStyle: "short",
    });
    setDatum(result);
  }, [updated]);

  useEffect(() => {
    postHeightMessage();
  }, [vybrane, postHeightMessage]);

  return (
    <div ref={containerRef}>
      <h1 className="text-3xl font-bold pb-6">
        Porovnejte si ověřené ztráty vojenské techniky
      </h1>
      <MultipleSelect
        data={processed}
        vybrane={vybrane}
        setVybrane={setVybrane}
      />
      <Legenda isMobile={isMobile} />
      {processed.length !== 0 &&
        vybrane.map((v, i) => (
          <Graf
            key={i}
            v={v}
            data={processed}
            isMobile={isMobile}
            maxLength={maxLength}
          ></Graf>
        ))}
      <Container>
        <Typography
          variant="caption"
          display="flex"
          sx={{ justifyContent: "flex-end" }}
        >
          Zdroj dat:&nbsp;
          <Link href="https://www.oryxspioenkop.com/2022/02/attack-on-europe-documenting-equipment.html">
            Oryx
          </Link>
          , stav k {datum}
        </Typography>
      </Container>
    </div>
  );
};

export default Home;
