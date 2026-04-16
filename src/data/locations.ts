export type Location = {
  slug: string;
  city: string;
  address: string;
  hours: string;
};

export const locations: Location[] = [
  {
    slug: "oslo-sentrum",
    city: "Oslo sentrum",
    address: "Storgata 12, 0184 Oslo",
    hours: "Man–lør 07–22, søn 09–20",
  },
  {
    slug: "oslo-lufthavn",
    city: "Oslo lufthavn",
    address: "Edvard Munchs veg 3, 2061 Gardermoen",
    hours: "Åpent alle dager 06–24",
  },
  {
    slug: "bergen",
    city: "Bergen",
    address: "Strandgaten 207, 5004 Bergen",
    hours: "Man–lør 07–21, søn 10–19",
  },
  {
    slug: "trondheim",
    city: "Trondheim",
    address: "Olav Tryggvasons gate 24, 7011 Trondheim",
    hours: "Man–lør 07–21, søn stengt",
  },
  {
    slug: "stavanger",
    city: "Stavanger",
    address: "Klubbgata 3, 4013 Stavanger",
    hours: "Man–lør 08–20, søn stengt",
  },
  {
    slug: "tromso",
    city: "Tromsø",
    address: "Storgata 58, 9008 Tromsø",
    hours: "Man–fre 08–19, lør 10–16",
  },
];
