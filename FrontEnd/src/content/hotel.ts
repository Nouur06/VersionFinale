// Textes de l'hôtel (page d'accueil et contact). Modifiez librement.

export const hotel = {
  // Renseignez ces coordonnées : elles s'affichent automatiquement sur la page Contact
  // (une ligne vide n'est pas affichée).
  contact: {
    phone: "",
    email: "",
    address: "",
    hours: "",
  },

  story: [
    "Dar El Bahdja, « la maison de l’éclat », vous accueille à Alger, la ville qu’on surnomme El Bahdja, « la joyeuse ». Notre hôtel s’inspire des maisons blanches de la Casbah : lumière, arcs, matières nobles et calme.",
    "Voyageurs d’affaires, couples ou familles : chacun trouve ici un séjour confortable, une table qui revisite la cuisine algérienne et un point de départ idéal pour explorer la ville et ses trésors.",
    "Notre ambition : vous offrir un séjour confortable et vous donner envie de découvrir l’Algérie, de la Méditerranée au Sahara.",
  ],

  pillars: [
    { title: "Hospitalité", text: "Un accueil chaleureux, fidèle à la tradition algérienne." },
    { title: "Élégance", text: "Des intérieurs sobres, clairs et soignés." },
    { title: "Culture", text: "Des repères pour découvrir le patrimoine et les régions du pays." },
  ],

  services: [
    { title: "Restaurant", text: "Cuisine algérienne revisitée", to: "/a-propos/gastronomie" },
    { title: "Hammam", text: "Soins et détente", to: "" },
    { title: "Patrimoine", text: "Casbah, Tipasa, Timgad, Tassili", to: "/a-propos" },
    { title: "Accueil", text: "Une hospitalité chaleureuse", to: "" },
  ],
};
