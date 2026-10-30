import type { SourceRef } from './types';

/**
 * CHAPTER V — LENGUAJE Y SOCIALES · Texto argumentativo
 *
 * Source of truth: "Ensayo Guajira - Entrega final.docx" (in
 * /public/documents). The text below is copied verbatim, including the
 * authors' spelling. The only editorial operation: a few sentences that Word
 * had split across hard line breaks are joined back into one paragraph.
 * Coordinator comments in the .docx are not part of the essay and are not shown.
 *
 * Structure: the essay names a thesis, an introduction, a context part
 * ("el marco ambiental" and "el ámbito social", in its own words), three
 * argumentative sections with their own titles (numbered I–III on the site),
 * a conclusion and a bibliography. The book and the reading mode read only
 * from this file — edit here to update both.
 */

export interface Figure {
  src: string;
  alt: string;
  /** Caption and attribution exactly as in the essay. */
  caption: string;
}

/** A source as the essay cites it in the text, linked to its bibliography entry. */
export interface Citation {
  id: string;
  /** In-text citation as written, e.g. "(Romero López y Muñoz, 2019)". */
  source: string;
  /** Matching bibliography entry, verbatim. */
  reference?: string;
  /** Optional verbatim quotation. */
  quote?: string;
}

export interface EssaySection {
  heading: string;
  paragraphs: string[];
  figures?: Figure[];
}

export interface Argument {
  title: string;
  paragraphs: string[];
  citations: Citation[];
  /** Field-notebook observations used by this argument (verbatim sentences). */
  fieldNotes?: string[];
  figures?: Figure[];
}

const ref = {
  romero: 'Romero López, A. y Muñoz, A. P. (2019). Caracterización Pueblo Indígena Wayúu. Procuraduría General de la Nación – Red Colombia Verde.',
  camarones: 'Consejos Comunitarios de Comunidades Negras El Negro Robles, Afrodescendientes de Camarones y Afrodescendientes El Rosario. (2023). Prácticas tradicionales del Pueblo Negro de Camarones. Riohacha, Guajira.',
  parques: 'Parques Nacionales Naturales de Colombia. (s. f.). Pescadores en el Santuario de Fauna y Flora Los Flamencos [Fotografía]. https://www.colparques.net/FLAMENCOS',
  museo: 'Museo Bolivariano de Arte Contemporáneo. (2016). Homenaje a la cultura wayuu en el mes de la niñez – Ilustración wayuu [Ilustración]. https://i0.wp.com/www.museobolivariano.org.co/wp-content/uploads/2016/04/homenaje-a-la-cultura-wayuu-en-el-mes-de-la-niñez-la-guajira-ilustracion-wayuu.jpg?ssl=1',
  alba: 'Alba Zero. (2013). Pintura de mujer wayuu tejiendo [Pintura]. https://albazero.wordpress.com/wp-content/uploads/2013/10/43.jpg',
};

export const essay = {
  title: 'La oferta ambiental como origen de la cultura: interacciones sociedad-naturaleza y representaciones culturales en La Guajira' as string | null,
  authors: ['Isabella Naranjo', 'Santiago Cortes', 'Daniel Sierra', 'Julieta Borda', 'Luciana Mulett'] as string[] | null,
  question:
    '¿De qué manera la oferta ambiental determina las interacciones sociedad-naturaleza, así como distintas representaciones culturales en las comunidades de la región de La Guajira?',
  thesis: 'La oferta ambiental de La Guajira es un factor determinante en los procesos de construcción y representación cultural en las comunidades wayuu.' as string | null,

  introduction: [
    'La relación entre una comunidad y su territorio nunca es casual. El espacio donde se vive no solo ofrece recursos, sino que también moldea la forma de pensar, de organizarse y de entender el mundo. En el caso de la comunidad indígena wayuu, esta conexión es especialmente profunda. Habitan un territorio extremo, marcado por la aridez, la escasez de agua y un paisaje que exige constante adaptación. Esa realidad ambiental no ha sido un obstáculo pasivo, sino el punto de partida de su cosmovisión, de sus prácticas cotidianas y de su identidad cultural.',
    'Comprender cómo la oferta ambiental de La Guajira determina las relaciones de los wayuu con su entorno y su cultura implica, en primer lugar, conocer las características físicas de ese territorio. Solo así se entiende por qué lugares como Jepira adquieren un valor sagrado, por qué los sueños guían decisiones sobre el uso del espacio y por qué elementos del paisaje aparecen en sus tejidos y en sus relatos. En otras palabras, la cultura wayuu no se construyó al margen del ambiente, sino a partir de él.',
    'Por esa razón, resulta necesario comenzar con una descripción de la oferta ambiental de La Guajira, analizando sus aspectos geológicos, físico-geográficos y climáticos e hídricos. Solo a partir de este reconocimiento del territorio es posible comprender cómo un entorno tan extremo ha dado forma a la cosmovisión espiritual de los wayuu y, a través de ella, a su manera de relacionarse con el espacio y de interpretar el mundo.',
  ] as string[] | null,

  /** Context part 1 — "el marco ambiental". */
  environment: [
    {
      heading: 'Aspectos geológicos',
      paragraphs: [
        'Es de suma importancia entender los aspectos geológicos del proceso de formación geológicos del departamento de La Guajira para encontrar la correlación entre la oferta ambiental y la construcción cultural de la comunidad indígena wayuu.',
        'La península de La Guajira es el resultado del movimiento de placas tectónicas y la acumulación de sedimentos marinos y continentales. Justificado del texto Servicio Geológico Colombiano (1958), durante el periodo Cretácico y el Terciario, el lugar experimento levantamientos y hundimientos que causaron la formación de las sierras y de las tierras planas desérticas que hoy caracterizan al departamento. La Serranía de la Macuira y otras elevaciones menores son ejemplos de lo que ocurrió.',
        'Los aspectos geológicos ayudan a explicar por qué en la Alta Guajira existen refugios de vegetación y agua en medio de un entorno hostil.',
        'Para finalizar con estos aspectos, el relieve que produce se manifiesta en la superficie a través de formas, altitudes y tipos de suelo que configuran los aspectos físico-geográficos. Por eso, al comprender la historia tectónica, es necesario pasar a describir como se organiza espacialmente esa superficie y que consecuencias tiene para la vida humana y no humana.',
      ],
    },
    {
      heading: 'Aspectos Físico – Geográficos',
      paragraphs: [
        'Los aspectos físico-geográficos son los elementos naturales que conforman la superficie de la tierra y el medio ambiente, sin la intervención directa de actividad humana.',
        'A continuación, se van a presentar y explicar los aspectos físico-geográficos de La Guajira por subregiones basados en el Boletín del Departamento Nacional de Planeación (1977)',
        'Alta Guajira: La Alta Guajira tiene pequeñas serranías de elevación promedio de 500 metros sobre el nivel del mar con características desérticas.',
        'Media Guajira: La Media Guajira es una llanura de 40 metros de elevación y con condiciones desérticas.',
        'Baja Guajira: La Baja Guajira presenta algunas zonas fértiles.',
        'El suelo, mayormente arenoso y con baja retención de humedad, es producto de la erosión constante y de la escasa cobertura vegetal. Según el Instituto Geográfico Agustín Codazzi (IGAC, 2009) los suelos de La Guajira, especialmente en La Alta y Media Guajira, son poco fértiles y bastante secos a causa del clima árido y semiárido, lo que limita de manera considerable las posibilidades de agricultura y obliga a las comunidades a adaptarse de otras maneras a su territorio.',
        'Con esto en cuenta, esta información demuestra que el departamento presenta una diversidad de paisajes y condiciones que difieren de Norte a Sur. Principalmente por diferencias en el relieve, la altitud, el clima y la fertilidad de los suelos. Estas diferencias físicas impactan directamente en la vegetación, la disponibilidad de agua, las actividades económicas y los métodos de población que se adaptan a su entorno.',
        'Para poder comprender mejor, es de buena utilidad observar el mapa de las subregiones de La Guajira (Figura 1). En esta imagen, se logran distinguir claramente tres franjas: La Alta Guajira en el norte, marcada por desierto y serranías. La Media Guajira como zona de transición y la Baja Guajira hacia el sur, con mayor presencia de sistemas hídricos y costeros.',
        'Sin embargo, el relieve y los suelos no son suficientes para explicar por sí solos la vida en La Guajira. El clima y los aspectos hídricos son los que convierten esas formas terrenales en un entorno habitable, por esta razón, después de explicar los aspectos físico-geográficos se va a continuar a analizar las condiciones climáticas e hídricas de La Guajira.',
      ],
      figures: [
        {
          src: 'images/ensayo/figura-1-subregiones.jpg',
          alt: 'Mapa en relieve de La Guajira con la Alta, Media y Baja Guajira señaladas, junto al mar Caribe.',
          caption:
            'Figura 1. Mapa de las subregiones de La Guajira: Alta, Media y Baja. Tomado de INVEMAR. (s. f.). Mapa de las subregiones de La Guajira [Mapa]. https://www.invemar.org.co/redcostera1/invemar/docs/10470guajira_baja.pdf',
        },
      ],
    },
    {
      heading: 'Aspectos climáticos e hídricos',
      paragraphs: [
        'En tercer lugar, se van a exponer los aspectos climáticos e hídricos. Estos aspectos hacen referencia a un conjunto de condiciones atmosféricas, térmicas, de viento y precipitaciones de una región, así como la disponibilidad, el movimiento y la gestión de recursos de agua, el clima de La Guajira es uno de los más secos de Colombia. Se caracteriza por las altas temperaturas, fuertes vientos y una precipitación muy escasa e irregular.',
        'En la Alta Guajira, las lluvias pueden ser inferiores a 300 o 400 milímetros anuales, a comparación del Sur, en la Media y Baja Guajira donde las lluvias aumentan progresivamente. (TodaColombia, 2019) Los arroyos y jagüeyes dependen de estas lluvias, lo que puede generar periodos de escasez prolongada. Esta realidad hídrica obliga a los indígenas a elaborar sistemas de captación de agua, la aridez no solo determina las practicas económicas, sino que al mismo tiempo alimenta una cosmovisión en la que el equilibrio con la naturaleza y el respeto por los lugares sagrados se conviertan en algo fundamental para la supervivencia y la identidad cultural.',
        'El clima actúa como un filtro que ayuda a determinar que formas de vida vegetal y animal son posibles, además de seleccionas que tipo de estrategias humanas de adaptación son viables. Es por ello que ahora se van a analizar los ecosistemas de la región.',
      ],
    },
    {
      heading: 'Ecosistemas',
      paragraphs: [
        'La Guajira cuenta con una gran diversidad de ecosistemas, resultado de las diferencias en el clima, el relieve y disponibilidad de agua entre subregiones. En la Alta Guajira predominan los ecosistemas áridos y semiáridos, con vegetación xerofita lo que significa que es el conjunto de plantas adaptadas para sobrevivir en ambientes de escasez extrema de agua. En la Media Guajira sobresalen las tierras planas, matorrales y áreas de transición entre desierto y ambientes naturales. Por otro lado, la Baja Guajira tiene la mayor disponibilidad de agua, valles fluviales y vegetación más abundante. Estos ecosistemas son fundamentales para la biodiversidad y para las comunidades indígenas wayuu, ya que proporcionan alimentos, materiales, espacios de pastoreo y recursos hídricos, además de tener significados espirituales.',
        'Hasta aquí se han presentado y explicado el marco ambiental: Aspectos geológicos, físico-geograficos, climáticos e hídricos y los ecosistemas. Ahora, se analizara el ámbito social de La Guajira ya que sin entender el la configuración del territorio no es posible entender la historia social de los Wayuu, su proceso de poblamiento y sus aspectos político-economicos.',
      ],
    },
  ] as EssaySection[],

  /** Context part 2 — "el ámbito social". */
  society: [
    {
      heading: 'Historia social de los wayuu',
      paragraphs: [
        'La historia social de los wayuu expresa una constante resistencia y adaptación. Como pueblo de origen Arawak, esto se remonta a las migraciones procedentes de la región amazónica.',
        'Para continuar, ellos lograron resistir a la conquista española durante los años 1499 y 1501. Esto, es gracias a las condiciones del desierto, que actuó como refugio natural. Las difíciles condiciones perjudicaron el control que querían ejercer los españoles sobre este territorio.',
        'Durante el siglo XVI, los wayuu adoptaron el pastoreo de ganado y desarrollaron el comercio como una manera de relación con otras culturas. En el siglo XVII protagonizaron varias rebeliones importantes contra la corona española. De acuerdo con el autor Barrera Monroy, se han registrado levantamientos como la Rebelión Guajira de 1769, en la cual los wayuu se levantaron contra los españoles después de que ellos capturaran a 22 de ellos para llevarlos a trabajar en las fortificaciones de Cartagena.',
        'En épocas más recientes han tenido que enfrentar nuevas amenazas. Un ejemplo concreto, ha de ser el inicio de operaciones en la mina de carbón del Cerrejón en la década de los 80 y ha ocasionado conflictos por el agua, el territorio y el desplazamiento de las comunidades. Además, desde la década 2010 han llegado numerosos proyectos de energía eólica que han provocado tensión y división dentro de la comunidad Wayuu.',
        'Al presentar su historia, se va a describir como se organiza espacialmente la comunidad Wayuu en el territorio. Por eso ahora se ha de continuar con el proceso de poblamiento de los Wayuu.',
      ],
    },
    {
      heading: 'Proceso de Poblamiento de los Wayuu',
      paragraphs: [
        'El proceso de poblamiento de los Wayuu, se caracteriza por asentamientos familiares dispersos conocidos como rancherías. Son grupos de viviendas separadas entre sí y son ubicadas de acuerdo con el ordenamiento social, político de la comunidad, la cosmogonía y especialmente por la necesidad de seguir la circulación de los animales. Por ejemplo, los chivos son el ganado más importante para los wayuu, estos, se mueven buscando fuentes de agua y pastos, a lo que las familias se desplazan con ellos. Una ranchería se instala en un territorio asignado por pertenencia a un clan o con la autorización de una autoridad ancestral. Las autoridades ancestrales son los lideres legítimos de la comunidad ante quienes se ejerce respeto, obediencia y admiración. (IGAC, 2024)',
        'Esto explica que, el poblamiento wayuu no es fijo y/o permanente, sino es una respuesta constante a las condiciones que ofrece un territorio.',
        'El proceso de poblamiento no esta solo marcado por la forma en la que la comunidad responde al territorio, sino que también es determinado por las reglas sociales y de parentesco que determinan quien tiene autoridad y como se resuelven los conflictos. Por esta razón se explica ahora la organización social.',
      ],
    },
    {
      heading: 'Organización Social',
      paragraphs: [
        'La organización social wayuu es basada en el linaje materno. Este, está determinado por los e’irukuu (castas) y los apüshii (clanes). Los e’irukuu son la organización creada por Maleiwa, a quien se le atribuye la creación de los wayuus, y de cada uno de ellos se desprenden varios apüshii. El apüshii está configurado por el linaje uterino (linaje materno) y es desde el cual se organiza el sistema de autoridad y decisión. (IGAC, 2024)',
        'Para entender mejor aquella estructura, el esquema del apüshii (Figura 2) representa de forma visual como el linaje materno organiza la pertenencia a los clanes y como de cada e’irukuu se desprenden varios apüshii. Este diagrama ayuda al lector ver un vistazo de la lógica jerárquica y relacional de la organización wayuu.',
        'Esta organización social tiene una dimensión política (quién decide y cómo se resuelven los conflictos) y una dimensión económica (cómo se produce y se intercambia). A continuación se presentan de manera diferenciada los aspectos políticos y económicos.',
      ],
      figures: [
        {
          src: 'images/ensayo/figura-2-apushii.jpg',
          alt: 'Diagrama del apüshii: desde la oushee (abuela materna) se desprenden las elii (madres) y el alaülaa (tío materno).',
          caption:
            'Figura 2. Esquema del apüshii (organización clanil wayuu). Tomado de Instituto Geográfico Agustín Codazzi. (2025). Figura 6. Esquema del apüshii [Diagrama]. En Territorialidad Wayuu en la Alta Guajira, Espacio Vivido. Diálogos geográficos VII. IGAC – Dirección de Investigación y Prospectiva.',
        },
      ],
    },
    {
      heading: 'Aspectos políticos y económicos',
      paragraphs: [
        'En el plano político, las autoridades ancestrales son los lideres legítimos de la comunidad, ante quienes se ejerce respeto, obediencia y admiración. El sistema de resolución de conflictos le da importancia a la palabra y el dialogo. Esta dimensión política no puede separarse de la organización social: es su expresión en el ámbito de la autoridad y la toma de decisiones.',
        'En el aspecto económico, la comunidad se sustenta principalmente por el pastoreo de chivos y ganado, la pesca artesanal, la extracción de sal y la elaboración de artesanías, en particular las mochilas. Estas actividades cambian según la subregión.',
        'En la Alta Guajira predomina el pastoreo, en la Media y Baja Guajira aparecen más actividades comerciales y de intercambio a causa de condiciones ambientales más aptas.',
        'Hasta este punto se ha mostrado cómo el territorio puede llegar a determinar la historia, el poblamiento, la organización social, la politica y la economía. Sin embargo, el vínculo más profundo entre oferta ambiental y la cultura se encuentra en la cosmovisión.',
      ],
    },
    {
      heading: 'Cosmovisión',
      paragraphs: [
        'La cosmovisión del pueblo Wayuu permite comprender la existencia, el origen de la vida, la naturaleza, el territorio, la espiritualidad y las relaciones entre los seres humanos.',
        'Justificado del texto Caracterización Wayuu, 2004 para la comunidad Wayuu, el mundo no se divide entre lo natural, lo social y lo espiritual, sino que estos ámbitos están estrictamente relacionados y forman parte de una misma realidad. Esta perspectiva permite comprender que la tierra, el agua, la fauna y flora, los fenómenos climáticos y los seres humanos coexisten de manera en la que mantienen vínculos que dan sentido a la vida.',
        'En la salida de campo, Yusandi, guía local wayuu, explicó cómo los sueños guían las decisiones familiares y comunitarias, cómo permiten interpretar señales del territorio. A través de sus relatos se hace evidente que la cosmovisión no es un conjunto abstracto de creencias, sino una forma práctica de habitar y de entender el mundo que rodea a la comunidad.',
        'Según Daza Daza y Carabalí Angola (2024), el territorio representa para los Wayuu un espacio de interacción entre lo terrenal y lo espiritual, donde se desarrolla la existencia y obtienen significado de los acontecimientos más importantes para la vida humana. Por ende, el territorio no debe entenderse únicamente como una superficie geográfica delimitada, sino como un espacio vivo que congrega la memoria de los antepasados, los conocimientos tradicionales, las creencias y las normas que guían el comportamiento de la comunidad.',
        'De acuerdo con un periódico digital de la UNAL, “El territorio, crucial para construir la identidad del pueblo wayuu” los relatos sobre el origen del universo desempeñan un papel esencial, ya que transmiten de generación en generación las explicaciones ancestrales acerca de cómo aparecieron los seres vivos.',
        'Según con el Instituto Geográfico Agustín Codazzi (IGAC), Maleiwa ocupara un lugar central como divinidad creadora, mientras que Mma, la tierra y Juya, la lluvia. En estos relatos, la lluvia visita y fecunda la tierra, de cuya relación nacen las plantas, los animales y los seres humanos lo que expresa una visión de la existencia en la que la humanidad hace parte de la naturaleza y no se encuentra separada de ella.',
        'Por ende, la tierra no se considera solamente un recurso para conseguir alimentos o construir viviendas, sino que tiene una presencia importante para el sentimiento de identidad, debido a que se vincula con los antepasados y relatos tradicionales.',
        'Otro elemento importante de la cosmovisión Wayuu es el papel de los sueños, conocidos en su lengua como lapüü. Estos, hacen parte de un universo de experiencias que pueden comunicar advertencias, orientar decisiones y fortalecer los vínculos con la dimensión espiritual. En diversas descripciones de la espiritualidad Wayuu, los sueños representan orientación y protección, por lo que pueden influir en las decisiones familiares y comunitarias. Representaciones culturales fuertes como Jepira (el Cabo de la Vela como lugar de la vida después de la muerte) y los sueños (lapü) como guías del territorio nacen precisamente de esta aridez (Romero López y Muñoz, 2019).',
      ],
    },
  ] as EssaySection[],

  arguments: [
    {
      title: 'La oferta ambiental genera prácticas culturales distintas en la Alta, Media y Baja Guajira',
      paragraphs: [
        'La diversidad ambiental  de La Guajira genera prácticas y representaciones culturales distintas en cada subregión.',
        'En la Alta Guajira, el ambiente es extremadamente seco. Las lluvias son muy escasas, los suelos son arenosos y hay poca vegetación. Esta realidad obliga a las comunidades wayuu a vivir de una manera similar a la nómada. Las rancherías se desplazan siguiendo a los chivos en busca de pastos y agua. La interacción con la naturaleza se basa en la adaptación constante y en el respeto por un territorio que se percibe como sagrado.',
        'En la Media Guajira las condiciones son de transición. Hay un poco más de humedad, aquí las prácticas se combinan: se mantiene el pastoreo, pero aparece más la agricultura como fuente de ingresos. La movilidad sigue siendo importante, aunque los asentamientos tienden a ser un poco más estables. Las representaciones culturales mantienen elementos espirituales wayuu, pero se adaptan a un entorno menos hostil (Romero López y Muñoz, 2019).',
        'En la Baja Guajira, especialmente en la zona de Camarones y el Santuario de Fauna y Flora Los Flamencos, la oferta ambiental cambia. Existen lagunas, salinas y mayor influencia del mar. Las comunidades negras afrodescendientes han desarrollado prácticas tradicionales ligadas a este entorno: pesca artesanal (de orilla, en lagunas y mar adentro), recolección de cachira, extracción de ostras y jaibas, extracción de sal, ganadería menor, agricultura familiar, ecoturismo y medicina tradicional. Estas prácticas forman parte de la identidad cultural del Pueblo Negro de Camarones y de su relación ancestral con el territorio lagunar (Consejos Comunitarios de Comunidades Negras El Negro Robles, Afrodescendientes de Camarones y Afrodescendientes El Rosario, 2023).',
        'La fotografía de los pescadores en el atardecer (Figura 3) permite observar la relación que se presento. En la imagen se ven siluetas de pescadores en el agua o en la orilla, con el cielo del atardecer de fondo, en el entorno del Santuario de Fauna y Flora Los Flamencos.',
        'La presencia humana en el agua, la hora del día (el atardecer, momento tradicional de regreso de la pesca) y el entorno natural condensan una práctica cultural que solo es posible gracias a la oferta ambiental de la Baja Guajira. La imagen ayuda a explicar aun mejor el argumento, distintas condiciones ambientales generan distintas formas de relacionarse con la naturaleza.',
      ],
      citations: [
        { id: 'a1-romero', source: '(Romero López y Muñoz, 2019)', reference: ref.romero },
        { id: 'a1-camarones', source: '(Consejos Comunitarios de Comunidades Negras El Negro Robles, Afrodescendientes de Camarones y Afrodescendientes El Rosario, 2023)', reference: ref.camarones },
        { id: 'a1-parques', source: 'Figura 3 · Parques Nacionales Naturales de Colombia (s. f.)', reference: ref.parques },
      ],
      figures: [
        {
          src: 'images/ensayo/figura-3-pescadores.jpg',
          alt: 'Siluetas de pescadores en el agua frente a un atardecer anaranjado.',
          caption:
            'Figura 3. Pescadores en el atardecer (Santuario de Fauna y Flora Los Flamencos). Tomado de Parques Nacionales Naturales de Colombia. (s. f.). Pescadores en el Santuario de Fauna y Flora Los Flamencos [Fotografía]. https://www.colparques.net/FLAMENCOS',
        },
      ],
    },
    {
      title: 'Los patrones de las mochilas wayuu como representación cultural del entorno',
      paragraphs: [
        'Una de las representaciones culturales más claras de la relación entre sociedad y naturaleza es el tejido de las mochilas (susu). Según la tradición wayuu, fue Wale’keru, la araña, quien enseñó a las mujeres a tejer. Desde entonces, cada madre transmite este conocimiento a sus hijas de generación en generación, convirtiendo el tejido en un saber ancestral profundamente ligado a la identidad femenina y a la vida comunitaria (Romero López y Muñoz, 2019).',
        'Los diseños geométricos llamados kanas no son simples adornos. Cada figura, línea y color tiene un significado: pueden representar animales del desierto, plantas, formas del paisaje, caminos, sueños o historias de la vida cotidiana. En la salida de campo, Yusandi explico que a través de estos patrones, las tejedoras expresan su cosmovisión y su forma de entender el mundo que las rodea. Además, el proceso de elaboración de una mochila implica habilidades matemáticas prácticas: se cuenta el número de puntadas, se miden los hilos, se calculan las proporciones y se organizan los diseños en el espacio.',
        'De esta manera, el tejido de las mochilas convierte el paisaje árido de La Guajira en un lenguaje visual y cultural. La mochila no solo sirve para cargar objetos; se convierte en un objeto que porta memoria, identidad y una forma particular de relacionarse con el territorio (Romero López y Muñoz, 2019).',
        'La ilustración de la niña wayuu con manta y patrones geométricos (Figura 4) ayuda a visualizarlos patrones. En la imagen se observa a una niña vestida con manta tradicional, rodeada o acompañada de diseños geométricos propios de los kanas.',
      ],
      citations: [
        { id: 'a2-romero', source: '(Romero López y Muñoz, 2019)', reference: ref.romero },
        { id: 'a2-museo', source: 'Figura 4 · Museo Bolivariano de Arte Contemporáneo (2016)', reference: ref.museo },
      ],
      fieldNotes: ['En la salida de campo, Yusandi explico que a través de estos patrones, las tejedoras expresan su cosmovisión y su forma de entender el mundo que las rodea.'],
      figures: [
        {
          src: 'images/ensayo/figura-4-nina-wayuu.jpg',
          alt: 'Ilustración en acuarela de una niña wayuu en una hamaca, rodeada de recuadros con patrones geométricos.',
          caption:
            'Figura 4. Ilustración de niña wayuu con manta y patrones geométricos. Tomado de Museo Bolivariano de Arte Contemporáneo. (2016). Homenaje a la cultura wayuu en el mes de la niñez – Ilustración wayuu [Ilustración]. https://i0.wp.com/www.museobolivariano.org.co/wp-content/uploads/2016/04/homenaje-a-la-cultura-wayuu-en-el-mes-de-la-niñez-la-guajira-ilustracion-wayuu.jpg?ssl=1',
        },
      ],
    },
    {
      title: 'La cosmovisión y las prácticas de manejo del territorio como respuesta cultural a la oferta ambiental',
      paragraphs: [
        'Tanto en las comunidades wayuu como en las negras de Camarones, la oferta ambiental ha generado formas propias de entender y manejar el territorio.',
        'Para los wayuu, el agua es el origen de los clanes. Según su cosmovisión, todos los seres de la naturaleza animales, plantas, ríos, arroyos, montes, piedras e incluso el viento son seres vivos que merecen respeto. La vida se considera sagrada y los conflictos se resuelven preferiblemente mediante el diálogo y la palabra. Esta visión surge directamente de la necesidad de vivir en un entorno extremo, donde el agua es escasa y la supervivencia depende de una relación equilibrada con el medio (Romero López y Muñoz, 2019).',
        'En la zona de Camarones, las comunidades negras afrodescendientes han desarrollado prácticas tradicionales profundamente ligadas a las lagunas, las salinas y el mar. La pesca artesanal, la recolección de cachira, la extracción de ostras y jaibas, y la extracción de sal no son solo actividades económicas: forman parte de su identidad cultural y de su forma de habitar el territorio del Santuario de Fauna y Flora Los Flamencos. Estas prácticas se transmiten de generación en generación y se entienden como un patrimonio que debe protegerse junto con el ecosistema (Consejos Comunitarios de Comunidades Negras El Negro Robles, Afrodescendientes de Camarones y Afrodescendientes El Rosario, 2023).',
      ],
      citations: [
        { id: 'a3-romero', source: '(Romero López y Muñoz, 2019)', reference: ref.romero },
        { id: 'a3-camarones', source: '(Consejos Comunitarios de Comunidades Negras El Negro Robles, Afrodescendientes de Camarones y Afrodescendientes El Rosario, 2023)', reference: ref.camarones },
        { id: 'a3-alba', source: 'Pintura · Alba Zero (2013)', reference: ref.alba },
      ],
      figures: [
        {
          src: 'images/ensayo/pintura-mujer-tejiendo.jpg',
          alt: 'Pintura de una mujer wayuu tejiendo en el centro de una telaraña, rodeada de símbolos: cactus, vivienda, luna, sol y figuras.',
          caption:
            'Pintura de mujer wayuu tejiendo rodeada de símbolos culturales. Tomado de Alba Zero. (2013). Pintura de mujer wayuu tejiendo [Pintura]. https://albazero.wordpress.com/wp-content/uploads/2013/10/43.jpg',
        },
      ],
    },
  ] as (Argument | null)[],

  conclusion: [
    'En conclusión la oferta ambiental de La Guajira determina de manera clara las interacciones entre sociedad y naturaleza, así como las distintas representaciones culturales de sus pueblos. En la Alta Guajira, la aridez extrema, la escasez de agua y los suelos poco fértiles generan una forma de vida basada en la movilidad, el pastoreo de chivos y una cosmovisión espiritual profundamente ligada al territorio, donde Jepira y los sueños (lapü) orientan las decisiones de la comunidad. En la Media Guajira las condiciones son de transición, por lo que las prácticas se vuelven mixtas: se combina el pastoreo con una agricultura más estable y mayores intercambios comerciales. En cambio, en la Baja Guajira, la presencia de lagunas, salinas y mayor influencia del mar da origen a prácticas pesqueras, salineras y de manejo costero propias del Pueblo Negro de Camarones, que se han convertido en parte fundamental de su identidad cultural.',
  ] as string[] | null,

  bibliography: [
    ref.alba,
    'Barrera Monroy, E. (2021). La rebelión Guajira de 1769 y cómo los Wayúu nunca se rindieron ante el dominio español. Contexto. https://contextomedia.com/la-rebelion-guajira-de-1769-y-como-los-wayuu-nunca-se-rindieron-ante-el-dominio-espanol/',
    ref.camarones,
    'Daza Daza, A. y Carabalí Angola, A. (2024). El territorio wayuu: espacio de interacción entre lo terrenal y lo espiritual.',
    'Departamento Nacional de Planeación. (1977). Boletín del Departamento Nacional de Planeación.',
    'Instituto Geográfico Agustín Codazzi. (2009). Estudio general de suelos y zonificación de tierras del departamento de La Guajira. Escala 1:100.000.',
    'Instituto Geográfico Agustín Codazzi. (2024). Territorialidad wayuu en la Alta Guajira, Espacio Vivido. Diálogos geográficos VII. IGAC – Dirección de Investigación y Prospectiva.',
    'Instituto Geográfico Agustín Codazzi. (2025). Territorialidad wayuu en la Alta Guajira, Espacio Vivido. Diálogos geográficos VII. IGAC – Dirección de Investigación y Prospectiva.',
    'INVEMAR. (s. f.). Mapa de las subregiones de La Guajira [Mapa]. https://www.invemar.org.co/redcostera1/invemar/docs/10470guajira_baja.pdf',
    ref.museo,
    ref.parques,
    ref.romero,
    'Servicio Geológico Colombiano. (1958). Geología de la península de La Guajira. Boletín Geológico, 6(1-3). https://revistas.sgc.gov.co/index.php/boletingeo/article/view/314/265',
    'TodaColombia. (2019). Clima del departamento de La Guajira. https://www.todacolombia.com/departamentos-de-colombia/la-guajira/clima.html',
    'Universidad Nacional de Colombia. (s. f.). El territorio, crucial para construir la identidad del pueblo wayuu. Periódico digital UNAL.',
  ] as string[] | null,
  ibConcepts: null as string[] | null,
  /** Original file for download. */
  file: 'documents/ensayo-guajira-entrega-final.docx' as string | null,
  /** Resources proposed by the school (not necessarily the ones chosen). */
  proposedResources: [
    {
      label: 'Territorialidad wayuu en la Alta Guajira. Instituto Geográfico Agustín Codazzi.',
      provenance: 'Red Textual · Sociales',
    },
    {
      label: 'Salinas de Manaure. Tradición wayuu y modernización.',
      url: 'https://d1b4gd4m8561gs.cloudfront.net/sites/default/files/publicaciones/archivos/DTSER35-Salinas.pdf',
      provenance: 'Red Textual · Sociales',
    },
    {
      label: 'Prácticas tradicionales del pueblo negro de Camarones.',
      url: 'https://fairatie.com/wp-content/uploads/2023/10/Practicas-tradicionales-del-Pueblo-Negro-de-Camarones.pdf',
      provenance: 'Red Textual · Sociales',
    },
    {
      label: '“El pueblo Wayuu y sus luchas por el territorio y la identidad cultural”. Laura Calle Alzate.',
      url: 'https://revistas.unal.edu.co/index.php/ccaribe/article/view/118679',
      provenance: 'Red Textual · Lenguaje',
    },
    {
      label: '“Bilingüismo y realidad sociolingüística de la lengua del grupo Wayuu en el caribe colombiano”.',
      provenance: 'Red Textual · Lenguaje',
    },
  ] as SourceRef[],
};
