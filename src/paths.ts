export interface Path {
  id: number;
  streets: string;
  isLong: boolean;
}

const paths: Path[] = [
  { id: 0, streets: "ul. Bałtycka i ul. Nowa", isLong: true },
  { id: 1, streets: "ul. Staszica od końca do nr 34", isLong: true },
  {
    id: 2,
    streets: "ul. Kolejarzy nr nieparzyste od początku do końca",
    isLong: true,
  },
  {
    id: 3,
    streets: "ul. Lyszcze od początku do końca (bez nr 5 - 5c i 7 - 7c)",
    isLong: true,
  },
  { id: 4, streets: "ul. Maszynistów od początku do końca", isLong: false },
  {
    id: 5,
    streets: "ul. Torowa od 66 do 84, ul. Semaforowa od początku do końca",
    isLong: false,
  },
  { id: 6, streets: "ul. Torowa od 50 do 24 i ul. Trakcyjna", isLong: false },
  {
    id: 7,
    streets: "ul. Kolejarzy nr parzyste od początku do nr 40",
    isLong: false,
  },
  {
    id: 8,
    streets: "ul. Kierunkowa od początku do końca i ulica Sygnałów",
    isLong: false,
  },
  {
    id: 9,
    streets: "ul. Torowa od końca do początku (oprócz nr 24 - 50 oraz 66 - 84)",
    isLong: false,
  },
  { id: 10, streets: "ul. Skośna od Obwodnicy i ul. Szybów", isLong: false },
  {
    id: 11,
    streets:
      "ul. Skośna od początku do Obwodnicy, ul. Rudna 14, ul. Cicha 13, 14 i 15",
    isLong: false,
  },
  { id: 12, streets: "ul. Staszica od początku do nr 23", isLong: false },
  {
    id: 13,
    streets:
      "ul. Daszyńskiego od początku do końca, ul. Ludowa i ul. Staszica nr 30, 29, 28, 27, 26, 25, 20",
    isLong: false,
  },
  {
    id: 14,
    streets: "ul. Szarych Szeregów od początku do końca i ul. Skarbka",
    isLong: false,
  },
  {
    id: 15,
    streets: "ul. Szczęść Boże nr 52, 54, 58, 70 do kopalni zabytkowej",
    isLong: true,
  },
  {
    id: 16,
    streets: "ul. Prosta od końca do początku, Cicha (od nr 12 do 1)",
    isLong: false,
  },
  {
    id: 17,
    streets:
      "ul. Lyszcze bloki 5 - 5c oraz 7 - 7c, ul. Gliwicka nr 37, 39, 39a, 41 i 43",
    isLong: false,
  },
  {
    id: 18,
    streets:
      "ul. Rudna, ul. Rudolfa von Carnalla, ul. Łomnickiego od końca, ul. Gliwicka 46",
    isLong: false,
  },
  {
    id: 19,
    streets: "ul. Skalna, ul. Gliwicka (od ul. Nowej do końca)",
    isLong: false,
  },
  {
    id: 20,
    streets:
      "ul. Gliwicka od Obwodnicy do początku bez nr 37, 39, 39a, 41, 43, 46",
    isLong: false,
  },
  {
    id: 21,
    streets:
      "ul. Gliwicka (od ul. Nowej do Obwodnicy), ul. Śląska Kujawska i Wielkopolska",
    isLong: false,
  },
  {
    id: 22,
    streets: "ul. Konduktorska od początku do końca (bez szeregowców)",
    isLong: false,
  },
  {
    id: 23,
    streets: "ul. Konduktorska (szeregowce, nr parzyste)",
    isLong: false,
  },
  {
    id: 24,
    streets: "ul. Konduktorska (szeregowce, nr nieparzyste)",
    isLong: false,
  },
  { id: 25, streets: "ul. Małgorzaty i Dolomitów", isLong: false },
  { id: 26, streets: "ul. Szczęść Boże (od 1 - 49)", isLong: false },
  { id: 27, streets: "Kolęda dodatkowa", isLong: true },
];

export default paths;
