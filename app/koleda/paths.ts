export interface Path {
  id: number;
  streets: { normal: string; reversed: string };
  isLong: boolean;
}

const paths: Path[] = [
  {
    id: 0,
    streets: {
      normal: "ul. Bałtycka i ul. Nowa",
      reversed: "ul. Nowa i ul. Bałtycka",
    },
    isLong: true,
  },
  {
    id: 1,
    streets: {
      normal: "ul. Staszica od końca do nr 34",
      reversed: "ul. Staszica od nr 34 do końca",
    },
    isLong: true,
  },
  {
    id: 2,
    streets: {
      normal: "ul. Kolejarzy nr nieparzyste od początku do końca",
      reversed: "ul. Kolejarzy nr nieparzyste od końca do początku",
    },
    isLong: true,
  },
  {
    id: 3,
    streets: {
      normal: "ul. Lyszcze od początku do końca (bez nr 5 - 5c i 7 - 7c)",
      reversed: "ul. Lyszcze od końca do początku (bez nr 5 - 5c i 7 - 7c)",
    },
    isLong: true,
  },
  {
    id: 4,
    streets: {
      normal: "ul. Maszynistów od początku do końca",
      reversed: "ul. Maszynistów od końca do początku",
    },
    isLong: false,
  },
  {
    id: 5,
    streets: {
      normal: "ul. Torowa od 84 do 66, ul. Semaforowa od końca do początku",
      reversed: "ul. Semaforowa od końca do początku, ul. Torowa od 66 do 84",
    },
    isLong: false,
  },
  {
    id: 6,
    streets: {
      normal: "ul. Torowa od 50 do 24 i ul. Trakcyjna",
      reversed: "ul. Torowa od 24 do 50 i ul. Trakcyjna",
    },
    isLong: false,
  },
  {
    id: 7,
    streets: {
      normal: "ul. Kolejarzy nr parzyste od początku do nr 40",
      reversed: "ul. Kolejarzy nr parzyste od nr 40 do początku",
    },
    isLong: false,
  },
  {
    id: 8,
    streets: {
      normal: "ul. Kierunkowa od początku do końca i ulica Sygnałów",
      reversed: "ul. Kierunkowa od końca do początku i ulica Sygnałów",
    },
    isLong: false,
  },
  {
    id: 9,
    streets: {
      normal:
        "ul. Torowa od końca do początku (oprócz nr 24 - 50 oraz 66 - 84)",
      reversed:
        "ul. Torowa od początku do końca (oprócz nr 24 - 50 oraz 66 - 84)",
    },
    isLong: false,
  },
  {
    id: 10,
    streets: {
      normal: "ul. Skośna od Obwodnicy (w kierunku ulicy Nowej) i ul. Szybów",
      reversed: "ul. Szybów i ul. Skośna (od ul. Nowej do Obwodnicy)",
    },
    isLong: false,
  },
  {
    id: 11,
    streets: {
      normal:
        "ul. Cicha 13, 14 i 15, ul. Rudna 14, ul. Skośna od początku do Obwodnicy",
      reversed:
        "ul. Skośna od Obwodnicy do początku, ul. Rudna 14, ul. Cicha 15, 14 i 13",
    },
    isLong: false,
  },
  {
    id: 12,
    streets: {
      normal: "ul. Staszica od początku do nr 23",
      reversed: "ul. Staszica od nr 23 do początku",
    },
    isLong: false,
  },
  {
    id: 13,
    streets: {
      normal:
        "ul. Daszyńskiego od końca do początku, ul. Ludowa i ul. Staszica nr 30, 29, 28, 27, 26, 25, 20",
      reversed:
        "ul. Staszica nr 20, 25, 26, 27, 28, 29, 30, ul. Ludowa, ul. Daszyńskiego od początku do końca",
    },
    isLong: false,
  },
  {
    id: 14,
    streets: {
      normal: "ul. Skarbka, ul. Szarych Szeregów od początku do końca",
      reversed: "ul. Szarych Szeregów od końca do początku i ul. Skarbka",
    },
    isLong: false,
  },
  {
    id: 15,
    streets: {
      normal: "ul. Szczęść Boże od nr 52 do kopalni zabytkowej",
      reversed: "ul. Szczęść Boże od kopalni zabytkowej do nr 52",
    },
    isLong: true,
  },
  {
    id: 16,
    streets: {
      normal: "ul. Prosta od końca do początku, Cicha od nr 12 do 1",
      reversed: "Cicha od nr 1 do 12, ul. Prosta od początku do końca ",
    },
    isLong: false,
  },
  {
    id: 17,
    streets: {
      normal:
        "ul. Lyszcze bloki 5 - 5c oraz 7 - 7c, ul. Gliwicka nr 37, 39, 39a, 41 i 43",
      reversed:
        "ul. Gliwicka nr 43, 41, 39a, 39, 37, ul. Lyszcze bloki 7c - 7 oraz 5c - 5 ",
    },
    isLong: false,
  },
  {
    id: 18,
    streets: {
      normal:
        "ul. Rudna, ul. Rudolfa von Carnalla, ul. Łomnickiego od końca, ul. Gliwicka 46",
      reversed:
        "ul. Gliwicka 46, ul. Łomnickiego od początku, ul. Rudolfa von Carnalla, ul. Rudna",
    },
    isLong: false,
  },
  {
    id: 19,
    streets: {
      normal: "ul. Skalna, ul. Gliwicka od końca (Rept śl.) do ul. Nowej",
      reversed: "ul. Gliwicka od ul. Nowej w kierunku Rept śl., ul. Skalna",
    },
    isLong: false,
  },
  {
    id: 20,
    streets: {
      normal:
        "ul. Gliwicka od Obwodnicy do początku (ronda Solidarności) bez nr 37, 39, 39a, 41, 43, 46",
      reversed:
        "ul. Gliwicka od początku (ronda Solidarności) do Obwodnicy bez nr 37, 39, 39a, 41, 43, 46",
    },
    isLong: false,
  },
  {
    id: 21,
    streets: {
      normal:
        "ul. Gliwicka od ul. Nowej do Obwodnicy, ul. Śląska, Kujawska i Wielkopolska",
      reversed:
        "ul. Śląska, Wielkopolska i Kujawska, ul. Gliwicka od Obwodnicy do ul. Nowej",
    },
    isLong: false,
  },
  {
    id: 22,
    streets: {
      normal: "ul. Konduktorska od początku do końca (bez szeregowców)",
      reversed: "ul. Konduktorska od końca do początku (bez szeregowców)",
    },
    isLong: false,
  },
  {
    id: 23,
    streets: {
      normal: "ul. Konduktorska (szeregowce, nr parzyste)",
      reversed: "ul. Konduktorska (szeregowce, nr parzyste) - odwrócona",
    },
    isLong: false,
  },
  {
    id: 24,
    streets: {
      normal: "ul. Konduktorska (szeregowce, nr nieparzyste)",
      reversed: "ul. Konduktorska (szeregowce, nr nieparzyste) - odwrócona",
    },
    isLong: false,
  },
  {
    id: 25,
    streets: {
      normal: "ul. Małgorzaty i Dolomitów",
      reversed: "ul. Dolomitów i Małgorzaty",
    },
    isLong: false,
  },
  {
    id: 26,
    streets: {
      normal: "ul. Szczęść Boże (od 1 - 51)",
      reversed: "ul. Szczęść Boże (od 51 - 1)",
    },
    isLong: false,
  },
  {
    id: 27,
    streets: { normal: "Kolęda dodatkowa", reversed: "Kolęda dodatkowa" },
    isLong: true,
  },
];

export default paths;
