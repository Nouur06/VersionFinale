// Contenu de la page « Patrimoine ». Modifiez librement les textes ci-dessous :
// chaque thème a sa propre page (/a-propos/<slug>) avec le choix « avec un guide » ou « en liberté ».
//
// Photos (facultatif) : déposez un fichier dans public/images/heritage/<slug>.jpg
// (ex. public/images/heritage/casbah.jpg). Sans fichier, un motif décoratif s'affiche.

export interface HeritageTheme {
  slug: string;
  title: string;
  tagline: string;
  gradient: string; // classes Tailwind du fond décoratif
  intro: string[];
  why: string;
  highlights: { title: string; text: string }[];
  guided: { summary: string; duration: string; includes: string[] };
  solo: { summary: string; duration: string; routeTitle: string; route: string[]; tips: string[] };
}

export const themes: HeritageTheme[] = [
  {
    slug: "casbah",
    title: "La Casbah d’Alger",
    tagline: "La citadelle blanche qui descend vers la mer",
    gradient: "from-vert to-teal-700",
    intro: [
      "La Casbah (de l’arabe qasba, « citadelle ») est la vieille ville d’Alger, bâtie en amphithéâtre face à la baie. Un comptoir phénicien, puis la cité romaine d’Icosium, ont précédé la ville qui prend son essor à l’époque ottomane, à partir du XVIe siècle.",
      "Inscrite au patrimoine mondial de l’UNESCO en 1992, elle forme un dédale de ruelles étroites, d’escaliers et de passages voûtés (les sabats). Ses maisons s’ouvrent sur des cours intérieures ornées de faïences, à l’abri du bruit de la rue.",
      "La Casbah est aussi un lieu de mémoire : elle fut l’un des cœurs de la bataille d’Alger en 1956-1957, pendant la guerre de libération. C’est là, enfin, qu’est né le chaâbi, la musique populaire d’Alger.",
    ],
    why: "Parce que la Casbah n’est pas un décor : on y vit encore. Y marcher, c’est lire l’histoire d’Alger à même les murs, et comprendre l’architecture des maisons blanches qui a inspiré Dar El Bahdja.",
    highlights: [
      { title: "Djamaa el Kebir", text: "La Grande Mosquée, l’une des plus anciennes d’Alger, remonte à la fin du XIe siècle." },
      { title: "Djamaa el Djedid", text: "La « mosquée neuve », de style ottoman, bâtie au XVIIe siècle près du front de mer, avec ses coupoles blanches." },
      { title: "Le Palais des Raïs (Bastion 23)", text: "Un ensemble de palais et de bastions ottomans au bord de l’eau, restauré, qui accueille expositions et manifestations culturelles." },
      { title: "La Citadelle", text: "Au sommet de la ville, la forteresse ottomane domine la Casbah et la baie." },
      { title: "Les maisons à patio", text: "Observez la skifa (le vestibule d’entrée), la cour intérieure et les terrasses : une architecture pensée pour la fraîcheur et l’intimité." },
    ],
    guided: {
      summary: "Un guide local vous conduit dans les ruelles, vous raconte ce qu’on ne devine pas seul (histoires de familles, métiers, anecdotes) et vous aide à vous repérer.",
      duration: "2 h 30 à 3 h, de préférence le matin",
      includes: [
        "Parcours à pied entre mosquées, palais et ruelles",
        "Explications sur l’architecture et l’histoire du quartier",
        "Pause thé et douceurs possible, sur demande",
      ],
    },
    solo: {
      summary: "La Casbah se découvre à pied, sans se presser, en gardant un peu de temps pour se perdre.",
      duration: "2 à 3 heures, le matin",
      routeTitle: "Itinéraire conseillé (ordre indicatif)",
      route: [
        "Place des Martyrs, point de départ au pied de la Casbah",
        "Djamaa el Kebir et Djamaa el Djedid",
        "Montée dans les ruelles vers le haut de la vieille ville",
        "Palais des Raïs (Bastion 23), face à la mer, pour terminer",
      ],
      tips: [
        "Chaussures confortables : beaucoup d’escaliers et des pavés irréguliers",
        "Privilégiez la matinée et restez sur les itinéraires fréquentés : certaines maisons sont fragiles",
        "Demandez toujours avant de photographier des habitants",
        "Tenue discrète pour entrer dans les lieux de culte, et déchaussez-vous si on vous le demande",
        "Gardez un peu de monnaie pour un thé ou une pâtisserie en chemin",
      ],
    },
  },
  {
    slug: "histoire",
    title: "L’histoire de l’Algérie",
    tagline: "Des gravures du Sahara à l’indépendance de 1962",
    gradient: "from-or-fonce to-vert",
    intro: [
      "L’Algérie est un carrefour entre la Méditerranée, l’Afrique et le monde arabe. Ses premiers habitants ont laissé sur les parois du Tassili n’Ajjer des peintures et des gravures vieilles de plusieurs millénaires, qui racontent un Sahara alors verdoyant.",
      "Dans l’Antiquité, les royaumes amazighs de Numidie, dont celui de Massinissa, puis les cités romaines comme Timgad ou Djémila façonnent le pays. Le christianisme y compte Saint Augustin, évêque d’Hippone, l’actuelle Annaba.",
      "Après l’arrivée de l’islam, au VIIe siècle, se succèdent des dynasties amazighes et arabes : les Rostémides de Tahert, les Hammadides, les Almoravides, les Almohades, les Zianides de Tlemcen. En 1516, Alger devient le centre de la Régence ottomane.",
      "En 1830 débute la colonisation française ; l’émir Abdelkader mène une longue résistance (1832-1847). La guerre de libération commence le 1er novembre 1954 et l’indépendance est proclamée le 5 juillet 1962. Aujourd’hui, l’arabe et le tamazight sont les langues officielles du pays.",
    ],
    why: "Comprendre l’histoire donne du sens à tout ce que vous verrez ensuite : une ruelle de la Casbah, une ruine romaine, une chanson. C’est la meilleure porte d’entrée pour voyager en Algérie les yeux ouverts.",
    highlights: [
      { title: "Tassili n’Ajjer", text: "Un musée de plein air dans le Sahara, classé à l’UNESCO en 1982 pour ses milliers de peintures et de gravures rupestres." },
      { title: "Timgad et Djémila", text: "Deux cités romaines classées à l’UNESCO en 1982 : l’une au plan en damier, l’autre nichée dans les montagnes." },
      { title: "La Kalâa des Béni Hammad", text: "Capitale des Hammadides au XIe siècle, classée à l’UNESCO en 1980." },
      { title: "La Casbah d’Alger", text: "Cœur de la ville ottomane, classée à l’UNESCO en 1992." },
      { title: "Le Maqam Echahid", text: "Le monument de la mémoire de la guerre de libération domine Alger depuis les hauteurs de la ville." },
    ],
    guided: {
      summary: "Un guide-conférencier relie les lieux et les époques : récits, contexte, anecdotes, et réponses à toutes vos questions.",
      duration: "Une demi-journée à une journée, selon l’itinéraire",
      includes: [
        "Itinéraire adapté à vos centres d’intérêt",
        "Explications dans la langue de votre choix, selon la disponibilité du guide",
        "Transport organisé sur demande",
      ],
    },
    solo: {
      summary: "Avancez à votre rythme, en vous appuyant sur ces repères pour relier les époques.",
      duration: "À votre rythme, de quelques heures à plusieurs jours",
      routeTitle: "Parcours conseillé",
      route: [
        "Maqam Echahid et musée du Moudjahid, pour la mémoire de la guerre de libération",
        "La Casbah d’Alger, pour la période ottomane",
        "Tipasa, à environ 70 km à l’ouest d’Alger, pour l’Antiquité punique et romaine",
        "Timgad ou Djémila, pour aller plus loin, avec une ou deux nuits sur place",
      ],
      tips: [
        "Commencez par un musée ou un site proche avant les excursions lointaines",
        "Les sites antiques offrent peu d’ombre : eau, chapeau et bonnes chaussures",
        "Demandez les horaires d’ouverture à la réception : ils varient selon les sites",
        "Dans les lieux de mémoire, respectez le recueillement",
      ],
    },
  },
  {
    slug: "gastronomie",
    title: "La cuisine traditionnelle",
    tagline: "Couscous, chorba, douceurs au miel : un pays, mille tables",
    gradient: "from-amber-700 to-or",
    intro: [
      "La cuisine algérienne reflète la diversité du pays : blé, olive, dattes, agneau et épices se déclinent selon les régions. Le couscous en est l’emblème ; le savoir-faire qui l’entoure a été inscrit en 2020 par l’UNESCO, sur une candidature commune de l’Algérie, de la Mauritanie, du Maroc et de la Tunisie.",
      "À Alger, goûtez la chorba (soupe à la viande et aux légumes), la rechta (fines nouilles, poulet et sauce blanche) ou le tajine zitoune aux olives. À l’Est, la chakhchoukha, une galette déchirée nappée de sauce épicée ; à l’Ouest, la garantita d’Oran, un flan de pois chiches servi chaud. En Kabylie, le berkoukes et le couscous à l’huile d’olive.",
      "Les douceurs ne sont pas en reste : makroud (semoule et dattes), baklawa, qalb el louz, griwech, tcharek parfumé à la fleur d’oranger. Le tout avec un thé à la menthe ou un café.",
      "À Dar El Bahdja, notre restaurant revisite ces classiques.",
    ],
    why: "Parce que la table est la meilleure façon de rencontrer un pays : chaque plat raconte une région, une fête ou une famille.",
    highlights: [
      { title: "Le couscous", text: "Semoule roulée à la main et cuite à la vapeur, servie avec légumes et viande selon la région. Le plat traditionnel du vendredi et des grandes occasions." },
      { title: "Chorba et chorba frik", text: "Une soupe parfumée aux herbes ; la version au frik, du blé vert concassé, est très appréciée." },
      { title: "Rechta et chakhchoukha", text: "Deux plats de pâtes maison : la rechta d’Alger, en sauce blanche, et la chakhchoukha de l’Est, en sauce épicée." },
      { title: "Mhadjeb et garantita", text: "Crêpes de semoule fourrées à la tomate et à l’oignon, flan de pois chiches d’Oran : les en-cas à goûter dans la rue." },
      { title: "Pâtisseries et dattes", text: "Makroud, baklawa, griwech, qalb el louz ; et les dattes Deglet Nour, réputées, cultivées notamment autour de Biskra." },
    ],
    guided: {
      summary: "Un guide vous emmène chez les artisans et sur les marchés, vous explique les plats et vous fait déguster.",
      duration: "2 à 3 heures",
      includes: [
        "Visite d’un marché ou d’une pâtisserie traditionnelle",
        "Dégustations commentées",
        "Cours de cuisine ou repas chez l’habitant, sur demande et selon les possibilités",
      ],
    },
    solo: {
      summary: "Goûtez à votre rythme : marchés, pâtisseries, tables de quartier.",
      duration: "Une journée, au fil des envies",
      routeTitle: "Une journée gourmande",
      route: [
        "Le matin, un marché de quartier : fruits secs, olives, épices",
        "Pour le déjeuner, le plat du jour (couscous le vendredi)",
        "Au goûter, une pâtisserie traditionnelle : makroud, baklawa, griwech",
        "En fin de journée, un thé à la menthe",
      ],
      tips: [
        "Demandez le plat du jour : c’est souvent le meilleur",
        "Pendant le Ramadan, les horaires des restaurants changent : renseignez-vous à la réception",
        "Signalez vos allergies et régimes alimentaires",
        "Rapportez de l’huile d’olive ou des figues sèches de Kabylie : de beaux souvenirs gourmands",
      ],
    },
  },
  {
    slug: "musique",
    title: "Raï, chaâbi et musiques d’Algérie",
    tagline: "Du cœur de la Casbah aux nuits d’Oran",
    gradient: "from-purple-900 to-or-fonce",
    intro: [
      "La musique algérienne est aussi variée que ses paysages. Deux genres ont fait le tour du monde : le chaâbi, né à Alger, et le raï, venu de l’Ouest du pays.",
      "Le chaâbi (« populaire ») naît dans la Casbah d’Alger au début du XXe siècle. Héritier de la poésie chantée du malhoun et de la musique andalouse, il se joue avec une voix, une mandole et des percussions. Son grand maître est El Hadj M’Hamed El Anka. Parmi les voix les plus aimées : Dahmane El Harrachi (« Ya Rayah »), El Hachemi Guerouabi, Amar Ezzahi.",
      "Le raï (« opinion », « avis ») vient de la région d’Oran. Né dans les chants des cheikhate, les chanteuses populaires, il se modernise dans les années 1970 et 1980 avec les « chebs » avant de conquérir le monde, avec Khaled ou Cheb Mami. Cheikha Rimitti en est restée la « mère ». Le raï a été inscrit en 2022 par l’UNESCO au patrimoine culturel immatériel de l’humanité.",
      "Ajoutez la musique andalouse (sanaâ à Alger, gharnati à Tlemcen, malouf à Constantine), les chants kabyles, l’imzad des Touaregs ou l’Ahellil du Gourara : un patrimoine immatériel que l’UNESCO a reconnu à plusieurs reprises.",
    ],
    why: "Parce qu’on comprend un pays autant par ses chansons que par ses monuments : le chaâbi raconte Alger, le raï raconte la jeunesse et la liberté.",
    highlights: [
      { title: "Le chaâbi", text: "La voix de la Casbah : poésie chantée, mandole, banjo et derbouka. À écouter en suivant les paroles." },
      { title: "Le raï", text: "Des rythmes entraînants et une voix libre : de Cheikha Rimitti à Khaled et Cheb Mami." },
      { title: "La musique andalouse", text: "Un art savant hérité d’Al-Andalus, avec ses écoles d’Alger, de Tlemcen et de Constantine." },
      { title: "Le chant kabyle", text: "Des voix et des poèmes devenus emblématiques, d’Idir à Lounis Aït Menguellet." },
      { title: "Les traditions du Sud", text: "L’imzad touareg et l’Ahellil du Gourara, deux traditions inscrites à l’UNESCO." },
    ],
    guided: {
      summary: "Une soirée musicale commentée : un guide ou un musicien vous présente les genres, les instruments et les textes.",
      duration: "Une soirée, environ 2 heures",
      includes: [
        "Présentation des instruments et des grands genres",
        "Traduction des paroles principales",
        "Sortie ou concert selon la programmation locale et les disponibilités",
      ],
    },
    solo: {
      summary: "Composez votre bande-son avant d’arriver, puis laissez la ville faire le reste.",
      duration: "À écouter avant, pendant et après le voyage",
      routeTitle: "Pour écouter",
      route: [
        "Chaâbi : El Hadj M’Hamed El Anka, Dahmane El Harrachi, El Hachemi Guerouabi, Amar Ezzahi",
        "Raï : Cheikha Rimitti, Khaled, Cheb Mami, Cheb Hasni",
        "Musique andalouse : un orchestre de sanaâ ou de gharnati",
        "Chant kabyle : Idir, Lounis Aït Menguellet",
      ],
      tips: [
        "Demandez à la réception les concerts et soirées du moment",
        "Dans un café ou un restaurant qui diffuse de la musique, demandez le nom du morceau : on vous répondra avec plaisir",
        "Faites traduire un texte de chaâbi : on l’écoute tout autrement",
        "Pour les sorties en soirée, choisissez des lieux recommandés par la réception",
      ],
    },
  },
  {
    slug: "antiquite",
    title: "Tipasa, Djémila, Timgad",
    tagline: "Les cités antiques du Maghreb",
    gradient: "from-sky-800 to-or",
    intro: [
      "L’Algérie conserve certaines des plus belles ruines romaines d’Afrique du Nord. Tipasa, Djémila et Timgad sont classées à l’UNESCO depuis 1982.",
      "Tipasa, comptoir punique devenu cité romaine, s’étend face à la Méditerranée, à environ 70 km à l’ouest d’Alger : basiliques, théâtre et villas entre pins et mer.",
      "Djémila (l’antique Cuicul) est nichée dans les montagnes près de Sétif, avec son forum, ses temples et ses mosaïques. Timgad (Thamugadi), fondée vers l’an 100 sous l’empereur Trajan, surprend par son plan en damier presque intact.",
      "Le Tombeau royal de Maurétanie, près de Tipasa, rappelle que ces terres avaient leurs propres royaumes amazighs avant Rome.",
    ],
    why: "Parce qu’ils racontent l’Algérie avant l’Algérie : Phéniciens, Numides, Romains, premiers chrétiens, dans des paysages spectaculaires.",
    highlights: [
      { title: "Tipasa", text: "Une cité entre mer et collines, à une journée de route d’Alger." },
      { title: "Cherchell", text: "L’antique Caesarea, capitale d’un royaume maurétanien, et son musée de statues et de mosaïques, à quelques kilomètres de Tipasa." },
      { title: "Djémila", text: "Un site de montagne au calme remarquable, avec forum, temples et mosaïques." },
      { title: "Timgad", text: "Le plan en damier d’une colonie romaine fondée vers l’an 100." },
      { title: "Le Tombeau royal de Maurétanie", text: "Un grand mausolée amazigh qui domine la côte près de Tipasa." },
    ],
    guided: {
      summary: "Un guide conférencier vous fait revivre ces cités : qui y vivait, comment, et ce que les pierres racontent encore.",
      duration: "Tipasa : une demi-journée. Djémila ou Timgad : une à deux journées, avec nuit sur place",
      includes: [
        "Transport et chauffeur sur demande",
        "Explications sur place et temps libre pour flâner",
        "Déjeuner à proximité des sites, selon l’itinéraire",
      ],
    },
    solo: {
      summary: "Tipasa se fait facilement dans la journée depuis Alger ; Djémila et Timgad demandent plus d’organisation.",
      duration: "Une journée pour Tipasa, plusieurs jours pour l’Est",
      routeTitle: "Itinéraire conseillé",
      route: [
        "Tipasa : excursion d’une journée depuis Alger, à environ 70 km",
        "Cherchell : son musée et ses vestiges, un peu plus à l’ouest",
        "Djémila : à plusieurs heures de route, via Sétif",
        "Timgad : près de Batna, dans l’Est",
      ],
      tips: [
        "Pour Tipasa, prévoyez un transport privé ou un taxi pour la journée, à convenir à l’avance",
        "Pour Djémila et Timgad, prévoyez une nuit sur place (Sétif, Batna)",
        "Peu d’ombre sur les sites : chapeau, eau et crème solaire",
        "Visitez tôt le matin ou en fin de journée, quand la lumière est la plus belle",
      ],
    },
  },
  {
    slug: "sahara",
    title: "Le Sahara : Tassili, M’zab, Hoggar",
    tagline: "Le grand Sud, entre dunes, oasis et art rupestre",
    gradient: "from-orange-800 to-amber-300",
    intro: [
      "Le Sahara couvre la plus grande partie du territoire algérien. Ses paysages (mers de dunes, plateaux de grès, montagnes volcaniques) comptent parmi les plus spectaculaires du monde.",
      "Le Tassili n’Ajjer, près de Djanet, est classé par l’UNESCO (1982) pour ses peintures rupestres et ses étonnantes forêts de pierre. Le Hoggar, autour de Tamanrasset, offre des sommets volcaniques et des levers de soleil depuis l’Assekrem.",
      "Dans la vallée du M’zab, près de Ghardaïa, cinq villes fortifiées (les ksour), bâties autour de leurs mosquées, forment un modèle d’urbanisme communautaire, classé en 1982. Plus à l’ouest, Timimoun, « l’oasis rouge », et Taghit, au pied des grandes dunes, séduisent les voyageurs.",
      "Loin de toute lumière, les nuits y sont d’une clarté exceptionnelle : c’est aussi l’un des meilleurs endroits pour observer les étoiles.",
    ],
    why: "Parce que le Sahara change la façon de voir le monde : le silence, la lumière, le temps long. Quelques jours qui marquent pour longtemps.",
    highlights: [
      { title: "Tassili n’Ajjer (Djanet)", text: "Des milliers de peintures rupestres, au cœur d’un paysage de roche sculptée." },
      { title: "Le Hoggar et l’Assekrem", text: "Les montagnes de Tamanrasset et leurs levers de soleil." },
      { title: "La vallée du M’zab (Ghardaïa)", text: "Cinq ksour blottis autour de leurs mosquées, des palmeraies et un marché animé." },
      { title: "Timimoun", text: "« L’oasis rouge », ses ksour d’argile et ses palmeraies." },
      { title: "Taghit", text: "Un village au pied de dunes immenses, dans l’Ouest saharien." },
    ],
    guided: {
      summary: "Dans le grand Sud, un guide local est la règle : il connaît les pistes, les points d’eau et les traditions, et organise la logistique.",
      duration: "3 à 7 jours selon le circuit",
      includes: [
        "Selon le circuit : vols intérieurs depuis Alger vers Djanet, Tamanrasset ou Ghardaïa",
        "Guide local et véhicule tout-terrain",
        "Nuits sous tente ou en maison d’hôtes",
      ],
    },
    solo: {
      summary: "Dans le grand Sud, l’autonomie est limitée : mieux vaut un circuit organisé. La vallée du M’zab reste la plus accessible.",
      duration: "3 jours minimum pour le M’zab",
      routeTitle: "Pour commencer",
      route: [
        "Alger vers Ghardaïa en vol intérieur, environ 1 h 30",
        "Ghardaïa et Béni Isguen : les ksour, le marché, la palmeraie",
        "Hoggar et Tassili : à réserver avec une agence locale agréée",
      ],
      tips: [
        "Meilleure saison : d’octobre à avril, la chaleur est extrême en été",
        "Pour le Tassili et le Hoggar, passez par une agence locale agréée",
        "Prévoyez eau, protection solaire et vêtements chauds pour les nuits fraîches",
        "Respectez les usages locaux : tenue sobre, accord avant de photographier, silence dans les lieux religieux",
        "Renseignez-vous sur les conditions de voyage (formalités, sécurité) avant de partir",
      ],
    },
  },
  {
    slug: "traditions",
    title: "Artisanat, costumes et fêtes",
    tagline: "Des savoir-faire transmis de génération en génération",
    gradient: "from-rose-900 to-or",
    intro: [
      "L’artisanat algérien se lit dans les bijoux, la poterie, les tapis et les tissus. Chaque région a sa signature.",
      "En Kabylie, les bijoux d’argent, d’émail et de corail de Beni Yenni et la poterie de Maâtkas sont réputés. À Ghardaïa et à Tlemcen, on tisse des tapis ; à Alger, le karakou, veste de velours brodée de fils d’or, accompagne les grandes fêtes.",
      "La chedda de Tlemcen, somptueux costume nuptial, est inscrite depuis 2012 au patrimoine culturel immatériel de l’UNESCO.",
      "Les traditions vivent aussi à travers les fêtes : Yennayer, le nouvel an amazigh, célébré autour du 12 janvier ; la Sebeïba de Djanet, inscrite en 2014 ; les rites du Mawlid.",
    ],
    why: "Parce qu’un objet fait à la main raconte un visage, un village, une manière de vivre : c’est le souvenir le plus vrai à rapporter.",
    highlights: [
      { title: "Les bijoux kabyles", text: "Argent, émail et corail, aux motifs géométriques, travaillés notamment à Beni Yenni." },
      { title: "La poterie", text: "Des formes et des décors transmis de mère en fille, en Kabylie notamment." },
      { title: "Les tapis", text: "Ghardaïa et Tlemcen sont réputées pour leurs tapis tissés." },
      { title: "Karakou et chedda", text: "Deux costumes de fête : le karakou algérois et la chedda de Tlemcen." },
      { title: "Cuivre et argent", text: "L’art de la gravure sur métal, inscrit à l’UNESCO en 2023 sur une candidature commune de dix pays arabes." },
    ],
    guided: {
      summary: "Un guide vous mène chez des artisans, dans leurs ateliers, pour voir les gestes et comprendre les motifs.",
      duration: "2 à 3 heures",
      includes: [
        "Visite d’ateliers (bijoux, poterie, cuivre, tissage), selon les disponibilités",
        "Rencontre avec les artisans",
        "Conseils pour acheter : prix, qualité, authenticité",
      ],
    },
    solo: {
      summary: "Prenez le temps de comparer et de poser des questions : les artisans aiment expliquer leur travail.",
      duration: "Une demi-journée de flânerie",
      routeTitle: "Pour bien choisir",
      route: [
        "Commencez par un musée ou un centre d’artisanat pour voir des pièces de référence",
        "Comparez les pièces dans plusieurs boutiques et ateliers",
        "Rapportez un bijou kabyle, un tapis ou une poterie, avec la région d’origine",
      ],
      tips: [
        "Demandez l’origine de la pièce et la région de fabrication",
        "Dans les marchés, marchandez avec le sourire ; en boutique, les prix sont souvent fixes",
        "Pour un bijou en argent, demandez s’il est poinçonné",
        "Certains objets anciens ne peuvent pas quitter le pays sans autorisation : renseignez-vous avant d’acheter une antiquité",
      ],
    },
  },
];

export const getTheme = (slug: string | undefined) => themes.find((t) => t.slug === slug);

export const timeline: { when: string; what: string }[] = [
  { when: "Il y a des millénaires", what: "Peintures et gravures du Tassili n’Ajjer, dans un Sahara encore verdoyant" },
  { when: "IIIe-IIe s. av. J.-C.", what: "Royaumes amazighs de Numidie, dont celui de Massinissa" },
  { when: "Ier-Ve s.", what: "Cités romaines (Tipasa, Djémila, Timgad) ; Saint Augustin, évêque d’Hippone (354-430)" },
  { when: "VIIe s.", what: "Arrivée de l’islam au Maghreb" },
  { when: "VIIIe-XVIe s.", what: "Dynasties successives : Rostémides, Hammadides, Almoravides, Almohades, Zianides" },
  { when: "1516", what: "Alger devient le centre de la Régence ottomane" },
  { when: "1830", what: "Début de la colonisation française ; résistance de l’émir Abdelkader (1832-1847)" },
  { when: "1er novembre 1954", what: "Début de la guerre de libération" },
  { when: "5 juillet 1962", what: "Indépendance de l’Algérie" },
];

export const unescoSites: { name: string; year: number }[] = [
  { name: "Kalâa des Béni Hammad", year: 1980 },
  { name: "Djémila", year: 1982 },
  { name: "Vallée du M’zab", year: 1982 },
  { name: "Tassili n’Ajjer", year: 1982 },
  { name: "Timgad", year: 1982 },
  { name: "Tipasa", year: 1982 },
  { name: "La Casbah d’Alger", year: 1992 },
];
