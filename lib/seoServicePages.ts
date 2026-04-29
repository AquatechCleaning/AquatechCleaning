export type SeoServicePage = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  sections: Array<{ title: string; body: string }>;
  faqs: Array<{ question: string; answer: string }>;
};

export const seoServicePages: SeoServicePage[] = [
  {
    slug: "pressure-washing-cape-town",
    title: "Pressure Washing Cape Town",
    metaTitle: "Pressure Washing Cape Town | Driveways, Paving & Exterior Cleaning",
    metaDescription:
      "Professional pressure washing in Cape Town for driveways, paving, patios, walls and exterior surfaces. Get an instant Aquatech Cleaning quote online.",
    h1: "Pressure washing in Cape Town",
    intro:
      "Aquatech Cleaning provides professional pressure washing for Cape Town homes and businesses, with the right pressure, detergents and surface preparation for each job.",
    sections: [
      {
        title: "Built for Cape Town exterior surfaces",
        body:
          "Driveways, paving, patios and walls collect algae, grime, tyre marks and coastal residue. We clean hard exterior surfaces with controlled pressure washing that removes buildup without treating every surface the same.",
      },
      {
        title: "Where pressure washing works best",
        body:
          "Pressure washing is ideal for concrete, brick paving, stone, many patios and selected boundary walls. More delicate surfaces are assessed first and may be soft washed instead.",
      },
      {
        title: "Fast online quoting",
        body:
          "Use the quote tool to measure your driveway, patio or paving on the map. The system calculates the area and applies Aquatech pricing immediately.",
      },
    ],
    faqs: [
      {
        question: "Do you pressure wash all exterior surfaces?",
        answer: "No. We assess the material first. Hard surfaces may be pressure washed, while painted, tiled or delicate surfaces may need soft washing.",
      },
      {
        question: "Can pressure washing remove algae from paving?",
        answer: "Yes. Pressure washing is effective for algae, grime and organic buildup on most paving and driveway surfaces.",
      },
      {
        question: "Do you work across Cape Town?",
        answer: "Yes. We service Cape Town and surrounding areas including the Southern Suburbs, Atlantic Seaboard, Northern Suburbs and nearby towns.",
      },
    ],
  },
  {
    slug: "soft-washing-cape-town",
    title: "Soft Washing Cape Town",
    metaTitle: "Soft Washing Cape Town | Safe Roof, Wall & Exterior Cleaning",
    metaDescription:
      "Specialist soft washing in Cape Town for roofs, walls and delicate exterior surfaces. Remove algae, lichen and organic growth safely.",
    h1: "Soft washing in Cape Town",
    intro:
      "Soft washing uses low pressure and the correct cleaning solution to treat organic growth on roofs, walls and delicate exterior surfaces without relying on force.",
    sections: [
      {
        title: "Safer for roofs and painted surfaces",
        body:
          "Many Cape Town properties need cleaning that protects coatings, tiles and waterproofing. Soft washing targets algae, lichen and mould while reducing the risk of pressure damage.",
      },
      {
        title: "Longer-lasting organic growth treatment",
        body:
          "Soft washing treats the source of staining instead of only blasting the visible layer away. This helps keep exterior surfaces cleaner for longer.",
      },
      {
        title: "Pressure washing where appropriate",
        body:
          "We use pressure washing and soft washing together where it makes sense. The surface determines the method, not a one-size-fits-all process.",
      },
    ],
    faqs: [
      {
        question: "Is soft washing safe for roof tiles?",
        answer: "Soft washing is generally safer than high pressure on roof tiles, but each roof is assessed for condition, access and material first.",
      },
      {
        question: "What does soft washing remove?",
        answer: "It is used for algae, mould, lichen, mildew and organic staining on suitable exterior surfaces.",
      },
      {
        question: "Is soft washing the same as pressure washing?",
        answer: "No. Soft washing uses low pressure and cleaning chemistry. Pressure washing uses higher water pressure for hard surfaces.",
      },
    ],
  },
  {
    slug: "roof-cleaning-cape-town",
    title: "Roof Cleaning Cape Town",
    metaTitle: "Roof Cleaning Cape Town | Soft Wash Roof Cleaning",
    metaDescription:
      "Professional roof cleaning in Cape Town using soft washing and suitable pressure cleaning methods for tile, metal and exterior roof surfaces.",
    h1: "Roof cleaning in Cape Town",
    intro:
      "Aquatech Cleaning cleans Cape Town roofs affected by algae, lichen, moss, dirt and coastal residue, using the method best suited to the roof surface.",
    sections: [
      {
        title: "Roof cleaning without guesswork",
        body:
          "A roof is not a driveway. We consider access, pitch, tile condition, waterproofing and surrounding runoff before choosing the cleaning method.",
      },
      {
        title: "Soft washing for organic growth",
        body:
          "Soft washing is often the preferred method for treating roof algae and lichen because it uses low pressure and targets growth at the source.",
      },
      {
        title: "Quote from the map",
        body:
          "Use the online quote tool to draw your roof area. The quote system measures the square metres and applies the current roof-cleaning rate.",
      },
    ],
    faqs: [
      {
        question: "Can roof cleaning damage tiles?",
        answer: "Incorrect high-pressure cleaning can damage some roofs. We select the method based on roof material and condition.",
      },
      {
        question: "Do you clean gutters with roof cleaning?",
        answer: "Gutter cleaning can be quoted as a separate service when you build your quote.",
      },
      {
        question: "How often should a Cape Town roof be cleaned?",
        answer: "It depends on shade, trees, moisture and coastal exposure. Many properties benefit from inspection every 12 to 24 months.",
      },
    ],
  },
  {
    slug: "driveway-cleaning-cape-town",
    title: "Driveway Cleaning Cape Town",
    metaTitle: "Driveway Cleaning Cape Town | Paving, Patio & Pressure Washing",
    metaDescription:
      "Driveway cleaning and paving pressure washing in Cape Town. Remove dirt, algae, tyre marks and grime from exterior hard surfaces.",
    h1: "Driveway cleaning in Cape Town",
    intro:
      "We clean driveways, paving and patios across Cape Town with surface-appropriate pressure washing and preparation for a cleaner, safer entrance.",
    sections: [
      {
        title: "Cleaner paving and better kerb appeal",
        body:
          "Driveways are often the first surface people notice. Cleaning removes dark buildup, algae, sand, dirt and tyre marks that make paving look tired.",
      },
      {
        title: "Reduce slippery exterior areas",
        body:
          "Organic growth on shaded paving and patios can become slippery. Regular cleaning helps improve surface safety around the property.",
      },
      {
        title: "Measure and quote online",
        body:
          "Draw the driveway or paving area on the quote map and submit your details. You can also enter the square metres manually.",
      },
    ],
    faqs: [
      {
        question: "Can you clean brick paving?",
        answer: "Yes. Brick paving is one of the common surfaces we clean, subject to condition and drainage.",
      },
      {
        question: "Do you clean patios as well as driveways?",
        answer: "Yes. Patios, paving and driveways can be quoted through the same driveway and paving cleaning service.",
      },
      {
        question: "Will driveway cleaning remove every stain?",
        answer: "Most dirt, algae and surface grime can be improved significantly. Oil, rust and deep staining may need extra treatment.",
      },
    ],
  },
];

export const getSeoServicePage = (slug: string) => seoServicePages.find((page) => page.slug === slug);
