export interface GrammarExercise {
  type: 'multiple-choice' | 'fill-in' | 'match';
  question: string;
  options?: string[];
  correctAnswer: string;
  pairs?: { left: string; right: string }[];
  explanation?: string;
}

export interface GrammarLesson {
  id: string;
  title: string;
  order: number;
  summary: string;
  sections: GrammarSection[];
  exercises?: GrammarExercise[];
}

export interface GrammarSection {
  heading: string;
  content: string;
  examples?: GrammarExample[];
  table?: GrammarTable;
}

export interface GrammarExample {
  hebrew: string;
  transliteration: string;
  dutch: string;
  explanation?: string;
}

export interface GrammarTable {
  headers: string[];
  rows: string[][];
}

export const grammarLessons: GrammarLesson[] = [
  {
    id: "lidwoord",
    title: "Het bepaald lidwoord",
    order: 1,
    summary: "Het Hebreeuws heeft alleen een bepaald lidwoord: הַ (ha). Het wordt als prefix aan het woord vastgeschreven.",
    sections: [
      {
        heading: "Basisregel",
        content: "Het bepaald lidwoord הַ wordt direct voor het zelfstandig naamwoord geschreven. Het bestaat uit de letter He (ה) met een patach (ַ) eronder, plus een dagesh (verdubbeling) in de eerste letter van het woord.",
        examples: [
          { hebrew: "מֶלֶךְ → הַמֶּלֶךְ", transliteration: "melekh → hammelekh", dutch: "koning → de koning", explanation: "Let op de dagesh in de מ." },
          { hebrew: "יוֹם → הַיּוֹם", transliteration: "yom → hayyom", dutch: "dag → de dag" },
          { hebrew: "דָּבָר → הַדָּבָר", transliteration: "davar → haddavar", dutch: "woord → het woord" },
        ],
      },
      {
        heading: "Uitzonderingen bij gutturalen",
        content: "Gutturale letters (א, ה, ח, ע, ר) accepteren geen dagesh. Daarom verandert de klinker van het lidwoord.",
        examples: [
          { hebrew: "אִישׁ → הָאִישׁ", transliteration: "'ish → ha'ish", dutch: "man → de man", explanation: "Bij א: qamats in plaats van patach." },
          { hebrew: "הַר → הָהָר", transliteration: "har → hahar", dutch: "berg → de berg" },
          { hebrew: "עַם → הָעָם", transliteration: "'am → ha'am", dutch: "volk → het volk" },
        ],
      },
      {
        heading: "Onbepaald",
        content: "Het Hebreeuws heeft geen onbepaald lidwoord ('een'). Een woord zonder הַ is automatisch onbepaald.",
        examples: [
          { hebrew: "מֶלֶךְ", transliteration: "melekh", dutch: "een koning" },
          { hebrew: "הַמֶּלֶךְ", transliteration: "hammelekh", dutch: "de koning" },
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Wat is het bepaald lidwoord in het Hebreeuws?',
        options: ['אֶת', 'הַ', 'לְ', 'בְּ'],
        correctAnswer: 'הַ',
        explanation: 'Het bepaald lidwoord in het Hebreeuws is הַ (ha). Het wordt als prefix aan het zelfstandig naamwoord geschreven.',
      },
      {
        type: 'multiple-choice',
        question: 'Hoe zeg je "de koning" in het Hebreeuws?',
        options: ['מֶלֶךְ', 'הַמֶּלֶךְ', 'לַמֶּלֶךְ', 'בַּמֶּלֶךְ'],
        correctAnswer: 'הַמֶּלֶךְ',
        explanation: 'מֶלֶךְ betekent "een koning". Met het lidwoord הַ wordt het הַמֶּלֶךְ (hammelekh) = "de koning". Let op de dagesh in de מ.',
      },
      {
        type: 'multiple-choice',
        question: 'Waarom verandert de klinker van הַ bij het woord אִישׁ (man)?',
        options: ['Omdat אִישׁ een vrouwelijk woord is', 'Omdat א een gutturale letter is die geen dagesh accepteert', 'Omdat het woord te kort is', 'Omdat het een eigennaam is'],
        correctAnswer: 'Omdat א een gutturale letter is die geen dagesh accepteert',
        explanation: 'Gutturale letters (א, ה, ח, ע, ר) accepteren geen dagesh. Daarom krijgt het lidwoord een qamats: הָאִישׁ in plaats van הַאִּישׁ.',
      },
      {
        type: 'multiple-choice',
        question: 'Wat betekent מֶלֶךְ (zonder lidwoord)?',
        options: ['de koning', 'een koning', 'koningen', 'het koninkrijk'],
        correctAnswer: 'een koning',
        explanation: 'Het Hebreeuws heeft geen onbepaald lidwoord. Een woord zonder הַ is automatisch onbepaald, dus מֶלֶךְ = "een koning".',
      },
      {
        type: 'multiple-choice',
        question: 'Welke vorm is correct voor "de berg"?',
        options: ['הַהַר', 'הָהָר', 'הֶהַר', 'הַרַר'],
        correctAnswer: 'הָהָר',
        explanation: 'הַר begint met de gutturale letter ה. Gutturalen accepteren geen dagesh, dus de klinker verandert: הָהָר (hahar).',
      },
    ],
  },
  {
    id: "geslacht-getal",
    title: "Geslacht en getal",
    order: 2,
    summary: "Hebreeuws kent mannelijk en vrouwelijk, enkelvoud en meervoud. De uitgangen geven het geslacht en getal aan.",
    sections: [
      {
        heading: "Geslacht herkennen",
        content: "De meeste vrouwelijke woorden eindigen op ָה- (ah) of ת- (t/et). Mannelijke woorden hebben meestal geen kenmerkende uitgang.",
        examples: [
          { hebrew: "מֶלֶךְ", transliteration: "melekh", dutch: "koning (m)", explanation: "Geen speciale uitgang → mannelijk." },
          { hebrew: "מַלְכָּה", transliteration: "malkah", dutch: "koningin (v)", explanation: "Uitgang ָה- → vrouwelijk." },
          { hebrew: "בְּרִית", transliteration: "berit", dutch: "verbond (v)", explanation: "Uitgang ת- → vrouwelijk." },
        ],
      },
      {
        heading: "Meervoud",
        content: "Mannelijk meervoud eindigt op ים- (im). Vrouwelijk meervoud eindigt op וֹת- (ot).",
        table: {
          headers: ["", "Enkelvoud", "Meervoud"],
          rows: [
            ["Mannelijk", "סוּס (sus) - paard", "סוּסִים (susim) - paarden"],
            ["Vrouwelijk", "תּוֹרָה (torah) - wet", "תּוֹרוֹת (torot) - wetten"],
          ],
        },
        examples: [
          { hebrew: "מֶלֶךְ → מְלָכִים", transliteration: "melekh → melakhim", dutch: "koning → koningen" },
          { hebrew: "שָׁנָה → שָׁנִים", transliteration: "shanah → shanim", dutch: "jaar → jaren", explanation: "Let op: vrouwelijk woord met mannelijke meervoudsuitgang!" },
        ],
      },
      {
        heading: "Tweevoud (dualis)",
        content: "Voor lichaamsdelen en tijdseenheden die in paren voorkomen: uitgang יִם- (ayim).",
        examples: [
          { hebrew: "יָד → יָדַיִם", transliteration: "yad → yadayim", dutch: "hand → twee handen" },
          { hebrew: "עַיִן → עֵינַיִם", transliteration: "'ayin → 'eynayim", dutch: "oog → twee ogen" },
          { hebrew: "יוֹם → יוֹמַיִם", transliteration: "yom → yomayim", dutch: "dag → twee dagen" },
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Welke uitgang is typisch voor vrouwelijke woorden in het Hebreeuws?',
        options: ['ִים-', 'ָה-', 'וּ-', 'ִי-'],
        correctAnswer: 'ָה-',
        explanation: 'De meeste vrouwelijke woorden eindigen op ָה- (ah) of ת- (t/et). Bijvoorbeeld: מַלְכָּה (malkah) = koningin.',
      },
      {
        type: 'multiple-choice',
        question: 'Wat is de mannelijke meervoudsuitgang?',
        options: ['וֹת-', 'ָה-', 'ִים-', 'ַיִם-'],
        correctAnswer: 'ִים-',
        explanation: 'Mannelijk meervoud eindigt op ִים- (im). Voorbeeld: סוּס → סוּסִים (paard → paarden).',
      },
      {
        type: 'multiple-choice',
        question: 'Wat is het meervoud van מֶלֶךְ (koning)?',
        options: ['מְלָכוֹת', 'מְלָכִים', 'מַלְכֵּי', 'מֶלֶכַיִם'],
        correctAnswer: 'מְלָכִים',
        explanation: 'מֶלֶךְ is mannelijk, dus het meervoud is מְלָכִים (melakhim) met de uitgang ִים-.',
      },
      {
        type: 'multiple-choice',
        question: 'Wat is bijzonder aan het woord שָׁנָה (jaar) in meervoud?',
        options: ['Het heeft geen meervoud', 'Het is vrouwelijk maar krijgt mannelijke meervoudsuitgang: שָׁנִים', 'Het wordt שָׁנוֹת', 'Het verandert niet'],
        correctAnswer: 'Het is vrouwelijk maar krijgt mannelijke meervoudsuitgang: שָׁנִים',
        explanation: 'שָׁנָה is vrouwelijk (uitgang ָה-), maar het meervoud is שָׁנִים met de mannelijke uitgang ִים-. Dit is een belangrijke uitzondering.',
      },
      {
        type: 'multiple-choice',
        question: 'Wanneer wordt de tweevoud (dualis) uitgang יִם- gebruikt?',
        options: ['Bij alle meervouden', 'Bij lichaamsdelen en tijdseenheden die in paren voorkomen', 'Alleen bij vrouwelijke woorden', 'Bij dieren'],
        correctAnswer: 'Bij lichaamsdelen en tijdseenheden die in paren voorkomen',
        explanation: 'De dualis (יִם-) wordt gebruikt voor lichaamsdelen en tijdseenheden die in paren voorkomen, zoals יָדַיִם (twee handen) en עֵינַיִם (twee ogen).',
      },
    ],
  },
  {
    id: "constructus",
    title: "Status constructus (סְמִיכוּת)",
    order: 3,
    summary: "De constructus-verbinding drukt bezit of relatie uit: 'woord van God', 'huis van de koning'. Het eerste woord verandert van vorm.",
    sections: [
      {
        heading: "Wat is constructus?",
        content: "In het Hebreeuws worden twee woorden direct aan elkaar gekoppeld om bezit of relatie uit te drukken. Het eerste woord (nomen regens) staat in de verkorte 'constructus' vorm. Het tweede woord (nomen rectum) staat in de gewone (absolutus) vorm.",
        examples: [
          { hebrew: "דְּבַר יְהוָה", transliteration: "devar YHWH", dutch: "het woord van de HEER", explanation: "דָּבָר wordt דְּבַר in constructus." },
          { hebrew: "בֵּית הַמֶּלֶךְ", transliteration: "bet hammelekh", dutch: "het huis van de koning", explanation: "בַּיִת wordt בֵּית in constructus." },
          { hebrew: "תּוֹרַת מֹשֶׁה", transliteration: "torat Moshe", dutch: "de wet van Mozes", explanation: "תּוֹרָה wordt תּוֹרַת in constructus." },
        ],
      },
      {
        heading: "Regels",
        content: "1. Het lidwoord הַ komt NOOIT op het eerste woord (nomen regens).\n2. Het eerste woord verliest vaak klinkers (wordt korter).\n3. Als het tweede woord bepaald is, is de hele verbinding bepaald.",
        examples: [
          { hebrew: "בֵּית אִישׁ", transliteration: "bet 'ish", dutch: "een huis van een man" },
          { hebrew: "בֵּית הָאִישׁ", transliteration: "bet ha'ish", dutch: "het huis van de man", explanation: "הָאִישׁ is bepaald → hele verbinding is bepaald." },
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Wat drukt de status constructus uit?',
        options: ['Een bevel', 'Bezit of relatie tussen twee woorden', 'Een vraag', 'Verleden tijd'],
        correctAnswer: 'Bezit of relatie tussen twee woorden',
        explanation: 'De constructus-verbinding koppelt twee woorden om bezit of relatie uit te drukken, zoals "huis van de koning" (בֵּית הַמֶּלֶךְ).',
      },
      {
        type: 'multiple-choice',
        question: 'Wat is de constructusvorm van בַּיִת (huis)?',
        options: ['בַּיִת', 'בֵּית', 'הַבַּיִת', 'בָּתִּים'],
        correctAnswer: 'בֵּית',
        explanation: 'In constructus wordt בַּיִת verkort tot בֵּית. Het eerste woord (nomen regens) verliest vaak klinkers.',
      },
      {
        type: 'multiple-choice',
        question: 'Waar komt het lidwoord הַ in een constructus-verbinding?',
        options: ['Op het eerste woord', 'Op het tweede woord', 'Op beide woorden', 'Het lidwoord wordt nooit gebruikt'],
        correctAnswer: 'Op het tweede woord',
        explanation: 'Het lidwoord הַ komt NOOIT op het eerste woord (nomen regens). Het kan alleen op het tweede woord (nomen rectum) staan.',
      },
      {
        type: 'multiple-choice',
        question: 'Wat betekent דְּבַר יְהוָה?',
        options: ['de koning van God', 'het huis van de HEER', 'het woord van de HEER', 'de wet van Mozes'],
        correctAnswer: 'het woord van de HEER',
        explanation: 'דְּבַר is de constructusvorm van דָּבָר (woord), en יְהוָה is de naam van God (HEER). Samen: "het woord van de HEER".',
      },
    ],
  },
  {
    id: "voorzetsels",
    title: "Voorzetsels en suffixen",
    order: 4,
    summary: "Voorzetsels worden vaak als prefix geschreven. Persoonlijke voornaamwoorden worden als suffixen aan woorden gehecht.",
    sections: [
      {
        heading: "Prefix-voorzetsels",
        content: "De drie meest voorkomende voorzetsels worden direct aan het woord geplakt: בְּ (in/met), לְ (naar/voor), כְּ (als/zoals).",
        examples: [
          { hebrew: "בְּבַיִת", transliteration: "bevayit", dutch: "in een huis" },
          { hebrew: "לַמֶּלֶךְ", transliteration: "lammelekh", dutch: "aan de koning", explanation: "לְ + הַמֶּלֶךְ → לַמֶּלֶךְ (het lidwoord wordt geabsorbeerd)." },
          { hebrew: "כַּיּוֹם", transliteration: "kayyom", dutch: "als de dag / op deze dag" },
        ],
      },
      {
        heading: "Persoonlijke suffixen bij voorzetsels",
        content: "Voornaamwoorden worden als suffixen aan voorzetsels gehecht.",
        table: {
          headers: ["Persoon", "Suffix", "Voorbeeld met לְ", "Betekenis"],
          rows: [
            ["1e enk.", "ִי-", "לִי", "aan mij"],
            ["2e enk. m.", "ְךָ-", "לְךָ", "aan jou (m)"],
            ["2e enk. v.", "ְךְ-", "לָךְ", "aan jou (v)"],
            ["3e enk. m.", "וֹ-", "לוֹ", "aan hem"],
            ["3e enk. v.", "ָהּ-", "לָהּ", "aan haar"],
            ["1e mv.", "ָנוּ-", "לָנוּ", "aan ons"],
            ["2e mv. m.", "ְכֶם-", "לָכֶם", "aan jullie (m)"],
            ["3e mv. m.", "ָם- / ָהֶם-", "לָהֶם", "aan hen (m)"],
          ],
        },
      },
      {
        heading: "Bezittelijke suffixen bij naamwoorden",
        content: "Dezelfde suffixen worden gebruikt om bezit aan te geven bij zelfstandige naamwoorden.",
        examples: [
          { hebrew: "סוּסִי", transliteration: "susi", dutch: "mijn paard" },
          { hebrew: "סוּסְךָ", transliteration: "suskha", dutch: "jouw paard (m)" },
          { hebrew: "סוּסוֹ", transliteration: "suso", dutch: "zijn paard" },
          { hebrew: "דְּבָרִי", transliteration: "devari", dutch: "mijn woord" },
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Welke drie voorzetsels worden als prefix aan het woord geplakt?',
        options: ['אֶת, עַל, מִן', 'בְּ, לְ, כְּ', 'הַ, וְ, שֶׁ', 'אֶל, עַד, בֵּין'],
        correctAnswer: 'בְּ, לְ, כְּ',
        explanation: 'De drie prefix-voorzetsels zijn: בְּ (in/met), לְ (naar/voor), כְּ (als/zoals). Ze worden direct aan het woord geschreven.',
      },
      {
        type: 'multiple-choice',
        question: 'Wat gebeurt er als לְ gecombineerd wordt met הַמֶּלֶךְ (de koning)?',
        options: ['לְהַמֶּלֶךְ', 'לַמֶּלֶךְ', 'לוֹמֶלֶךְ', 'לְמֶלֶךְ'],
        correctAnswer: 'לַמֶּלֶךְ',
        explanation: 'Als een prefix-voorzetsel gecombineerd wordt met een woord met het lidwoord, wordt het lidwoord geabsorbeerd: לְ + הַמֶּלֶךְ → לַמֶּלֶךְ.',
      },
      {
        type: 'multiple-choice',
        question: 'Wat betekent het suffix וֹ- aan een werkwoord of voorzetsel?',
        options: ['mijn', 'jouw (m)', 'zijn', 'haar'],
        correctAnswer: 'zijn',
        explanation: 'Het suffix וֹ- verwijst naar de 3e persoon mannelijk enkelvoud (zijn/hem). Voorbeeld: סוּסוֹ = zijn paard.',
      },
      {
        type: 'multiple-choice',
        question: 'Hoe zeg je "aan ons" met het voorzetsel לְ?',
        options: ['לִי', 'לְךָ', 'לָנוּ', 'לָהֶם'],
        correctAnswer: 'לָנוּ',
        explanation: 'Het suffix ָנוּ- is de 1e persoon meervoud. לְ + suffix ָנוּ = לָנוּ (aan ons).',
      },
      {
        type: 'multiple-choice',
        question: 'Wat betekent סוּסִי?',
        options: ['een paard', 'het paard', 'mijn paard', 'zijn paard'],
        correctAnswer: 'mijn paard',
        explanation: 'Het suffix ִי- is de 1e persoon enkelvoud (mijn). סוּס + ִי = סוּסִי (mijn paard).',
      },
    ],
  },
  {
    id: "werkwoord-intro",
    title: "Werkwoorden: Inleiding",
    order: 5,
    summary: "Hebreeuwse werkwoorden zijn gebaseerd op een drieletter-wortel. De Pa'al (Qal) stam is de basisstam.",
    sections: [
      {
        heading: "De drieletter-wortel",
        content: "Bijna alle Hebreeuwse werkwoorden zijn gebaseerd op een wortel van drie medeklinkers. Door klinkers en voor-/achtervoegsels toe te voegen, ontstaan verschillende vormen en betekenissen.",
        examples: [
          { hebrew: "מ-ל-כ", transliteration: "m-l-kh", dutch: "wortel voor 'regeren/koning'", explanation: "מֶלֶךְ (koning), מָלַךְ (hij regeerde), מַלְכָּה (koningin), מַמְלָכָה (koninkrijk)" },
          { hebrew: "כ-ת-ב", transliteration: "k-t-v", dutch: "wortel voor 'schrijven'", explanation: "כָּתַב (hij schreef), כְּתָב (geschrift), מִכְתָּב (brief)" },
          { hebrew: "ש-מ-ר", transliteration: "sh-m-r", dutch: "wortel voor 'bewaken'", explanation: "שָׁמַר (hij bewaakte), מִשְׁמָר (wacht), שֹׁמֵר (bewaker)" },
        ],
      },
      {
        heading: "De zeven stammen (binyanim)",
        content: "Er zijn zeven werkwoordsstammen die elk een ander aspect van de betekenis uitdrukken.",
        table: {
          headers: ["Stam", "Hebreeuws", "Functie", "Voorbeeld (wortel פ-ק-ד)"],
          rows: [
            ["Pa'al (Qal)", "פָּעַל / קַל", "Basis actief", "פָּקַד - hij bezocht"],
            ["Nif'al", "נִפְעַל", "Passief / reflexief", "נִפְקַד - hij werd bezocht"],
            ["Pi'el", "פִּעֵל", "Intensief actief", "פִּקֵּד - hij beval"],
            ["Pu'al", "פֻּעַל", "Intensief passief", "פֻּקַּד - hij werd bevolen"],
            ["Hif'il", "הִפְעִיל", "Causatief actief", "הִפְקִיד - hij stelde aan"],
            ["Hof'al", "הֻפְעַל", "Causatief passief", "הֻפְקַד - hij werd aangesteld"],
            ["Hitpa'el", "הִתְפַּעֵל", "Reflexief", "הִתְפַּקֵּד - hij monsterde zich"],
          ],
        },
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Waarop zijn bijna alle Hebreeuwse werkwoorden gebaseerd?',
        options: ['Een tweeletter-wortel', 'Een drieletter-wortel', 'Een vierletter-wortel', 'Een prefix'],
        correctAnswer: 'Een drieletter-wortel',
        explanation: 'Bijna alle Hebreeuwse werkwoorden zijn gebaseerd op een wortel van drie medeklinkers. Door klinkers en voor-/achtervoegsels toe te voegen ontstaan verschillende vormen.',
      },
      {
        type: 'multiple-choice',
        question: 'Hoeveel werkwoordsstammen (binyanim) heeft het Hebreeuws?',
        options: ['3', '5', '7', '10'],
        correctAnswer: '7',
        explanation: 'Het Hebreeuws heeft zeven werkwoordsstammen: Pa\'al (Qal), Nif\'al, Pi\'el, Pu\'al, Hif\'il, Hof\'al en Hitpa\'el.',
      },
      {
        type: 'multiple-choice',
        question: 'Welke stam is de basisstam (actief)?',
        options: ['Nif\'al', 'Pi\'el', 'Pa\'al (Qal)', 'Hif\'il'],
        correctAnswer: 'Pa\'al (Qal)',
        explanation: 'De Pa\'al of Qal stam is de basisstam en drukt de eenvoudige actieve betekenis uit.',
      },
      {
        type: 'multiple-choice',
        question: 'Welke woorden komen allemaal van de wortel מ-ל-כ?',
        options: ['מֶלֶךְ, מָלַךְ, מַלְכָּה', 'כָּתַב, מִכְתָּב, כְּתָב', 'שָׁמַר, שֹׁמֵר, מִשְׁמָר', 'דָּבָר, דִּבֵּר, מִדְבָּר'],
        correctAnswer: 'מֶלֶךְ, מָלַךְ, מַלְכָּה',
        explanation: 'מֶלֶךְ (koning), מָלַךְ (hij regeerde), מַלְכָּה (koningin) delen allemaal de wortel מ-ל-כ (regeren/koning).',
      },
    ],
  },
  {
    id: "perfectum",
    title: "Perfectum (voltooide tijd)",
    order: 6,
    summary: "Het perfectum drukt een voltooide handeling uit. Persoonssuffixen worden aan de stam toegevoegd.",
    sections: [
      {
        heading: "Vorming",
        content: "Het perfectum wordt gevormd door suffixen aan de werkwoordsstam toe te voegen. Het drukt een voltooide handeling uit (vergelijkbaar met verleden tijd).",
        table: {
          headers: ["Persoon", "Suffix", "שָׁמַר (bewaken)", "Vertaling"],
          rows: [
            ["3e m. enk.", "(geen)", "שָׁמַר", "hij bewaakte"],
            ["3e v. enk.", "ָה-", "שָׁמְרָה", "zij bewaakte"],
            ["2e m. enk.", "ְתָּ-", "שָׁמַרְתָּ", "jij bewaakte (m)"],
            ["2e v. enk.", "ְתְּ-", "שָׁמַרְתְּ", "jij bewaakte (v)"],
            ["1e enk.", "ְתִּי-", "שָׁמַרְתִּי", "ik bewaakte"],
            ["3e mv.", "וּ-", "שָׁמְרוּ", "zij bewaakten"],
            ["2e m. mv.", "ְתֶּם-", "שְׁמַרְתֶּם", "jullie bewaakten (m)"],
            ["1e mv.", "ְנוּ-", "שָׁמַרְנוּ", "wij bewaakten"],
          ],
        },
      },
      {
        heading: "Voorbeelden in context",
        content: "Het perfectum komt vaak voor in verhalende teksten om voltooide handelingen te beschrijven.",
        examples: [
          { hebrew: "בָּרָא אֱלֹהִים", transliteration: "bara' 'elohim", dutch: "God schiep", explanation: "Genesis 1:1 - perfectum van בָּרָא." },
          { hebrew: "אָמַר יְהוָה", transliteration: "'amar YHWH", dutch: "de HEER zei", explanation: "Perfectum van אָמַר." },
          { hebrew: "שָׁמַעְתִּי אֶת־קוֹלְךָ", transliteration: "shama'ti 'et-qolkha", dutch: "ik hoorde uw stem", explanation: "1e persoon perfectum + suffix." },
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Wat drukt het perfectum uit?',
        options: ['Een toekomstige handeling', 'Een voltooide handeling', 'Een bevel', 'Een wens'],
        correctAnswer: 'Een voltooide handeling',
        explanation: 'Het perfectum drukt een voltooide handeling uit, vergelijkbaar met de verleden tijd in het Nederlands.',
      },
      {
        type: 'multiple-choice',
        question: 'Hoe wordt het perfectum gevormd?',
        options: ['Door prefixen aan de stam toe te voegen', 'Door suffixen aan de stam toe te voegen', 'Door het werkwoord te verdubbelen', 'Door een hulpwerkwoord toe te voegen'],
        correctAnswer: 'Door suffixen aan de stam toe te voegen',
        explanation: 'Het perfectum gebruikt suffixen (achtervoegsels) om persoon en getal aan te geven.',
      },
      {
        type: 'multiple-choice',
        question: 'Wat is de 1e persoon enkelvoud van שָׁמַר (bewaken)?',
        options: ['שָׁמַר', 'שָׁמְרָה', 'שָׁמַרְתִּי', 'שָׁמְרוּ'],
        correctAnswer: 'שָׁמַרְתִּי',
        explanation: 'De 1e persoon enkelvoud perfectum heeft het suffix ְתִּי-. Dus שָׁמַר + תִּי = שָׁמַרְתִּי (ik bewaakte).',
      },
      {
        type: 'multiple-choice',
        question: 'Welke vorm is de 3e persoon mannelijk enkelvoud perfectum?',
        options: ['De vorm met suffix ָה-', 'De basisvorm zonder suffix', 'De vorm met prefix יִ-', 'De vorm met suffix וּ-'],
        correctAnswer: 'De basisvorm zonder suffix',
        explanation: 'De 3e persoon mannelijk enkelvoud perfectum is de basisvorm van het werkwoord, zonder suffix: שָׁמַר = hij bewaakte.',
      },
      {
        type: 'multiple-choice',
        question: 'Wat betekent בָּרָא אֱלֹהִים in Genesis 1:1?',
        options: ['God zal scheppen', 'God schept', 'God schiep', 'God had geschapen'],
        correctAnswer: 'God schiep',
        explanation: 'בָּרָא is het perfectum van het werkwoord "scheppen". Het perfectum duidt hier een voltooide handeling aan: "God schiep".',
      },
    ],
  },
  {
    id: "imperfectum",
    title: "Imperfectum (onvoltooide tijd)",
    order: 7,
    summary: "Het imperfectum drukt onvoltooide of toekomstige handelingen uit. Prefixen en suffixen geven de persoon aan.",
    sections: [
      {
        heading: "Vorming",
        content: "Het imperfectum gebruikt prefixen (en soms ook suffixen) om persoon en getal aan te geven.",
        table: {
          headers: ["Persoon", "Prefix", "שָׁמַר (bewaken)", "Vertaling"],
          rows: [
            ["3e m. enk.", "יִ-", "יִשְׁמֹר", "hij zal bewaken"],
            ["3e v. enk.", "תִּ-", "תִּשְׁמֹר", "zij zal bewaken"],
            ["2e m. enk.", "תִּ-", "תִּשְׁמֹר", "jij zult bewaken (m)"],
            ["2e v. enk.", "תִּ-...-ִי", "תִּשְׁמְרִי", "jij zult bewaken (v)"],
            ["1e enk.", "אֶ-", "אֶשְׁמֹר", "ik zal bewaken"],
            ["3e m. mv.", "יִ-...-וּ", "יִשְׁמְרוּ", "zij zullen bewaken (m)"],
            ["3e v. mv.", "תִּ-...-ְנָה", "תִּשְׁמֹרְנָה", "zij zullen bewaken (v)"],
            ["2e m. mv.", "תִּ-...-וּ", "תִּשְׁמְרוּ", "jullie zullen bewaken (m)"],
            ["1e mv.", "נִ-", "נִשְׁמֹר", "wij zullen bewaken"],
          ],
        },
      },
      {
        heading: "Gebruik",
        content: "Het imperfectum drukt uit: toekomst, herhaling, wens, mogelijkheid, of een onvoltooide handeling in het verleden (met waw-consecutivum).",
        examples: [
          { hebrew: "יִשְׁמֹר יְהוָה אוֹתְךָ", transliteration: "yishmor YHWH 'otkha", dutch: "de HEER zal u bewaren" },
          { hebrew: "לֹא תִּרְצָח", transliteration: "lo' tirtsach", dutch: "gij zult niet doodslaan", explanation: "Gebod: imperfectum met לֹא." },
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Hoe wordt het imperfectum gevormd?',
        options: ['Met suffixen aan de stam', 'Met prefixen (en soms suffixen)', 'Zonder aanpassingen', 'Met een hulpwerkwoord'],
        correctAnswer: 'Met prefixen (en soms suffixen)',
        explanation: 'Het imperfectum gebruikt prefixen om persoon en getal aan te geven. Sommige vormen hebben ook suffixen.',
      },
      {
        type: 'multiple-choice',
        question: 'Welk prefix hoort bij de 3e persoon mannelijk enkelvoud imperfectum?',
        options: ['אֶ-', 'תִּ-', 'יִ-', 'נִ-'],
        correctAnswer: 'יִ-',
        explanation: 'De 3e persoon mannelijk enkelvoud imperfectum heeft het prefix יִ-. Voorbeeld: יִשְׁמֹר = hij zal bewaken.',
      },
      {
        type: 'multiple-choice',
        question: 'Wat betekent לֹא תִּרְצָח?',
        options: ['Hij zal niet doden', 'Gij zult niet doodslaan', 'Ik zal niet doden', 'Zij zullen niet doden'],
        correctAnswer: 'Gij zult niet doodslaan',
        explanation: 'לֹא + imperfectum drukt een permanent verbod uit. תִּרְצָח heeft prefix תִּ- (2e persoon): "gij zult niet doodslaan".',
      },
      {
        type: 'multiple-choice',
        question: 'Welk prefix hoort bij de 1e persoon enkelvoud imperfectum?',
        options: ['יִ-', 'תִּ-', 'נִ-', 'אֶ-'],
        correctAnswer: 'אֶ-',
        explanation: 'De 1e persoon enkelvoud imperfectum heeft het prefix אֶ-. Voorbeeld: אֶשְׁמֹר = ik zal bewaken.',
      },
      {
        type: 'multiple-choice',
        question: 'Welke betekenissen kan het imperfectum uitdrukken?',
        options: ['Alleen toekomst', 'Alleen verleden tijd', 'Toekomst, herhaling, wens, mogelijkheid', 'Alleen geboden'],
        correctAnswer: 'Toekomst, herhaling, wens, mogelijkheid',
        explanation: 'Het imperfectum is veelzijdig: het drukt toekomst, herhaling, wens, mogelijkheid of onvoltooide handeling uit.',
      },
    ],
  },
  {
    id: "waw-consecutivum",
    title: "Waw-consecutivum",
    order: 8,
    summary: "De waw-consecutivum keert de tijdswaarde van een werkwoord om. Essentieel voor Bijbels Hebreeuws narratief.",
    sections: [
      {
        heading: "Waw-consecutivum met imperfectum (wayyiqtol)",
        content: "וַיִּ- (wayyi-) voor het imperfectum verandert de betekenis naar verleden tijd. Dit is de standaard verhalende vorm in de Bijbel.",
        examples: [
          { hebrew: "וַיֹּאמֶר אֱלֹהִים", transliteration: "wayyomer 'elohim", dutch: "en God zei", explanation: "וַ + יֹאמֶר → verleden tijd narratief." },
          { hebrew: "וַיְהִי אוֹר", transliteration: "wayhi 'or", dutch: "en er was licht", explanation: "Genesis 1:3" },
          { hebrew: "וַיַּרְא אֱלֹהִים", transliteration: "wayyar' 'elohim", dutch: "en God zag", explanation: "Genesis 1:4" },
        ],
      },
      {
        heading: "Waw-consecutivum met perfectum (weqatal)",
        content: "וְ + perfectum geeft toekomstige of herhaalde betekenis. Komt voor in beloften, wetten en instructies.",
        examples: [
          { hebrew: "וְשָׁמַרְתָּ", transliteration: "weshamarta", dutch: "en jij zult bewaren", explanation: "Perfectum + waw → toekomstige betekenis." },
          { hebrew: "וְאָהַבְתָּ אֵת יְהוָה אֱלֹהֶיךָ", transliteration: "we'ahavta 'et YHWH 'elohekha", dutch: "en gij zult de HEER uw God liefhebben", explanation: "Deuteronomium 6:5" },
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Wat doet de waw-consecutivum?',
        options: ['Het verbindt twee zinnen', 'Het keert de tijdswaarde van een werkwoord om', 'Het maakt een werkwoord passief', 'Het versterkt het werkwoord'],
        correctAnswer: 'Het keert de tijdswaarde van een werkwoord om',
        explanation: 'De waw-consecutivum keert de tijdswaarde om: imperfectum wordt verleden tijd (wayyiqtol), perfectum wordt toekomst (weqatal).',
      },
      {
        type: 'multiple-choice',
        question: 'Wat is de standaard verhalende vorm in de Bijbel?',
        options: ['Perfectum', 'Imperfectum', 'Wayyiqtol (waw-consecutivum + imperfectum)', 'Participium'],
        correctAnswer: 'Wayyiqtol (waw-consecutivum + imperfectum)',
        explanation: 'De wayyiqtol-vorm (וַיִּ- + imperfectum) is de standaard narratieve vorm. Het drukt verleden tijd uit in verhalen.',
      },
      {
        type: 'multiple-choice',
        question: 'Wat betekent וַיֹּאמֶר אֱלֹהִים?',
        options: ['En God zal zeggen', 'En God zei', 'God spreekt', 'God had gezegd'],
        correctAnswer: 'En God zei',
        explanation: 'וַיֹּאמֶר is wayyiqtol van אמר. De waw-consecutivum + imperfectum geeft verleden tijd: "en God zei".',
      },
      {
        type: 'multiple-choice',
        question: 'Wat drukt וְ + perfectum (weqatal) uit?',
        options: ['Verleden tijd', 'Toekomstige of herhaalde betekenis', 'Een vraag', 'Een ontkenning'],
        correctAnswer: 'Toekomstige of herhaalde betekenis',
        explanation: 'וְ + perfectum (weqatal) geeft toekomstige of herhaalde betekenis. Het komt voor in beloften, wetten en instructies.',
      },
      {
        type: 'multiple-choice',
        question: 'In welk Bijbelvers komt וַיְהִי אוֹר voor?',
        options: ['Genesis 1:1', 'Genesis 1:3', 'Genesis 2:1', 'Exodus 1:1'],
        correctAnswer: 'Genesis 1:3',
        explanation: 'וַיְהִי אוֹר ("en er was licht") staat in Genesis 1:3. Het is een wayyiqtol-vorm van היה.',
      },
    ],
  },
  // === NIEUWE LESSEN (9-20) ===
  {
    id: "participium",
    title: "Participium (deelwoord)",
    order: 9,
    summary: "Het participium (deelwoord) functioneert als werkwoord, bijvoeglijk naamwoord of zelfstandig naamwoord. Qal kent een actief en passief participium.",
    sections: [
      {
        heading: "Actief participium Qal",
        content: "Het actief participium Qal heeft het patroon קֹטֵל (qotel) voor mannelijk enkelvoud. Het drukt een voortdurende handeling uit of beschrijft iemand die een handeling uitvoert. Het kan functioneren als werkwoord (tegenwoordige tijd), bijvoeglijk naamwoord of zelfstandig naamwoord.",
        table: {
          headers: ["Vorm", "Patroon", "Voorbeeld (שׁמר)", "Betekenis"],
          rows: [
            ["m. enk.", "קֹטֵל", "שֹׁמֵר", "bewakend / bewaker"],
            ["v. enk.", "קֹטֶלֶת / קֹטְלָה", "שֹׁמֶרֶת / שֹׁמְרָה", "bewakende / bewakster"],
            ["m. mv.", "קֹטְלִים", "שֹׁמְרִים", "bewakenden / bewakers"],
            ["v. mv.", "קֹטְלוֹת", "שֹׁמְרוֹת", "bewakenden (v)"],
          ],
        },
        examples: [
          { hebrew: "שֹׁמֵר יִשְׂרָאֵל", transliteration: "shomer yisra'el", dutch: "de Bewaker van Israel", explanation: "Psalm 121:4 - participium als zelfstandig naamwoord (titel van God)." },
          { hebrew: "הָאִישׁ כֹּתֵב סֵפֶר", transliteration: "ha'ish kotev sefer", dutch: "de man schrijft een boek", explanation: "Participium als tegenwoordige tijd." },
          { hebrew: "רֹעֶה יִשְׂרָאֵל", transliteration: "ro'eh yisra'el", dutch: "Herder van Israel", explanation: "Psalm 80:2 - participium van רעה als titel." },
        ],
      },
      {
        heading: "Passief participium Qal",
        content: "Het passief participium Qal heeft het patroon קָטוּל (qatul). Het drukt een toestand uit die het resultaat is van een handeling.",
        table: {
          headers: ["Vorm", "Patroon", "Voorbeeld (כתב)", "Betekenis"],
          rows: [
            ["m. enk.", "קָטוּל", "כָּתוּב", "geschreven"],
            ["v. enk.", "קְטוּלָה", "כְּתוּבָה", "geschreven (v)"],
            ["m. mv.", "קְטוּלִים", "כְּתוּבִים", "geschreven (mv)"],
            ["v. mv.", "קְטוּלוֹת", "כְּתוּבוֹת", "geschreven (v mv)"],
          ],
        },
        examples: [
          { hebrew: "בָּרוּךְ אַתָּה", transliteration: "barukh 'attah", dutch: "gezegend zijt gij", explanation: "Passief participium van ברך - veelgebruikt in zegeningen." },
          { hebrew: "אָרוּר הָאֲדָמָה", transliteration: "'arur ha'adamah", dutch: "vervloekt is de aardbodem", explanation: "Genesis 3:17 - passief participium van ארר." },
          { hebrew: "כָּתוּב בְּסֵפֶר הַתּוֹרָה", transliteration: "katuv besefer hattorah", dutch: "geschreven in het boek van de wet", explanation: "Passief participium als bijvoeglijk naamwoord." },
        ],
      },
      {
        heading: "Gebruik als bijvoeglijk naamwoord",
        content: "Wanneer het participium als bijvoeglijk naamwoord functioneert, volgt het de normale regels: het staat NA het zelfstandig naamwoord en stemt overeen in geslacht, getal en bepaaldheid.",
        examples: [
          { hebrew: "הָאִישׁ הַכֹּתֵב", transliteration: "ha'ish hakkotev", dutch: "de schrijvende man", explanation: "Beide woorden hebben het lidwoord (bijvoeglijke functie)." },
          { hebrew: "הַדְּבָרִים הַכְּתוּבִים", transliteration: "haddevarim hakketuvim", dutch: "de geschreven woorden", explanation: "Passief participium als bijvoeglijk naamwoord, meervoud." },
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Wat is het patroon van het actief participium Qal (mannelijk enkelvoud)?',
        options: ['קָטוּל (qatul)', 'קֹטֵל (qotel)', 'קְטֹל (qetol)', 'קִטֵּל (qittel)'],
        correctAnswer: 'קֹטֵל (qotel)',
        explanation: 'Het actief participium Qal heeft het patroon קֹטֵל (qotel). Voorbeeld: שֹׁמֵר (bewakend/bewaker).',
      },
      {
        type: 'multiple-choice',
        question: 'Wat betekent בָּרוּךְ אַתָּה?',
        options: ['Jij zegent', 'Gezegend zijt gij', 'Jij werd gezegend', 'Zegen mij'],
        correctAnswer: 'Gezegend zijt gij',
        explanation: 'בָּרוּךְ is een passief participium (patroon קָטוּל) van ברך. Het drukt een toestand uit: "gezegend".',
      },
      {
        type: 'multiple-choice',
        question: 'Hoe functioneert het participium als bijvoeglijk naamwoord?',
        options: ['Het staat VOOR het zelfstandig naamwoord zonder lidwoord', 'Het staat NA het zelfstandig naamwoord en stemt overeen in geslacht, getal en bepaaldheid', 'Het staat altijd aan het begin van de zin', 'Het krijgt een speciaal prefix'],
        correctAnswer: 'Het staat NA het zelfstandig naamwoord en stemt overeen in geslacht, getal en bepaaldheid',
        explanation: 'Als bijvoeglijk naamwoord staat het participium NA het zelfstandig naamwoord en stemt het overeen in geslacht, getal en bepaaldheid: הָאִישׁ הַכֹּתֵב (de schrijvende man).',
      },
    ],
  },
  {
    id: "infinitief",
    title: "Infinitief",
    order: 10,
    summary: "Het Hebreeuws kent twee infinitiefvormen: de infinitivus constructus (verbonden vorm) en de infinitivus absolutus. Beide hebben verschillende functies.",
    sections: [
      {
        heading: "Infinitivus constructus",
        content: "De infinitivus constructus is de meest gebruikte infinitief. In Qal heeft hij het patroon קְטֹל (qetol) of soms קְטָל (qetal). Hij functioneert als een verbaal naamwoord en wordt vaak gecombineerd met voorzetsels.",
        examples: [
          { hebrew: "לִשְׁמֹר", transliteration: "lishmor", dutch: "om te bewaken / bewaken", explanation: "לְ + infinitivus constructus = 'om te...' (meest voorkomende combinatie)." },
          { hebrew: "לִכְתֹּב", transliteration: "likhtov", dutch: "om te schrijven" },
          { hebrew: "לָלֶכֶת", transliteration: "lalekhet", dutch: "om te gaan", explanation: "Onregelmatige vorm van הלך." },
        ],
      },
      {
        heading: "Infinitivus constructus met voorzetsels",
        content: "De infinitivus constructus wordt vaak gecombineerd met voorzetsels, waardoor hij als bijzin functioneert. Dit is een van de belangrijkste constructies in Bijbels Hebreeuws.",
        table: {
          headers: ["Voorzetsel + Inf.", "Betekenis", "Voorbeeld"],
          rows: [
            ["לְ + inf.", "om te...; doel", "לִשְׁמֹר אֶת־הַדֶּרֶךְ (om de weg te bewaken)"],
            ["בְּ + inf.", "toen...; terwijl...", "בְּשָׁמְעוֹ (toen hij hoorde)"],
            ["כְּ + inf.", "zoals...; toen...", "כִּשְׁמֹעַ הַמֶּלֶךְ (toen de koning hoorde)"],
            ["אַחֲרֵי + inf.", "nadat...", "אַחֲרֵי שָׁמְעוֹ (nadat hij hoorde)"],
            ["לִפְנֵי + inf.", "voordat...", "לִפְנֵי בוֹא הַשֶּׁמֶשׁ (voordat de zon kwam)"],
          ],
        },
        examples: [
          { hebrew: "בִּבְרֹא אֱלֹהִים", transliteration: "bivro' 'elohim", dutch: "toen God schiep", explanation: "Genesis 2:4 - בְּ + infinitivus constructus van ברא." },
          { hebrew: "לֵאמֹר", transliteration: "le'mor", dutch: "zeggende / om te zeggen", explanation: "Zeer veelvoorkomend, introduceert directe rede." },
        ],
      },
      {
        heading: "Infinitivus constructus met suffixen",
        content: "De infinitivus constructus kan persoonlijke suffixen aannemen. Het suffix geeft het subject of het object aan van de infinitief.",
        examples: [
          { hebrew: "שָׁמְרִי", transliteration: "shomri", dutch: "mijn bewaken / dat ik bewaak", explanation: "Suffix als subject: 'ik' bewaak." },
          { hebrew: "שָׁמְרוֹ", transliteration: "shomro", dutch: "zijn bewaken / dat hij bewaakte", explanation: "Suffix als subject: 'hij' bewaakte." },
          { hebrew: "בְּשָׁמְעָם", transliteration: "beshom'am", dutch: "toen zij hoorden", explanation: "בְּ + inf. constructus + suffix 3e mv." },
        ],
      },
      {
        heading: "Infinitivus absolutus",
        content: "De infinitivus absolutus heeft in Qal het patroon קָטוֹל (qatol). Hij wordt NIET gecombineerd met voorzetsels of suffixen. Zijn belangrijkste functie is het versterken van het werkwoord (emfatisch gebruik).",
        examples: [
          { hebrew: "מוֹת תָּמוּת", transliteration: "mot tamut", dutch: "je zult zeker sterven", explanation: "Genesis 2:17 - infinitivus absolutus + imperfectum = nadruk." },
          { hebrew: "שָׁמוֹר תִּשְׁמְרוּן", transliteration: "shamor tishmerun", dutch: "jullie zullen zorgvuldig bewaken", explanation: "Deuteronomium 6:17 - versterking door herhaling." },
          { hebrew: "הָלוֹךְ וְגָדֵל", transliteration: "halokh wegadel", dutch: "steeds groter wordend (gaande en groeiend)", explanation: "Twee infinitieven absolutus om progressie uit te drukken." },
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Wat is de meest voorkomende combinatie met de infinitivus constructus?',
        options: ['בְּ + infinitief = "toen..."', 'לְ + infinitief = "om te..."', 'כְּ + infinitief = "zoals..."', 'מִן + infinitief = "van..."'],
        correctAnswer: 'לְ + infinitief = "om te..."',
        explanation: 'De combinatie לְ + infinitivus constructus ("om te...") is de meest voorkomende. Voorbeeld: לִשְׁמֹר = om te bewaken.',
      },
      {
        type: 'multiple-choice',
        question: 'Wat betekent מוֹת תָּמוּת (Genesis 2:17)?',
        options: ['Je zult sterven', 'Je zult zeker sterven', 'Sterf!', 'Hij stierf'],
        correctAnswer: 'Je zult zeker sterven',
        explanation: 'De infinitivus absolutus voor het werkwoord versterkt de betekenis (emfatisch). מוֹת (inf. abs.) + תָּמוּת (imperfectum) = "je zult zeker sterven".',
      },
      {
        type: 'multiple-choice',
        question: 'Wat betekent בְּ + infinitivus constructus?',
        options: ['om te...', 'toen... / terwijl...', 'voordat...', 'nadat...'],
        correctAnswer: 'toen... / terwijl...',
        explanation: 'בְּ + infinitivus constructus drukt "toen" of "terwijl" uit. Voorbeeld: בִּבְרֹא אֱלֹהִים = "toen God schiep".',
      },
    ],
  },
  {
    id: "imperatief-jussief",
    title: "Imperatief en Jussief",
    order: 11,
    summary: "De imperatief (gebiedende wijs) geeft directe bevelen. De jussief en cohortatief drukken wensen en aansporingen uit.",
    sections: [
      {
        heading: "Imperatief (gebiedende wijs)",
        content: "De imperatief wordt alleen gebruikt voor directe bevelen aan de 2e persoon. De vorm lijkt op het imperfectum zonder het prefix. In Qal is het basispatroon קְטֹל (qetol).",
        table: {
          headers: ["Vorm", "Patroon", "שׁמר (bewaken)", "כתב (schrijven)"],
          rows: [
            ["2e m. enk.", "קְטֹל", "שְׁמֹר", "כְּתֹב"],
            ["2e v. enk.", "קִטְלִי", "שִׁמְרִי", "כִּתְבִי"],
            ["2e m. mv.", "קִטְלוּ", "שִׁמְרוּ", "כִּתְבוּ"],
            ["2e v. mv.", "קְטֹלְנָה", "שְׁמֹרְנָה", "כְּתֹבְנָה"],
          ],
        },
        examples: [
          { hebrew: "שְׁמַע יִשְׂרָאֵל", transliteration: "shema' yisra'el", dutch: "hoor, Israel!", explanation: "Deuteronomium 6:4 - imperatief van שׁמע." },
          { hebrew: "שִׁמְרוּ מִשְׁפָּט", transliteration: "shimru mishpat", dutch: "bewaart het recht!", explanation: "Jesaja 56:1 - meervoudige imperatief." },
          { hebrew: "לֵךְ לְךָ", transliteration: "lekh lekha", dutch: "ga voor jezelf / ga heen!", explanation: "Genesis 12:1 - imperatief van הלך (onregelmatig)." },
        ],
      },
      {
        heading: "Versterkte imperatief met ָה-",
        content: "Soms wordt een ָה- suffix aan de imperatief toegevoegd. Dit is een paragogische he die de imperatief versterkt of zachter maakt (smeekbede).",
        examples: [
          { hebrew: "שִׁמְעָה", transliteration: "shim'ah", dutch: "hoor toch!", explanation: "Versterkte imperatief van שׁמע." },
          { hebrew: "שָׁמְרָה נַפְשִׁי", transliteration: "shomrah nafshi", dutch: "bewaar toch mijn ziel!", explanation: "Psalm 25:20 - smeekbede." },
        ],
      },
      {
        heading: "Jussief (wensende wijs)",
        content: "De jussief drukt een wens of bevel uit voor de 3e persoon ('laat hem...', 'moge hij...'). De vorm is meestal identiek aan het imperfectum, maar soms korter (vooral bij zwakke werkwoorden).",
        examples: [
          { hebrew: "יְהִי אוֹר", transliteration: "yehi 'or", dutch: "laat er licht zijn / er zij licht", explanation: "Genesis 1:3 - jussief van היה. Korter dan het imperfectum יִהְיֶה." },
          { hebrew: "יְבָרֶכְךָ יְהוָה", transliteration: "yevarekekha YHWH", dutch: "moge de HEER u zegenen", explanation: "Numeri 6:24 - jussief van ברך in Pi'el." },
          { hebrew: "אַל־יִירָא לְבַבְכֶם", transliteration: "'al-yira' levavkhem", dutch: "laat uw hart niet vrezen", explanation: "Deuteronomium 20:3 - negatieve jussief met אַל." },
        ],
      },
      {
        heading: "Cohortatief (aansporing 1e persoon)",
        content: "De cohortatief drukt een wens of voornemen uit voor de 1e persoon ('laat mij...', 'laten wij...'). Hij wordt gevormd door ָה- toe te voegen aan het imperfectum 1e persoon.",
        examples: [
          { hebrew: "אֶשְׁמְרָה", transliteration: "'eshmerah", dutch: "laat mij bewaken / ik wil bewaken", explanation: "Cohortatief 1e enk. van שׁמר." },
          { hebrew: "נֵלְכָה", transliteration: "nelkhah", dutch: "laten wij gaan", explanation: "Cohortatief 1e mv. van הלך." },
          { hebrew: "נַעֲשֶׂה אָדָם", transliteration: "na'aseh 'adam", dutch: "laten wij een mens maken", explanation: "Genesis 1:26 - cohortatief van עשׂה." },
        ],
      },
      {
        heading: "Negatie van bevelen",
        content: "Bevelen worden op twee manieren ontkend:\n1. אַל + jussief/cohortatief = verbod voor een specifieke situatie ('doe het nu niet')\n2. לֹא + imperfectum = permanent verbod ('doe het nooit')",
        examples: [
          { hebrew: "אַל־תִּירָא", transliteration: "'al-tira'", dutch: "vrees niet! (nu)", explanation: "Specifiek verbod met אַל + jussief." },
          { hebrew: "לֹא תִּגְנֹב", transliteration: "lo' tignov", dutch: "gij zult niet stelen", explanation: "Permanent verbod (Tien Geboden) met לֹא + imperfectum." },
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Voor welke persoon wordt de imperatief gebruikt?',
        options: ['1e persoon (ik/wij)', '2e persoon (jij/jullie)', '3e persoon (hij/zij)', 'Alle personen'],
        correctAnswer: '2e persoon (jij/jullie)',
        explanation: 'De imperatief wordt alleen gebruikt voor directe bevelen aan de 2e persoon (jij/jullie).',
      },
      {
        type: 'multiple-choice',
        question: 'Wat is het verschil tussen אַל + jussief en לֹא + imperfectum?',
        options: ['Er is geen verschil', 'אַל is voor specifiek verbod, לֹא voor permanent verbod', 'אַל is voor vragen, לֹא voor bevelen', 'אַל is voor vrouwelijk, לֹא voor mannelijk'],
        correctAnswer: 'אַל is voor specifiek verbod, לֹא voor permanent verbod',
        explanation: 'אַל + jussief = verbod voor een specifieke situatie ("doe het nu niet"). לֹא + imperfectum = permanent verbod ("doe het nooit").',
      },
      {
        type: 'multiple-choice',
        question: 'Wat drukt de cohortatief uit?',
        options: ['Een bevel aan de 2e persoon', 'Een wens voor de 3e persoon', 'Een wens of voornemen voor de 1e persoon', 'Een verbod'],
        correctAnswer: 'Een wens of voornemen voor de 1e persoon',
        explanation: 'De cohortatief drukt een wens of voornemen uit voor de 1e persoon: "laat mij...", "laten wij...". Gevormd door ָה- toe te voegen aan het imperfectum.',
      },
    ],
  },
  {
    id: "nifal",
    title: "Nif'al stam",
    order: 12,
    summary: "De Nif'al is de passieve/reflexieve stam. Herkenbaar aan het prefix נ of de dagesh in de eerste wortelconsonant. Drukt uit: passief, reflexief, of wederkerig.",
    sections: [
      {
        heading: "Betekenis en functie",
        content: "De Nif'al heeft drie hoofdbetekenissen:\n1. Passief van Qal: 'hij werd bewaakt' (als Qal = 'hij bewaakte')\n2. Reflexief: 'hij bewaakte zichzelf'\n3. Wederkerig: 'zij bewaakten elkaar'\nSoms heeft de Nif'al een eigen betekenis die niet direct afgeleid is van de Qal.",
        examples: [
          { hebrew: "נִשְׁמַר", transliteration: "nishmar", dutch: "hij werd bewaakt / hij hoedde zich", explanation: "Passief of reflexief van שׁמר." },
          { hebrew: "נִלְחַם", transliteration: "nilcham", dutch: "hij vocht / hij streed", explanation: "Nif'al van לחם - de Qal wordt niet gebruikt; de Nif'al heeft een eigen betekenis." },
          { hebrew: "נִמְצָא", transliteration: "nimtsa'", dutch: "hij werd gevonden", explanation: "Passief van מצא (vinden)." },
        ],
      },
      {
        heading: "Herkenning van de Nif'al",
        content: "De Nif'al is herkenbaar aan het prefix נִ in het perfectum en het participium. In het imperfectum verdwijnt de נ en verschijnt er een dagesh in de eerste wortelconsonant.",
        table: {
          headers: ["Vorm", "Kenmerk", "Voorbeeld (שׁמר)"],
          rows: [
            ["Perfectum 3e m.", "נִקְטַל", "נִשְׁמַר (hij werd bewaakt)"],
            ["Imperfectum 3e m.", "יִקָּטֵל", "יִשָּׁמֵר (hij zal bewaakt worden)"],
            ["Participium m.", "נִקְטָל", "נִשְׁמָר (bewaakt wordend)"],
            ["Infinitivus constr.", "הִקָּטֵל", "הִשָּׁמֵר (bewaakt worden)"],
            ["Imperatief m.", "הִקָּטֵל", "הִשָּׁמֵר (wordt bewaakt!)"],
          ],
        },
      },
      {
        heading: "Perfectum paradigma",
        content: "Het Nif'al perfectum wordt gevormd met het prefix נִ gevolgd door de wortel. De suffixen zijn dezelfde als in Qal.",
        table: {
          headers: ["Persoon", "Vorm (שׁמר)", "Vertaling"],
          rows: [
            ["3e m. enk.", "נִשְׁמַר", "hij werd bewaakt"],
            ["3e v. enk.", "נִשְׁמְרָה", "zij werd bewaakt"],
            ["2e m. enk.", "נִשְׁמַרְתָּ", "jij werd bewaakt (m)"],
            ["1e enk.", "נִשְׁמַרְתִּי", "ik werd bewaakt"],
            ["3e mv.", "נִשְׁמְרוּ", "zij werden bewaakt"],
            ["1e mv.", "נִשְׁמַרְנוּ", "wij werden bewaakt"],
          ],
        },
      },
      {
        heading: "Voorbeelden uit de Bijbel",
        content: "De Nif'al komt frequent voor in de Hebreeuwse Bijbel. Let op de verschillende betekenissen.",
        examples: [
          { hebrew: "וְנִבְרְכוּ בְךָ כָּל מִשְׁפְּחֹת הָאֲדָמָה", transliteration: "wenivrekhu vekha kol mishpechot ha'adamah", dutch: "en in u zullen alle families van de aardbodem gezegend worden", explanation: "Genesis 12:3 - Nif'al van ברך (passief)." },
          { hebrew: "נִגְלָה כְבוֹד יְהוָה", transliteration: "niglah kevod YHWH", dutch: "de heerlijkheid van de HEER werd geopenbaard", explanation: "Jesaja 40:5 - Nif'al van גלה (passief)." },
          { hebrew: "וַיִּשָּׁבַע יְהוָה", transliteration: "wayyishava' YHWH", dutch: "en de HEER zwoer", explanation: "Nif'al van שׁבע - eigen betekenis ('zweren'), niet passief." },
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Wat zijn de drie hoofdbetekenissen van de Nif\'al?',
        options: ['Causatief, intensief, declaratief', 'Passief, reflexief, wederkerig', 'Actief, toekomstig, herhaald', 'Bevel, wens, verbod'],
        correctAnswer: 'Passief, reflexief, wederkerig',
        explanation: 'De Nif\'al heeft drie hoofdbetekenissen: passief ("hij werd bewaakt"), reflexief ("hij bewaakte zichzelf"), wederkerig ("zij bewaakten elkaar").',
      },
      {
        type: 'multiple-choice',
        question: 'Hoe herken je een Nif\'al perfectum?',
        options: ['Prefix הִ', 'Prefix נִ', 'Prefix הִתְ', 'Dagesh in de middelste letter'],
        correctAnswer: 'Prefix נִ',
        explanation: 'De Nif\'al perfectum is herkenbaar aan het prefix נִ. Voorbeeld: נִשְׁמַר (hij werd bewaakt).',
      },
    ],
  },
  {
    id: "piel-pual",
    title: "Pi'el en Pu'al stammen",
    order: 13,
    summary: "Pi'el is de intensieve actieve stam, Pu'al is de bijbehorende passief. Herkenbaar aan de dagesh forte in de middelste wortelconsonant.",
    sections: [
      {
        heading: "Pi'el: betekenis en functie",
        content: "De Pi'el heeft verschillende betekenissen ten opzichte van de Qal:\n1. Intensief: een versterking van de Qal-betekenis\n2. Factitatief: iets in een bepaalde toestand brengen ('groot maken' van 'groot zijn')\n3. Denominatief: een werkwoord afgeleid van een zelfstandig naamwoord\n4. Declaratief: iets verklaren ('rechtvaardig verklaren')\n\nHet kenmerk van Pi'el is de dagesh forte (verdubbeling) in de middelste wortelconsonant.",
        examples: [
          { hebrew: "שָׁבַר (Qal) → שִׁבֵּר (Pi'el)", transliteration: "shavar → shibber", dutch: "breken → verbrijzelen", explanation: "Intensivering: breken → aan stukken breken." },
          { hebrew: "לָמַד (Qal) → לִמֵּד (Pi'el)", transliteration: "lamad → limmed", dutch: "leren → onderwijzen", explanation: "Factitatief: leren (zelf) → iemand laten leren (onderwijzen)." },
          { hebrew: "דִּבֶּר", transliteration: "dibber", dutch: "hij sprak", explanation: "Pi'el van דבר - de Qal wordt bijna niet gebruikt." },
          { hebrew: "קִדֵּשׁ", transliteration: "qiddesh", dutch: "hij heiligde", explanation: "Factitatief: heilig maken, van קָדוֹשׁ (heilig)." },
        ],
      },
      {
        heading: "Pi'el paradigma",
        content: "Het klinkerpatroon van Pi'el is i-e (perfectum) en a-e (imperfectum). De middelste wortelconsonant heeft altijd een dagesh forte.",
        table: {
          headers: ["Vorm", "Patroon", "Voorbeeld (קדשׁ)", "Betekenis"],
          rows: [
            ["Perfectum 3e m.", "קִטֵּל", "קִדֵּשׁ", "hij heiligde"],
            ["Imperfectum 3e m.", "יְקַטֵּל", "יְקַדֵּשׁ", "hij zal heiligen"],
            ["Participium", "מְקַטֵּל", "מְקַדֵּשׁ", "heiligende"],
            ["Inf. constructus", "קַטֵּל", "קַדֵּשׁ", "heiligen"],
            ["Imperatief m.", "קַטֵּל", "קַדֵּשׁ", "heilig!"],
          ],
        },
      },
      {
        heading: "Pu'al: passief van Pi'el",
        content: "De Pu'al is de passieve tegenhanger van de Pi'el. Het kenmerk is de u-klinker (qibbuts of shureq) onder de eerste wortelconsonant, plus dagesh forte in de middelste wortelconsonant. De Pu'al komt alleen voor in perfectum, imperfectum en participium - er is geen imperatief of infinitief.",
        table: {
          headers: ["Vorm", "Patroon", "Voorbeeld (קדשׁ)", "Betekenis"],
          rows: [
            ["Perfectum 3e m.", "קֻטַּל", "קֻדַּשׁ", "hij werd geheiligd"],
            ["Imperfectum 3e m.", "יְקֻטַּל", "יְקֻדַּשׁ", "hij zal geheiligd worden"],
            ["Participium", "מְקֻטָּל", "מְקֻדָּשׁ", "geheiligd wordend"],
          ],
        },
        examples: [
          { hebrew: "בֹּרַךְ", transliteration: "borakh", dutch: "hij werd gezegend", explanation: "Pu'al van ברך - soms wordt de dagesh in ר gecompenseerd door klinkerverlenging." },
          { hebrew: "כֻּסָּה", transliteration: "kussah", dutch: "het werd bedekt", explanation: "Pu'al van כסה." },
        ],
      },
      {
        heading: "Voorbeelden uit de Bijbel",
        content: "De Pi'el is een van de meest voorkomende stammen na de Qal.",
        examples: [
          { hebrew: "וַיְדַבֵּר יְהוָה אֶל־מֹשֶׁה", transliteration: "waydabber YHWH 'el-Mosheh", dutch: "en de HEER sprak tot Mozes", explanation: "Pi'el van דבר - zeer frequent in de Pentateuch." },
          { hebrew: "וַיְבָרֶךְ אֹתָם אֱלֹהִים", transliteration: "wayvarekh 'otam 'elohim", dutch: "en God zegende hen", explanation: "Genesis 1:22 - Pi'el van ברך." },
          { hebrew: "וַיְצַו יְהוָה אֱלֹהִים", transliteration: "waytsav YHWH 'elohim", dutch: "en de HEER God gebood", explanation: "Genesis 2:16 - Pi'el van צוה." },
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Wat is het kenmerk van de Pi\'el stam?',
        options: ['Prefix נִ', 'Prefix הִתְ', 'Dagesh forte in de middelste wortelconsonant', 'Prefix הִ'],
        correctAnswer: 'Dagesh forte in de middelste wortelconsonant',
        explanation: 'Het kenmerk van de Pi\'el is de dagesh forte (verdubbeling) in de middelste wortelconsonant. Voorbeeld: דִּבֵּר (hij sprak).',
      },
      {
        type: 'multiple-choice',
        question: 'Wat is het verschil tussen לָמַד (Qal) en לִמֵּד (Pi\'el)?',
        options: ['Geen verschil', 'Qal = leren (zelf), Pi\'el = onderwijzen (iemand laten leren)', 'Qal = onderwijzen, Pi\'el = leren', 'Qal is verleden tijd, Pi\'el is toekomst'],
        correctAnswer: 'Qal = leren (zelf), Pi\'el = onderwijzen (iemand laten leren)',
        explanation: 'De Pi\'el heeft vaak een factitatieve betekenis: Qal לָמַד = leren (zelf), Pi\'el לִמֵּד = onderwijzen (iemand anders laten leren).',
      },
      {
        type: 'multiple-choice',
        question: 'Wat is de Pu\'al?',
        options: ['De actieve tegenhanger van Pi\'el', 'De passieve tegenhanger van Pi\'el', 'De reflexieve vorm', 'De causatieve stam'],
        correctAnswer: 'De passieve tegenhanger van Pi\'el',
        explanation: 'De Pu\'al is de passieve tegenhanger van de Pi\'el. Het kenmerk is een u-klinker onder de eerste wortelconsonant. Voorbeeld: קֻדַּשׁ (hij werd geheiligd).',
      },
    ],
  },
  {
    id: "hifil-hofal",
    title: "Hif'il en Hof'al stammen",
    order: 14,
    summary: "De Hif'il is de causatieve actieve stam ('doen/laten...'), de Hof'al is de bijbehorende passief. Herkenbaar aan het prefix הִ/הֻ.",
    sections: [
      {
        heading: "Hif'il: betekenis en functie",
        content: "De Hif'il drukt een causatieve handeling uit: het subject veroorzaakt dat iemand anders de handeling uitvoert.\n1. Causatief: 'doen regeren' (van 'regeren'), 'doen horen' (van 'horen')\n2. Declaratief: 'rechtvaardig verklaren' (van 'rechtvaardig zijn')\n3. Soms eigen betekenis die niet direct causatief is\n\nHet kenmerk is het prefix הִ in het perfectum en een הַ/מַ patroon in imperfectum/participium.",
        examples: [
          { hebrew: "שָׁמַע (Qal) → הִשְׁמִיעַ (Hif'il)", transliteration: "shama' → hishmi'a", dutch: "horen → doen horen / verkondigen", explanation: "Causatief: 'ervoor zorgen dat iemand hoort'." },
          { hebrew: "מָלַךְ (Qal) → הִמְלִיךְ (Hif'il)", transliteration: "malakh → himlikh", dutch: "regeren → koning maken", explanation: "Causatief: 'iemand laten regeren'." },
          { hebrew: "הִגִּיד", transliteration: "higgid", dutch: "hij vertelde / verklaarde", explanation: "Hif'il van נגד - zeer veelvoorkomend." },
          { hebrew: "הִצִּיל", transliteration: "hitstsil", dutch: "hij redde / bevrijdde", explanation: "Hif'il van נצל." },
        ],
      },
      {
        heading: "Hif'il paradigma",
        content: "Het Hif'il perfectum begint met הִ en heeft een i-klinker als kenmerk. Het imperfectum heeft een patach onder het prefix.",
        table: {
          headers: ["Vorm", "Patroon", "Voorbeeld (מלך)", "Betekenis"],
          rows: [
            ["Perfectum 3e m.", "הִקְטִיל", "הִמְלִיךְ", "hij maakte koning"],
            ["Perfectum 3e v.", "הִקְטִילָה", "הִמְלִיכָה", "zij maakte koning"],
            ["Perfectum 1e enk.", "הִקְטַלְתִּי", "הִמְלַכְתִּי", "ik maakte koning"],
            ["Imperfectum 3e m.", "יַקְטִיל", "יַמְלִיךְ", "hij zal koning maken"],
            ["Imperfectum 1e enk.", "אַקְטִיל", "אַמְלִיךְ", "ik zal koning maken"],
            ["Participium", "מַקְטִיל", "מַמְלִיךְ", "koning makend"],
            ["Inf. constructus", "הַקְטִיל", "הַמְלִיךְ", "koning maken"],
            ["Imperatief m.", "הַקְטֵל", "הַמְלֵךְ", "maak koning!"],
          ],
        },
      },
      {
        heading: "Hof'al: passief van Hif'il",
        content: "De Hof'al is de passieve tegenhanger van de Hif'il. Het kenmerk is de u-klinker (qibbuts of shureq) in het prefix. Net als de Pu'al kent de Hof'al geen imperatief of infinitief.",
        table: {
          headers: ["Vorm", "Patroon", "Voorbeeld (מלך)", "Betekenis"],
          rows: [
            ["Perfectum 3e m.", "הֻקְטַל", "הֻמְלַךְ", "hij werd koning gemaakt"],
            ["Imperfectum 3e m.", "יֻקְטַל", "יֻמְלַךְ", "hij zal koning gemaakt worden"],
            ["Participium", "מֻקְטָל", "מֻמְלָךְ", "koning gemaakt wordend"],
          ],
        },
      },
      {
        heading: "Voorbeelden uit de Bijbel",
        content: "De Hif'il is een veelgebruikte stam met een breed scala aan betekenissen.",
        examples: [
          { hebrew: "וַיַּכּוּ אֶת־הָעִיר", transliteration: "wayyakku 'et-ha'ir", dutch: "en zij sloegen de stad", explanation: "Hif'il van נכה - 'slaan, verslaan'." },
          { hebrew: "הִנְנִי מַמְטִיר", transliteration: "hineni mamtir", dutch: "zie, ik laat het regenen", explanation: "Genesis 2:5 - Hif'il participium van מטר." },
          { hebrew: "וְהִגַּדְתָּ לְבִנְךָ", transliteration: "wehiggadta levinekha", dutch: "en gij zult aan uw zoon vertellen", explanation: "Exodus 13:8 - Hif'il van נגד." },
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Wat drukt de Hif\'il stam uit?',
        options: ['Passief', 'Reflexief', 'Causatief (doen/laten...)', 'Intensief'],
        correctAnswer: 'Causatief (doen/laten...)',
        explanation: 'De Hif\'il drukt een causatieve handeling uit: het subject veroorzaakt dat iemand anders de handeling uitvoert. Voorbeeld: הִשְׁמִיעַ = doen horen.',
      },
      {
        type: 'multiple-choice',
        question: 'Wat is het verschil tussen שָׁמַע (Qal) en הִשְׁמִיעַ (Hif\'il)?',
        options: ['Qal = horen, Hif\'il = doen horen / verkondigen', 'Qal = verkondigen, Hif\'il = horen', 'Er is geen verschil', 'Qal is actief, Hif\'il is passief'],
        correctAnswer: 'Qal = horen, Hif\'il = doen horen / verkondigen',
        explanation: 'De Hif\'il is causatief: Qal שָׁמַע = horen, Hif\'il הִשְׁמִיעַ = doen horen, verkondigen.',
      },
    ],
  },
  {
    id: "hitpael",
    title: "Hitpa'el stam",
    order: 15,
    summary: "De Hitpa'el is de reflexieve stam. Herkenbaar aan het prefix הִתְ. Drukt reflexieve, wederkerige en iteratieve handelingen uit.",
    sections: [
      {
        heading: "Betekenis en functie",
        content: "De Hitpa'el heeft verschillende betekenissen:\n1. Reflexief: het subject doet iets aan zichzelf ('zich heiligen')\n2. Wederkerig: twee of meer subjecten doen iets aan elkaar ('met elkaar spreken')\n3. Iteratief: herhaalde of voortdurende handeling ('heen en weer wandelen')\n4. Simulatief: doen alsof ('zich ziek voordoen')\n\nHet kenmerk is het prefix הִתְ voor de wortelconsonanten.",
        examples: [
          { hebrew: "הִתְקַדֵּשׁ", transliteration: "hitqaddesh", dutch: "zich heiligen", explanation: "Reflexief: 'zichzelf heilig maken'." },
          { hebrew: "הִתְהַלֵּךְ", transliteration: "hithallekh", dutch: "wandelen / rondwandelen", explanation: "Iteratief: 'heen en weer wandelen'." },
          { hebrew: "הִתְנַבֵּא", transliteration: "hitnabve'", dutch: "profeteren / zich als profeet gedragen", explanation: "Van נביא (profeet) - denominatief/simulatief." },
        ],
      },
      {
        heading: "Herkenning en paradigma",
        content: "Het Hitpa'el prefix הִתְ staat in het perfectum direct voor de wortel. In het imperfectum wordt het ingevoegd na het persoonlijk prefix. De middelste wortelconsonant heeft een dagesh forte (net als Pi'el).",
        table: {
          headers: ["Vorm", "Patroon", "Voorbeeld (קדשׁ)", "Betekenis"],
          rows: [
            ["Perfectum 3e m.", "הִתְקַטֵּל", "הִתְקַדֵּשׁ", "hij heiligde zich"],
            ["Perfectum 1e enk.", "הִתְקַטַּלְתִּי", "הִתְקַדַּשְׁתִּי", "ik heiligde mij"],
            ["Imperfectum 3e m.", "יִתְקַטֵּל", "יִתְקַדֵּשׁ", "hij zal zich heiligen"],
            ["Imperfectum 1e enk.", "אֶתְקַטֵּל", "אֶתְקַדֵּשׁ", "ik zal mij heiligen"],
            ["Participium", "מִתְקַטֵּל", "מִתְקַדֵּשׁ", "zich heiligende"],
            ["Inf. constructus", "הִתְקַטֵּל", "הִתְקַדֵּשׁ", "zich heiligen"],
            ["Imperatief m.", "הִתְקַטֵּל", "הִתְקַדֵּשׁ", "heilig u!"],
          ],
        },
      },
      {
        heading: "Bijzondere klankverschijnselen",
        content: "Bij de Hitpa'el treden soms klankveranderingen op in het prefix הִתְ:\n1. Metathesis (omwisseling): als de eerste wortelconsonant een sibilant is (שׂ, שׁ, ס, צ), wisselen de תְ en de sibilant van plaats.\n2. Assimilatie: als de eerste wortelconsonant een ט, ד of ת is, assimileert de תְ soms.",
        examples: [
          { hebrew: "הִשְׁתַּמֵּר (in plaats van הִתְשַׁמֵּר)", transliteration: "hishtammer", dutch: "zich hoeden", explanation: "Metathesis: תְ en שׁ wisselen van plaats." },
          { hebrew: "הִצְטַדֵּק (in plaats van הִתְצַדֵּק)", transliteration: "hitstaddeq", dutch: "zich rechtvaardigen", explanation: "Metathesis en assimilatie bij צ." },
        ],
      },
      {
        heading: "Voorbeelden uit de Bijbel",
        content: "De Hitpa'el komt regelmatig voor, vooral in verhalen en gebeden.",
        examples: [
          { hebrew: "וַיִּתְהַלֵּךְ חֲנוֹךְ אֶת־הָאֱלֹהִים", transliteration: "wayyithallekh chanokh 'et-ha'elohim", dutch: "en Henoch wandelde met God", explanation: "Genesis 5:22 - Hitpa'el van הלך (iteratief: herhaald wandelen)." },
          { hebrew: "וַיִּתְפַּלֵּל אֶל־יְהוָה", transliteration: "wayyitpallel 'el-YHWH", dutch: "en hij bad tot de HEER", explanation: "Hitpa'el van פלל - 'bidden' (reflexief: 'voor zichzelf pleiten')." },
          { hebrew: "הִתְקַדְּשׁוּ", transliteration: "hitqaddeshu", dutch: "heiligt uzelf!", explanation: "Jozua 3:5 - imperatief Hitpa'el van קדשׁ." },
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Wat is het kenmerkende prefix van de Hitpa\'el?',
        options: ['נִ', 'הִ', 'הִתְ', 'מְ'],
        correctAnswer: 'הִתְ',
        explanation: 'Het kenmerk van de Hitpa\'el is het prefix הִתְ. Voorbeeld: הִתְקַדֵּשׁ (zich heiligen).',
      },
      {
        type: 'multiple-choice',
        question: 'Welke betekenissen kan de Hitpa\'el uitdrukken?',
        options: ['Alleen passief', 'Causatief en intensief', 'Reflexief, wederkerig, iteratief en simulatief', 'Alleen actief'],
        correctAnswer: 'Reflexief, wederkerig, iteratief en simulatief',
        explanation: 'De Hitpa\'el kan uitdrukken: reflexief (zich heiligen), wederkerig (met elkaar spreken), iteratief (rondwandelen), simulatief (zich voordoen als).',
      },
      {
        type: 'multiple-choice',
        question: 'Wat is "metathesis" bij de Hitpa\'el?',
        options: ['De ה valt weg', 'De תְ en een sibilant wisselen van plaats', 'Het werkwoord wordt passief', 'Het prefix wordt verdubbeld'],
        correctAnswer: 'De תְ en een sibilant wisselen van plaats',
        explanation: 'Als de eerste wortelconsonant een sibilant is (שׂ, שׁ, ס, צ), wisselen de תְ en de sibilant van plaats. Voorbeeld: הִשְׁתַּמֵּר in plaats van הִתְשַׁמֵּר.',
      },
    ],
  },
  {
    id: "zwak-pe-nun-yod",
    title: "Zwakke werkwoorden: Pe-Nun en Pe-Yod",
    order: 16,
    summary: "Werkwoorden met נ als eerste radicaal (Pe-Nun) verliezen vaak de נ door assimilatie. Werkwoorden met י als eerste radicaal (Pe-Yod) vertonen bijzondere vormen in het imperfectum.",
    sections: [
      {
        heading: "Pe-Nun werkwoorden: overzicht",
        content: "Bij werkwoorden met נ als eerste wortelconsonant (Pe-Nun) assimileert de נ vaak aan de volgende consonant. Dit betekent dat de נ verdwijnt en er een dagesh forte in de volgende letter verschijnt. Dit gebeurt vooral in het imperfectum Qal en in de Nif'al en Hif'il.",
        examples: [
          { hebrew: "נָפַל → יִפֹּל", transliteration: "nafal → yippol", dutch: "vallen → hij zal vallen", explanation: "De נ assimileert: יִנְפֹּל → יִפֹּל (dagesh in פ)." },
          { hebrew: "נָגַשׁ → יִגַּשׁ", transliteration: "nagash → yiggash", dutch: "naderen → hij zal naderen", explanation: "De נ assimileert in het imperfectum." },
          { hebrew: "נָתַן → יִתֵּן", transliteration: "natan → yitten", dutch: "geven → hij zal geven", explanation: "Beide נ letters assimileren: יִנְתֵן → יִתֵּן." },
        ],
      },
      {
        heading: "Pe-Nun: paradigma van נפל",
        content: "Het werkwoord נפל (vallen) is een typisch Pe-Nun werkwoord. Let op de assimilatie van de נ in het imperfectum en de imperatief.",
        table: {
          headers: ["Vorm", "נפל (vallen)", "Opmerking"],
          rows: [
            ["Perf. 3e m.", "נָפַל", "Normaal (נ is zichtbaar)"],
            ["Perf. 1e enk.", "נָפַלְתִּי", "Normaal"],
            ["Imperf. 3e m.", "יִפֹּל", "נ geassimileerd (dagesh in פ)"],
            ["Imperf. 1e enk.", "אֶפֹּל", "נ geassimileerd"],
            ["Imperatief m.", "נְפֹל", "נ blijft soms in imperatief"],
            ["Inf. constructus", "נְפֹל", "נ blijft"],
            ["Participium", "נֹפֵל", "נ blijft"],
          ],
        },
      },
      {
        heading: "Pe-Yod werkwoorden: overzicht",
        content: "Werkwoorden met י als eerste wortelconsonant (Pe-Yod) vertonen bijzondere vormen, vooral in het imperfectum en de infinitivus constructus van Qal. De י verdwijnt vaak en het imperfectum krijgt een e- of o-klinker na het prefix. Veel van deze werkwoorden zijn oorspronkelijk Pe-Waw (de eerste radicaal was oorspronkelijk ו).",
        examples: [
          { hebrew: "יָשַׁב → יֵשֵׁב", transliteration: "yashav → yeshev", dutch: "zitten → hij zal zitten", explanation: "De י valt weg; tsere onder het prefix." },
          { hebrew: "יָלַד → יֵלֵד", transliteration: "yalad → yeled", dutch: "baren → zij zal baren", explanation: "De י valt weg in het imperfectum." },
          { hebrew: "יָרַד → יֵרֵד", transliteration: "yarad → yered", dutch: "afdalen → hij zal afdalen" },
        ],
      },
      {
        heading: "Pe-Yod: bijzondere infinitief en Hif'il",
        content: "De infinitivus constructus van Pe-Yod werkwoorden eindigt vaak op ת- en heeft het patroon שֶׁבֶת (van ישׁב). In de Hif'il krijgen deze werkwoorden een holem als kenmerkende klinker.",
        table: {
          headers: ["Wortel", "Inf. constr. Qal", "Hif'il perf.", "Hif'il betekenis"],
          rows: [
            ["ישׁב", "שֶׁבֶת", "הוֹשִׁיב", "doen zitten / vestigen"],
            ["ירד", "רֶדֶת", "הוֹרִיד", "doen afdalen"],
            ["ילד", "לֶדֶת", "הוֹלִיד", "verwekken"],
            ["ידע", "דַּעַת", "הוֹדִיעַ", "bekendmaken"],
            ["יצא", "צֵאת", "הוֹצִיא", "doen uitgaan / uitbrengen"],
          ],
        },
        examples: [
          { hebrew: "הוֹשִׁיעָה נָּא", transliteration: "hoshi'ah nna'", dutch: "verlos toch!", explanation: "Hif'il imperatief van ישׁע (verlossen) - bron van 'Hosanna'." },
          { hebrew: "וַיּוֹלֶד", transliteration: "wayyoled", dutch: "en hij verwekte", explanation: "Hif'il wayyiqtol van ילד - frequent in geslachtsregisters." },
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Wat gebeurt er met de נ bij Pe-Nun werkwoorden in het imperfectum?',
        options: ['De נ wordt verdubbeld', 'De נ assimileert aan de volgende consonant', 'De נ krijgt een klinker', 'Er verandert niets'],
        correctAnswer: 'De נ assimileert aan de volgende consonant',
        explanation: 'Bij Pe-Nun werkwoorden assimileert de נ vaak aan de volgende consonant in het imperfectum. Voorbeeld: נָפַל → יִפֹּל (de נ verdwijnt, dagesh in פ).',
      },
      {
        type: 'multiple-choice',
        question: 'Wat is het imperfectum van נָתַן (geven)?',
        options: ['יִנְתֵּן', 'יִתֵּן', 'יַנְתֵּן', 'נוֹתֵן'],
        correctAnswer: 'יִתֵּן',
        explanation: 'Bij נָתַן assimileren beide נ letters in het imperfectum: יִנְתֵן → יִתֵּן (hij zal geven).',
      },
    ],
  },
  {
    id: "zwak-lamed-he",
    title: "Zwakke werkwoorden: Lamed-He",
    order: 17,
    summary: "Werkwoorden met ה als derde radicaal (Lamed-He) vormen de grootste groep zwakke werkwoorden. De ה valt weg of verandert in verschillende vormen.",
    sections: [
      {
        heading: "Overzicht",
        content: "Lamed-He werkwoorden zijn werkwoorden waarvan de derde wortelconsonant oorspronkelijk een י of ו was, maar in veel vormen als ה verschijnt. Dit is de grootste en belangrijkste groep zwakke werkwoorden. Bijna alle vormen wijken af van het sterke werkwoord. De ה verdwijnt wanneer er een suffix met een klinker volgt.",
        examples: [
          { hebrew: "גָּלָה", transliteration: "galah", dutch: "hij onthulde / ging in ballingschap", explanation: "Lamed-He werkwoord: de ה is zichtbaar in het perfectum 3e m." },
          { hebrew: "בָּנָה", transliteration: "banah", dutch: "hij bouwde" },
          { hebrew: "עָשָׂה", transliteration: "'asah", dutch: "hij maakte / deed" },
          { hebrew: "רָאָה", transliteration: "ra'ah", dutch: "hij zag" },
        ],
      },
      {
        heading: "Perfectum Qal",
        content: "In het perfectum valt de ה weg wanneer suffixen worden toegevoegd die met een klinker beginnen. Voor consonant-suffixen wordt de ה vervangen door י.",
        table: {
          headers: ["Persoon", "Vorm (גלה)", "Vertaling", "Opmerking"],
          rows: [
            ["3e m. enk.", "גָּלָה", "hij onthulde", "ה zichtbaar"],
            ["3e v. enk.", "גָּלְתָה", "zij onthulde", "ה in suffix, wortel-ה verdwenen"],
            ["2e m. enk.", "גָּלִיתָ", "jij onthulde (m)", "י in plaats van ה"],
            ["2e v. enk.", "גָּלִית", "jij onthulde (v)", "י in plaats van ה"],
            ["1e enk.", "גָּלִיתִי", "ik onthulde", "י in plaats van ה"],
            ["3e mv.", "גָּלוּ", "zij onthulden", "ה valt weg voor וּ"],
            ["2e m. mv.", "גְּלִיתֶם", "jullie onthulden (m)", "י in plaats van ה"],
            ["1e mv.", "גָּלִינוּ", "wij onthulden", "י in plaats van ה"],
          ],
        },
      },
      {
        heading: "Imperfectum en andere vormen",
        content: "In het imperfectum eindigt het werkwoord op ה- (met qamats of tsere). In de jussief valt de ה helemaal weg. De imperatief en het participium vertonen ook kenmerkende patronen.",
        table: {
          headers: ["Vorm", "Patroon (גלה)", "Opmerking"],
          rows: [
            ["Imperf. 3e m.", "יִגְלֶה", "Eindigt op ה met segol/tsere"],
            ["Jussief 3e m.", "יִגֶל", "ה valt weg (korte vorm)"],
            ["Imperf. 3e mv.", "יִגְלוּ", "ה valt weg voor וּ"],
            ["Imperatief m.", "גְּלֵה", "Eindigt op ה"],
            ["Imperatief mv.", "גְּלוּ", "ה valt weg"],
            ["Participium m.", "גֹּלֶה", "Eindigt op ה"],
            ["Inf. constructus", "גְּלוֹת", "Eindigt op וֹת"],
            ["Inf. absolutus", "גָּלֹה", "Eindigt op ה"],
          ],
        },
      },
      {
        heading: "Voorbeelden uit de Bijbel",
        content: "Lamed-He werkwoorden zijn buitengewoon frequent. Enkele van de meest voorkomende Bijbelse werkwoorden behoren tot deze groep.",
        examples: [
          { hebrew: "וַיַּרְא אֱלֹהִים אֶת־הָאוֹר", transliteration: "wayyar' 'elohim 'et-ha'or", dutch: "en God zag het licht", explanation: "Genesis 1:4 - wayyiqtol van ראה (de ה valt weg)." },
          { hebrew: "וַיַּעַשׂ אֱלֹהִים", transliteration: "wayya'as 'elohim", dutch: "en God maakte", explanation: "Genesis 1:7 - wayyiqtol van עשׂה." },
          { hebrew: "וַיִּבֶן יְהוָה אֱלֹהִים אֶת־הַצֵּלָע", transliteration: "wayyiven YHWH 'elohim 'et-hatsela'", dutch: "en de HEER God bouwde de rib", explanation: "Genesis 2:22 - wayyiqtol van בנה." },
          { hebrew: "עֲלֵה", transliteration: "'aleh", dutch: "ga op!", explanation: "Imperatief van עלה (opgaan)." },
          { hebrew: "צִוָּה יְהוָה", transliteration: "tsivvah YHWH", dutch: "de HEER gebood", explanation: "Pi'el perfectum van צוה - ook een Lamed-He werkwoord." },
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Wat is kenmerkend voor Lamed-He werkwoorden?',
        options: ['De eerste letter valt weg', 'De middelste letter verdubbelt', 'De derde radicaal ה valt weg of verandert in verschillende vormen', 'Ze hebben altijd een prefix'],
        correctAnswer: 'De derde radicaal ה valt weg of verandert in verschillende vormen',
        explanation: 'Bij Lamed-He werkwoorden verdwijnt de ה wanneer er een suffix met klinker volgt, en wordt vervangen door י voor consonant-suffixen.',
      },
      {
        type: 'multiple-choice',
        question: 'Wat is de 3e persoon meervoud perfectum van גָּלָה (onthullen)?',
        options: ['גָּלוּ', 'גָּלָהוּ', 'גָּלְתָה', 'גָּלִים'],
        correctAnswer: 'גָּלוּ',
        explanation: 'De ה valt weg voor het suffix וּ (dat met een klinker begint): גָּלוּ = zij onthulden.',
      },
      {
        type: 'multiple-choice',
        question: 'Waarop eindigt de infinitivus constructus van Lamed-He werkwoorden?',
        options: ['ָה-', 'וֹת-', 'ִים-', 'ַת-'],
        correctAnswer: 'וֹת-',
        explanation: 'De infinitivus constructus van Lamed-He werkwoorden eindigt op וֹת-. Voorbeeld: גְּלוֹת (onthullen), רְאוֹת (zien).',
      },
    ],
  },
  {
    id: "zwak-ayin-waw-yod",
    title: "Zwakke werkwoorden: Ayin-Waw/Yod",
    order: 18,
    summary: "Holle werkwoorden hebben ו of י als middelste radicaal. De middelste consonant verdwijnt vaak, waardoor het werkwoord 'hol' wordt. Zeer veelvoorkomend.",
    sections: [
      {
        heading: "Overzicht",
        content: "Werkwoorden met ו of י als middelste wortelconsonant worden 'holle werkwoorden' genoemd (Ayin-Waw of Ayin-Yod). In de meeste vormen verdwijnt de middelste consonant en blijft er een lange klinker over. Deze werkwoorden lijken daardoor tweeletter-werkwoorden te zijn. Ze behoren tot de moeilijkste maar ook meest voorkomende werkwoorden in Bijbels Hebreeuws.",
        examples: [
          { hebrew: "קוּם (wortel ק-ו-מ)", transliteration: "qum", dutch: "opstaan", explanation: "Ayin-Waw: de ו wordt een shureq (lange u-klank) in het perfectum." },
          { hebrew: "בּוֹא (wortel ב-ו-א)", transliteration: "bo'", dutch: "komen / binnengaan", explanation: "Ayin-Waw: de ו wordt een holem (lange o-klank)." },
          { hebrew: "שִׂים (wortel שׂ-י-מ)", transliteration: "sim", dutch: "plaatsen / stellen", explanation: "Ayin-Yod: de י wordt een hireq (lange i-klank)." },
        ],
      },
      {
        heading: "Perfectum Qal",
        content: "In het perfectum Qal verschijnt de lange klinker (meestal shureq of holem) in het midden van het werkwoord. De suffixen zijn anders dan bij het sterke werkwoord.",
        table: {
          headers: ["Persoon", "קוּם (opstaan)", "בּוֹא (komen)", "מוּת (sterven)"],
          rows: [
            ["3e m. enk.", "קָם", "בָּא", "מֵת"],
            ["3e v. enk.", "קָמָה", "בָּאָה", "מֵתָה"],
            ["2e m. enk.", "קַמְתָּ", "בָּאתָ", "מַתָּ"],
            ["1e enk.", "קַמְתִּי", "בָּאתִי", "מַתִּי"],
            ["3e mv.", "קָמוּ", "בָּאוּ", "מֵתוּ"],
            ["1e mv.", "קַמְנוּ", "בָּאנוּ", "מַתְנוּ"],
          ],
        },
      },
      {
        heading: "Imperfectum Qal",
        content: "In het imperfectum verschijnt de lange klinker na het prefix. Het patroon is vaak yaqum (met shureq) of yavo' (met holem).",
        table: {
          headers: ["Persoon", "קוּם (opstaan)", "בּוֹא (komen)", "שׂים (plaatsen)"],
          rows: [
            ["3e m. enk.", "יָקוּם", "יָבוֹא", "יָשִׂים"],
            ["3e v. enk.", "תָּקוּם", "תָּבוֹא", "תָּשִׂים"],
            ["2e m. enk.", "תָּקוּם", "תָּבוֹא", "תָּשִׂים"],
            ["1e enk.", "אָקוּם", "אָבוֹא", "אָשִׂים"],
            ["3e m. mv.", "יָקוּמוּ", "יָבֹאוּ", "יָשִׂימוּ"],
            ["1e mv.", "נָקוּם", "נָבוֹא", "נָשִׂים"],
          ],
        },
      },
      {
        heading: "Andere vormen",
        content: "De imperatief, het participium en de infinitief hebben ook bijzondere vormen bij holle werkwoorden.",
        table: {
          headers: ["Vorm", "קוּם (opstaan)", "בּוֹא (komen)"],
          rows: [
            ["Imperatief m. enk.", "קוּם", "בּוֹא"],
            ["Imperatief v. enk.", "קוּמִי", "בּוֹאִי"],
            ["Imperatief m. mv.", "קוּמוּ", "בּוֹאוּ"],
            ["Participium m.", "קָם", "בָּא"],
            ["Inf. constructus", "קוּם", "בּוֹא"],
            ["Inf. absolutus", "קוֹם", "בּוֹא"],
          ],
        },
      },
      {
        heading: "Hif'il van holle werkwoorden",
        content: "In de Hif'il krijgen holle werkwoorden een bijzonder patroon. Het perfectum heeft het patroon הֵקִים (met tsere en hireq), het imperfectum יָקִים (met qamats en hireq).",
        examples: [
          { hebrew: "הֵקִים", transliteration: "heqim", dutch: "hij richtte op / stelde in", explanation: "Hif'il perf. van קום - 'doen opstaan'." },
          { hebrew: "הֵבִיא", transliteration: "hevi'", dutch: "hij bracht", explanation: "Hif'il perf. van בוא - 'doen komen / brengen'." },
          { hebrew: "הֵמִית", transliteration: "hemit", dutch: "hij doodde", explanation: "Hif'il perf. van מות - 'doen sterven'." },
          { hebrew: "וַיָּקֶם יְהוָה שֹׁפְטִים", transliteration: "wayyaqem YHWH shofetim", dutch: "en de HEER deed richters opstaan", explanation: "Richteren 2:16 - Hif'il wayyiqtol van קום." },
        ],
      },
      {
        heading: "Voorbeelden uit de Bijbel",
        content: "Holle werkwoorden zijn zeer veelvoorkomend. Werkwoorden als בוא (komen), קום (opstaan), מות (sterven), שׂים (plaatsen) en שׁוב (terugkeren) zijn onder de meest frequente in de Bijbel.",
        examples: [
          { hebrew: "וַיָּבֹא הָאִישׁ הַבָּיְתָה", transliteration: "wayyavo' ha'ish habbayetah", dutch: "en de man kwam het huis binnen", explanation: "Wayyiqtol van בוא." },
          { hebrew: "וַיָּקָם מֹשֶׁה", transliteration: "wayyaqam Mosheh", dutch: "en Mozes stond op", explanation: "Wayyiqtol van קום." },
          { hebrew: "שׁוּבוּ אֵלַי", transliteration: "shuvu 'elay", dutch: "keert terug tot mij!", explanation: "Maleachi 3:7 - imperatief van שׁוב (terugkeren)." },
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Waarom worden werkwoorden als קוּם en בּוֹא "holle werkwoorden" genoemd?',
        options: ['Ze hebben geen betekenis', 'De middelste consonant verdwijnt, waardoor ze tweeletter-werkwoorden lijken', 'Ze worden alleen in poezie gebruikt', 'Ze hebben geen perfectum-vorm'],
        correctAnswer: 'De middelste consonant verdwijnt, waardoor ze tweeletter-werkwoorden lijken',
        explanation: 'Bij holle werkwoorden (Ayin-Waw/Yod) verdwijnt de middelste consonant (ו of י) en blijft er een lange klinker over, waardoor het werkwoord "hol" lijkt.',
      },
      {
        type: 'multiple-choice',
        question: 'Wat is het imperfectum van קוּם (opstaan), 3e m. enk.?',
        options: ['קָם', 'יָקוּם', 'קוֹמֵם', 'יִקְוֹם'],
        correctAnswer: 'יָקוּם',
        explanation: 'Het imperfectum van קוּם is יָקוּם (hij zal opstaan). De lange klinker (shureq) verschijnt na het prefix.',
      },
    ],
  },
  {
    id: "bijzinnen-syntaxis",
    title: "Bijzinnen en syntaxis",
    order: 19,
    summary: "Bijbels Hebreeuws heeft een eigen woordvolgorde en zinsstructuur. Relatieve bijzinnen, conditionele zinnen en temporele constructies volgen specifieke patronen.",
    sections: [
      {
        heading: "Woordvolgorde",
        content: "De standaard woordvolgorde in Bijbels Hebreeuws proza is Werkwoord-Subject-Object (VSO). Dit verschilt van het Nederlands (SVO). In poëzie en voor nadruk kan de volgorde anders zijn. Een nominale zin (zonder werkwoord) heeft de volgorde Subject-Predicaat.",
        examples: [
          { hebrew: "בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם", transliteration: "bara' 'elohim 'et hashamayim", dutch: "God schiep de hemel", explanation: "VSO: werkwoord (בָּרָא) - subject (אֱלֹהִים) - object (הַשָּׁמַיִם)." },
          { hebrew: "טוֹב הַדָּבָר", transliteration: "tov haddavar", dutch: "het woord is goed", explanation: "Nominale zin: predicaat (טוֹב) - subject (הַדָּבָר). Geen werkwoord 'zijn' nodig." },
          { hebrew: "אֱלֹהִים בָּרָא", transliteration: "'elohim bara'", dutch: "GOD schiep (nadruk op God)", explanation: "SVO volgorde = nadruk op het subject." },
        ],
      },
      {
        heading: "Relatieve bijzinnen met אֲשֶׁר",
        content: "Relatieve bijzinnen worden ingeleid door אֲשֶׁר ('die, dat, welke, waar'). In latere teksten wordt ook שֶׁ- als prefix gebruikt. אֲשֶׁר is onverbuigbaar - het verandert niet naar geslacht, getal of naamval.",
        examples: [
          { hebrew: "הָאִישׁ אֲשֶׁר הָלַךְ", transliteration: "ha'ish 'asher halakh", dutch: "de man die ging", explanation: "אֲשֶׁר verwijst naar het subject." },
          { hebrew: "הָאָרֶץ אֲשֶׁר נָתַתִּי לָכֶם", transliteration: "ha'arets 'asher natatti lakhem", dutch: "het land dat ik jullie gaf", explanation: "אֲשֶׁר verwijst naar het object." },
          { hebrew: "הַמָּקוֹם אֲשֶׁר אַתָּה עֹמֵד עָלָיו", transliteration: "hamaqom 'asher 'attah 'omed 'alav", dutch: "de plaats waarop jij staat", explanation: "Exodus 3:5 - אֲשֶׁר + resumptief suffix (עָלָיו = 'erop')." },
        ],
      },
      {
        heading: "Conditionele zinnen (als... dan...)",
        content: "Conditionele zinnen gebruiken verschillende partikels:\n1. אִם = 'als' (reële voorwaarde)\n2. לוּ / לוּלֵא = 'als' (irreële voorwaarde, tegenfeitelijk)\n3. כִּי = 'als, wanneer' (soms conditioneel)",
        examples: [
          { hebrew: "אִם־תִּשְׁמְעוּ בְּקֹלִי", transliteration: "'im-tishme'u beqoli", dutch: "als jullie naar mijn stem zullen luisteren", explanation: "Exodus 19:5 - reële voorwaarde met אִם + imperfectum." },
          { hebrew: "לוּלֵא אֱלֹהֵי אָבִי הָיָה לִי", transliteration: "lule' 'elohe 'avi hayah li", dutch: "als de God van mijn vader niet voor mij was geweest", explanation: "Genesis 31:42 - irreële voorwaarde met לוּלֵא." },
          { hebrew: "אִם־שָׁמוֹעַ תִּשְׁמַע", transliteration: "'im-shamo'a tishma'", dutch: "als je werkelijk luistert", explanation: "Exodus 15:26 - אִם + infinitivus absolutus + imperfectum (nadruk)." },
        ],
      },
      {
        heading: "Temporele bijzinnen",
        content: "Temporele bijzinnen ('toen', 'wanneer', 'voordat', 'nadat') worden gevormd met verschillende constructies:\n1. כַּאֲשֶׁר / כִּי = 'toen, wanneer'\n2. בְּ + infinitivus constructus = 'toen...' (zeer frequent)\n3. אַחֲרֵי אֲשֶׁר / לִפְנֵי אֲשֶׁר = 'nadat / voordat'\n4. עַד אֲשֶׁר = 'totdat'\n5. טֶרֶם = 'voordat'",
        examples: [
          { hebrew: "כַּאֲשֶׁר צִוָּה יְהוָה", transliteration: "ka'asher tsivvah YHWH", dutch: "zoals/toen de HEER gebood", explanation: "Zeer frequente uitdrukking in de Pentateuch." },
          { hebrew: "בְּבוֹא אַבְרָם מִצְרַיְמָה", transliteration: "bevo' 'avram mitsraymah", dutch: "toen Abram in Egypte kwam", explanation: "Genesis 12:14 - בְּ + infinitivus constructus van בוא." },
          { hebrew: "עַד אֲשֶׁר יָשׁוּב אָחִיךָ", transliteration: "'ad 'asher yashuv 'achikha", dutch: "totdat je broer terugkeert", explanation: "Genesis 27:44 - עַד אֲשֶׁר + imperfectum." },
        ],
      },
      {
        heading: "Objectmarkeerder אֵת",
        content: "Het partikel אֵת markeert een bepaald direct object. Het heeft GEEN vertaling in het Nederlands, maar is essentieel in het Hebreeuws. אֵת wordt alleen gebruikt bij bepaalde objecten (met lidwoord, eigennaam of suffix).",
        examples: [
          { hebrew: "בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ", transliteration: "bara' 'elohim 'et hashamayim we'et ha'arets", dutch: "God schiep de hemel en de aarde", explanation: "Genesis 1:1 - אֵת markeert beide bepaalde objecten." },
          { hebrew: "וַיַּרְא אֹתוֹ", transliteration: "wayyar' 'oto", dutch: "en hij zag hem", explanation: "אֵת + suffix (3e m. enk.) = אֹתוֹ." },
          { hebrew: "שָׁמַר אֶת־הַמִּצְוָה", transliteration: "shamar 'et-hammitsvah", dutch: "hij bewaarde het gebod", explanation: "אֵת voor bepaald object met lidwoord." },
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Wat is de standaard woordvolgorde in Bijbels Hebreeuws proza?',
        options: ['Subject-Werkwoord-Object (SVO)', 'Werkwoord-Subject-Object (VSO)', 'Object-Subject-Werkwoord (OSV)', 'Subject-Object-Werkwoord (SOV)'],
        correctAnswer: 'Werkwoord-Subject-Object (VSO)',
        explanation: 'De standaard woordvolgorde in Bijbels Hebreeuws proza is VSO (Werkwoord-Subject-Object). Dit verschilt van het Nederlands (SVO).',
      },
      {
        type: 'multiple-choice',
        question: 'Waarvoor dient het partikel אֵת?',
        options: ['Het is een voorzetsel dat "met" betekent', 'Het markeert een bepaald direct object', 'Het is een voegwoord', 'Het is het onbepaald lidwoord'],
        correctAnswer: 'Het markeert een bepaald direct object',
        explanation: 'אֵת markeert een bepaald direct object. Het heeft geen vertaling in het Nederlands maar is essentieel in het Hebreeuws.',
      },
      {
        type: 'multiple-choice',
        question: 'Waarmee worden relatieve bijzinnen ingeleid?',
        options: ['כִּי', 'אֲשֶׁר', 'אִם', 'גַּם'],
        correctAnswer: 'אֲשֶׁר',
        explanation: 'Relatieve bijzinnen worden ingeleid door אֲשֶׁר ("die, dat, welke, waar"). Het is onverbuigbaar.',
      },
    ],
  },
  {
    id: "poetisch-hebreeuws",
    title: "Poetisch Hebreeuws",
    order: 20,
    summary: "Hebreeuwse poezie (Psalmen, Spreuken, Job, profeten) gebruikt parallelisme, afwijkende woordvolgorde en bijzondere vormen die verschillen van proza.",
    sections: [
      {
        heading: "Parallelisme: het basisprincipe",
        content: "Het belangrijkste kenmerk van Hebreeuwse poezie is parallelisme: een vers bestaat meestal uit twee (soms drie) regels die inhoudelijk op elkaar betrokken zijn. Robert Lowth onderscheidde drie typen, al zijn er meer nuances:\n\n1. Synoniem parallelisme: de tweede regel herhaalt de eerste met andere woorden\n2. Antithetisch parallelisme: de tweede regel staat in contrast met de eerste\n3. Synthetisch parallelisme: de tweede regel bouwt voort op de eerste",
        examples: [
          { hebrew: "הַשָּׁמַיִם מְסַפְּרִים כְּבוֹד־אֵל / וּמַעֲשֵׂה יָדָיו מַגִּיד הָרָקִיעַ", transliteration: "hashamayim mesapperim kevod-'el / uma'aseh yadav maggid haraqia'", dutch: "De hemelen vertellen Gods eer / en het firmament verkondigt het werk van Zijn handen", explanation: "Psalm 19:2 - Synoniem parallelisme: 'hemelen' // 'firmament', 'vertellen' // 'verkondigt'." },
          { hebrew: "כִּי יוֹדֵעַ יְהוָה דֶּרֶךְ צַדִּיקִים / וְדֶרֶךְ רְשָׁעִים תֹּאבֵד", transliteration: "ki yode'a YHWH derekh tsaddiqim / wederekh resha'im to'ved", dutch: "Want de HEER kent de weg van de rechtvaardigen / maar de weg van de goddelozen zal vergaan", explanation: "Psalm 1:6 - Antithetisch parallelisme: rechtvaardigen vs. goddelozen." },
          { hebrew: "הִנֵּה מַה־טּוֹב וּמַה־נָּעִים / שֶׁבֶת אַחִים גַּם־יָחַד", transliteration: "hinneh mah-tov umah-nna'im / shevet 'achim gam-yachad", dutch: "Zie, hoe goed en hoe liefelijk / is het dat broeders ook samenwonen", explanation: "Psalm 133:1 - Synthetisch parallelisme: de tweede regel vult de eerste aan." },
        ],
      },
      {
        heading: "Poetische woordvormen",
        content: "Hebreeuwse poezie gebruikt vormen die in proza zeldzaam of afwezig zijn:\n\n1. Verkorte voorzetsels: בְּמוֹ (= בְּ), לְמוֹ (= לְ), עֲלֵי (= עַל)\n2. Archaische uitgang ָמוֹ- voor 3e mv. suffix ('hun')\n3. Enclitisch מ- (een extra mem zonder betekenis)\n4. Relatief שׁ- of שֶׁ- in plaats van אֲשֶׁר\n5. Paragogische nun: יִשְׁמְרוּן in plaats van יִשְׁמְרוּ",
        examples: [
          { hebrew: "עֲלֵי עָשׂוֹר וַעֲלֵי נָבֶל", transliteration: "'ale 'asor wa'ale navel", dutch: "op de tiensnarige en op de harp", explanation: "Psalm 92:4 - עֲלֵי is poetische vorm van עַל." },
          { hebrew: "יִשְׁמְרוּן", transliteration: "yishmerun", dutch: "zij bewaken", explanation: "Paragogische nun: versterkte of poetische vorm van יִשְׁמְרוּ." },
          { hebrew: "לָמוֹ", transliteration: "lamo", dutch: "aan hen", explanation: "Poetische vorm van לָהֶם." },
        ],
      },
      {
        heading: "Afwijkende woordvolgorde in poezie",
        content: "In poezie is de woordvolgorde vrijer dan in proza. Het werkwoord hoeft niet voorop te staan. Vaak wordt een belangrijk woord naar voren geplaatst voor nadruk (fronting). Ook komt het voor dat het werkwoord helemaal ontbreekt (ellipsis).",
        examples: [
          { hebrew: "יְהוָה רֹעִי לֹא אֶחְסָר", transliteration: "YHWH ro'i lo' 'echsar", dutch: "De HEER is mijn herder, ik zal niet ontberen", explanation: "Psalm 23:1 - Nominale zin (geen werkwoord 'zijn') gevolgd door verbale zin." },
          { hebrew: "מִן־הַמֵּצַר קָרָאתִי יָּהּ", transliteration: "min-hammetsar qara'ti Yah", dutch: "vanuit de benauwdheid riep ik tot de HEER", explanation: "Psalm 118:5 - de voorzetselgroep staat voorop voor nadruk." },
          { hebrew: "אֵלַי יִקְרָא וְאֶעֱנֵהוּ", transliteration: "'elay yiqra' we'e'enehu", dutch: "tot Mij zal hij roepen en Ik zal hem antwoorden", explanation: "Psalm 91:15 - אֵלַי (tot Mij) vooraan geplaatst voor nadruk." },
        ],
      },
      {
        heading: "Chiasme en andere structuren",
        content: "Chiasme (kruisstelling) is een belangrijke structuur in Hebreeuwse poezie en ook in proza. In een chiasme worden elementen in een A-B-B'-A' patroon gerangschikt. Dit kan op woord-, zins- of zelfs hoofdstukniveau voorkomen.",
        examples: [
          { hebrew: "בַּיהוָה חָסִיתִי / אֵיךְ תֹּאמְרוּ לְנַפְשִׁי", transliteration: "baYHWH chasiti / 'ekh to'mru lenafshi", dutch: "bij de HEER schuil ik / hoe kunt u zeggen tot mijn ziel", explanation: "Psalm 11:1 - chiasme op woordniveau: voorzetselgroep-werkwoord // werkwoord-voorzetselgroep." },
          { hebrew: "שִׁמְעוּ שָׁמַיִם / וְהַאֲזִינִי אֶרֶץ", transliteration: "shim'u shamayim / weha'azini 'erets", dutch: "luistert, hemelen / en hoor toe, aarde", explanation: "Jesaja 1:2 - synoniem parallelisme met twee synoniemen voor 'luisteren'." },
        ],
      },
      {
        heading: "Beeldspraak en stijlfiguren",
        content: "Hebreeuwse poezie maakt veelvuldig gebruik van beeldspraak. Belangrijke stijlfiguren zijn:\n\n1. Metafoor: directe vergelijking zonder 'als' ('de HEER is mijn rots')\n2. Simile: vergelijking met כְּ of כְּמוֹ ('als een hert')\n3. Merisme: twee uitersten noemen om het geheel aan te duiden ('hemel en aarde' = alles)\n4. Personificatie: niet-menselijke dingen worden als personen beschreven\n5. Inclusio: een tekst begint en eindigt met dezelfde woorden/thema's",
        examples: [
          { hebrew: "יְהוָה סַלְעִי וּמְצוּדָתִי", transliteration: "YHWH sal'i umetsudati", dutch: "de HEER is mijn rots en mijn vesting", explanation: "Psalm 18:3 - metafoor: God wordt 'rots' en 'vesting' genoemd." },
          { hebrew: "כְּאַיָּל תַּעֲרֹג עַל־אֲפִיקֵי מָיִם", transliteration: "ke'ayyal ta'arog 'al-'afiqe mayim", dutch: "als een hert dat schreeuwt naar de waterbeken", explanation: "Psalm 42:2 - simile met כְּ ('als')." },
          { hebrew: "הַלְלוּ יָהּ", transliteration: "hallelu Yah", dutch: "prijs de HEER!", explanation: "Bron van 'Halleluja' - imperatief meervoud van הלל + verkorte godsnaam." },
        ],
      },
    ],
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Wat is het belangrijkste kenmerk van Hebreeuwse poezie?',
        options: ['Rijm', 'Parallelisme', 'Metrum', 'Refrein'],
        correctAnswer: 'Parallelisme',
        explanation: 'Het belangrijkste kenmerk van Hebreeuwse poezie is parallelisme: een vers bestaat uit twee of drie regels die inhoudelijk op elkaar betrokken zijn.',
      },
      {
        type: 'multiple-choice',
        question: 'Wat is synoniem parallelisme?',
        options: ['De tweede regel staat in contrast met de eerste', 'De tweede regel herhaalt de eerste met andere woorden', 'De tweede regel bouwt voort op de eerste', 'De regels vormen een kruisstelling'],
        correctAnswer: 'De tweede regel herhaalt de eerste met andere woorden',
        explanation: 'Bij synoniem parallelisme herhaalt de tweede regel de eerste met andere woorden. Voorbeeld: "De hemelen vertellen Gods eer / en het firmament verkondigt het werk van Zijn handen" (Psalm 19:2).',
      },
    ],
  },
];
