import type { DocumentAsset, SourceRef } from './types';

/**
 * CHAPTER II — BIOLOGY + CHEMISTRY · Scientific poster (English)
 *
 * Source of truth: "Los Flamencos — Póster e infografía conectados — Grupo 1.png"
 * ("Coastal Lagoons, Fishing & Water Quality"). Every string below is
 * transcribed verbatim from the poster, including its citations. The page
 * renders this text; it does not paraphrase it.
 */

export interface HabitatRow {
  element: string;
  role: string;
  threat: string;
}

export interface FieldPhoto {
  src: string;
  alt: string;
  /** Caption exactly as printed on the poster. */
  caption: string;
}

export const science = {
  title: 'Coastal Lagoons, Fishing & Water Quality',
  subtitle: 'Los Flamencos Sanctuary · Camarones, La Guajira · Biology + Chemistry - Case Number 1',
  authors: ['Daniel Sierra', 'Julieta Borda', 'Luciana Mulett', 'Santiago Cortes', 'Isabella Naranjo'],
  affiliation: 'Grade 9 Colegio Colombo Americano CAS',

  researchQuestion:
    'How do the natural resources and ecosystem services available in La Guajira shape society–nature interactions and cultural representations among its communities?',

  objective: [
    'This is a study that revolves around the research of how the availability and specifications of water are associated with biodiversity, human activity and customs in La Guajira through the use of field information along with trustworthy documentary sources.',
    'It will revolve around the coastal lagoons of the sanctuary, the fishes/crustaceans of the lagoons, and the fishing practices of the locals.',
  ],

  place:
    'The Santuario de Fauna y Flora Los Flamencos located at Camarones in La Guajira region protects some coastal lagoons, including the Navío Quebrado and the Laguna Grande lagoons. The waters of lagoons provide habitat for fish, crustaceans and waterbirds, and these habitats are linked to some local fishing and guiding activities. (Parques Nacionales Naturales de Colombia, n.d.)',
  challenge:
    'Challenge of conservation: the degradation of habitat or water quality may lead to the disruption of food chains of aquaculture and fishing. For instance, pollution may come from the fuel entering the water. (NOAA, n.d.)',

  methods: [
    {
      label: 'Research in the Field',
      text: 'We have gathered notes of our visit to Los Flamencos Sanctuary located in the town of Camarones. Our notes included information about coastal lagoons, mangroves, dry forests along with data regarding flamingos’ migration habits, their feeding techniques as well as water depth.',
    },
    {
      label: 'Research via Documentation',
      text: 'We researched the information which we found in Daza-Daza et al. (2018), the sanctuary’s official website and video, as well as the scientific papers related to chemistry in general that explain the properties of water and fuel polarity and density.',
    },
    {
      label: 'Data Analysis',
      text: 'We have summarized different inputs from our group into a scientific model that includes a table connecting the properties of water and the importance of the biodiversity in the region with local fishing practices in the area.',
    },
  ],

  /** Section 5 · Results: Biology & Ecological Evidence (table). */
  habitat: [
    {
      element: 'Lagoon water & wetland habitat',
      role: 'Food, shelter and conditions for aquatic organisms and waterbirds.',
      threat: 'Prevent waste and habitat disturbance. (EPA, n.d.)',
    },
    {
      element: 'Fish & crustaceans',
      role: 'Aquatic food-web links and resources for local fishing.',
      threat: 'Protect water quality; eggs and larvae can be vulnerable to oil. (NOAA, n.d.)',
    },
    {
      element: 'Flamingos & waterbirds',
      role: 'Wetlands provide feeding and resting areas for resident or migratory birds.',
      threat: 'Oil can reduce waterproofing of feathers. (NOAA, n.d.)',
    },
  ] as HabitatRow[],

  /** Section 5 · Chemistry: Polarity + Density. */
  chemistry:
    'Water is a POLAR substance while fuels are primarily NON-POLAR mixtures of hydrocarbons. Their molecular compositions clarify why they have difficulty in blending into each other. Density determines where layers are found: pure water has a density of approximately 1,000 kg/m³ at 4 °C and gasoline has densities between 715 and 780 kg/m³. Many fuel structures usually have lower density, and therefore would stay at the top or float. (Biology LibreTexts, n.d.; iAgua, n.d.; Engineering ToolBox, n.d.)',
  /** Values used by the interactive model — only the poster's figures. */
  layers: {
    water: { label: 'WATER | polar', polarity: 'Polar', density: 'approximately 1,000 kg/m³ at 4 °C' },
    fuel: { label: 'FUEL | mainly non-polar', polarity: 'Primarily non-polar mixtures of hydrocarbons', density: 'Gasoline: between 715 and 780 kg/m³' },
  },
  modelTitle: 'Conceptual model — not a local measurement',
  modelChain: 'Water chemistry → Pollution behavior → Organisms → Fishing',
  modelCaption: 'Figure 3. Simplified fuel-water layers. Original diagram for this poster.',

  /** Section 6 · Discussion & Integrated Analysis. */
  discussion:
    'Water features that define the lagoon food web: water bodies provide habitat for fish and crustaceans that are linked to bird and fishing activities. The chemistry of petroleum in the water explains how a hypothetical film can expose the species to toxic substances. The article from 2018 describes the Wayuu water management traditions across La Guajira and how the traditions adapt to fluctuations in water availability, but it does not say that all communities do things in the same way. (Daza-Daza et al., 2018; NOAA, n.d.)',
  limitations:
    'Limitations: no site-specific chemical analyses or confirmed fuel spills. Our data refer to water and gasoline as opposed to measurements from any lagoon with salt or brackish water. This is a conservation model, not a result from laboratory testing',

  /** Section 7 · Conclusion. */
  conclusion:
    'In Los Flamencos, the state of the coastal lagoons correlates the biodiversity of the lagoons with both fishing activities and life in the local communities. As a result, conservation of the lagoon waters can contribute both to the organisms found in the lagoons and the economic well-being of the local people. The community decisions are also affected by culture, knowledge about the environment and conservation rules.',

  /** Section 8 · Conservation Proposal. */
  conservation: {
    heading: 'CLEAN LAGOON, SAFE FISHING — a proposed prevention plan:',
    actions: [
      'Local fishers, guides and park staff identify safe fuel-handling routines away from lagoon margins.',
      'Visitors avoid releasing waste, and community members report accidental spills rapidly.',
      'Combine park conservation guidance with community knowledge of sensitive habitats.',
    ],
    benefit: 'Expected benefit: healthier water, wildlife and fishing livelihoods.',
    limit: 'Limit: participation, resources, training and consultation are necessary.',
  },

  /** Field evidence · original visit photographs (cropped from the poster at native size). */
  photos: [
    {
      src: 'images/ciencias/figure-1-wildlife.jpg',
      alt: 'Flamingos and other birds flying over the lagoon water under a cloudy sky.',
      caption: 'Figure 1. Wild life in the Sanctuary Photographer: Daniel Felipe Sierra Quintero Date: 26/07/2026',
    },
    {
      src: 'images/ciencias/figure-2-boat.jpg',
      alt: 'The bow of a wooden boat on the brown water of the lagoon.',
      caption: 'Figure 2. Boat in the Sanctuary Photographer: Sophia Leguizamo Date: 26/07/2026',
    },
  ] as FieldPhoto[],

  poster: {
    title: 'Coastal Lagoons, Fishing & Water Quality',
    src: 'documents/coastal-lagoons-fishing-water-quality.png',
    downloadSrc: 'documents/coastal-lagoons-fishing-water-quality.png',
    kind: 'image',
    alt: 'Scientific poster “Coastal Lagoons, Fishing & Water Quality” about Los Flamencos Sanctuary, Camarones, La Guajira.',
  } as DocumentAsset,

  /**
   * Condensed wording for the interactive chapter. Every line summarises the
   * poster above (same facts, citations and limits); nothing is added. The
   * complete poster stays in Resources.
   */
  summary: {
    objective: 'How water availability and quality connect biodiversity, fishing and local customs in Los Flamencos Sanctuary.',
    approach: 'Field notes from our visit, checked against trustworthy documentary sources.',
    place: 'In Camarones, the sanctuary protects coastal lagoons such as Navío Quebrado and Laguna Grande.',
    placeLink: 'Their waters shelter fish, crustaceans and waterbirds — and sustain local fishing and guiding.',
    methods: [
      { label: 'Field research', text: 'Notes on lagoons, mangroves, dry forest, flamingo habits and water depth.' },
      { label: 'Documentation', text: 'Daza-Daza et al. (2018), the sanctuary’s website and video, and chemistry sources on polarity and density.' },
      { label: 'Analysis', text: 'A model linking water properties, biodiversity and local fishing.' },
    ],
    web: ['Water quality', 'Lagoon habitat', 'Fish & crustaceans', 'Waterbirds', 'Local fishing'],
    challenge: 'If habitat or water quality degrades, lagoon food chains — and fishing — can be disrupted. Fuel entering the water is one possible source of pollution. (NOAA, n.d.)',
    chemistry: 'Water is polar; fuels are mainly non-polar hydrocarbons, so the two do not mix. Being less dense, fuel stays on top.',
    ideas: [
      { title: 'A shared base', text: 'Lagoon water is habitat for fish and crustaceans, which link to birds and fishing.' },
      { title: 'A floating risk', text: 'Because fuel floats on water, a hypothetical film could expose species to toxic substances.' },
      { title: 'Culture adapts', text: 'Wayuu water traditions adapt to changing water availability — not every community in the same way. (Daza-Daza et al., 2018)' },
    ],
    limits: 'No site-specific chemical analyses or confirmed spills: a conservation model, not a laboratory result.',
    actions: ['Safe fuel handling away from lagoon margins.', 'No waste released; accidental spills reported quickly.', 'Park guidance combined with community knowledge of sensitive habitats.'],
    benefit: 'Healthier water, wildlife and fishing livelihoods.',
    limit: 'It needs participation, resources, training and consultation.',
    conclusion: 'Conserving the lagoon waters supports both its organisms and the well-being of local people.',
    conclusionNote: 'Community decisions are also shaped by culture, environmental knowledge and conservation rules.',
  },

  /** Section 9 · References (APA 7), verbatim. */
  references: [
    { label: 'Daza-Daza, A. R., Rodríguez-Valencia, N., & Carabalí-Angola, A. (2018). El recurso agua en las comunidades indígenas Wayuu de La Guajira colombiana. Parte 1: Una mirada desde los saberes y prácticas ancestrales. Información Tecnológica, 29(6), 13–24.', url: 'https://doi.org/10.4067/S0718-07642018000600013', provenance: 'Poster · References (APA 7)' },
    { label: 'Parques Nacionales Naturales de Colombia. (n.d.). Santuario de Fauna y Flora Los Flamencos.', url: 'https://old.parquesnacionales.gov.co/portal/es/ecoturismo/parques/region-caribe/santuario-de-fauna-y-flora-los-flamencos/', provenance: 'Poster · References (APA 7)' },
    { label: 'Parques Nacionales Naturales de Colombia. (n.d.). Santuario de Fauna y Flora Los Flamencos realidad virtual [Video]. YouTube.', url: 'https://www.youtube.com/watch?v=n-DsTZh5hpU', provenance: 'Poster · References (APA 7)' },
    { label: 'Biology LibreTexts. (n.d.). Water: Water’s polarity.', url: 'https://bio.libretexts.org/Bookshelves/Introductory_and_General_Biology/General_Biology_(Boundless)/02%3A_The_Chemical_Foundation_of_Life/2.11%3A_Water_-_Waters_Polarity', provenance: 'Poster · References (APA 7)' },
    { label: 'Engineering ToolBox. (n.d.). Fuels – Densities and specific volumes.', url: 'https://www.engineeringtoolbox.com/fuels-densities-specific-volumes-d_166.html', provenance: 'Poster · References (APA 7)' },
    { label: 'iAgua. (n.d.). ¿Cuál es la densidad del agua?', url: 'https://www.iagua.es/respuestas/cual-es-densidad-agua', provenance: 'Poster · References (APA 7)' },
    { label: 'National Oceanic and Atmospheric Administration. (n.d.). How does oil impact marine life?', url: 'https://oceanservice.noaa.gov/facts/oilimpacts.html', provenance: 'Poster · References (APA 7)' },
    { label: 'NOAA Office of Response and Restoration. (n.d.). How oil harms animals and plants in marine environments.', url: 'https://response.restoration.noaa.gov/oil-and-chemical-spills/oil-spills/how-oil-harms-animals-and-plants-marine-environments.html', provenance: 'Poster · References (APA 7)' },
    { label: 'U.S. Environmental Protection Agency. (n.d.). Wetlands.', url: 'https://www.epa.gov/report-environment/wetlands', provenance: 'Poster · References (APA 7)' },
    { label: 'Oil & Gas Journal. (n.d.). Crude oil polarity measures quality, predicts behavior.', url: 'https://www.ogj.com/home/article/17238437/crude-oil-polarity-measures-quality-predicts-behavior', provenance: 'Poster · References (APA 7)' },
  ] as SourceRef[],
};
