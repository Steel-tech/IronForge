/**
 * Adds ironworkers local union data to state-registry.ts
 * Run: node scripts/add-union-data.mjs
 */
import { readFileSync, writeFileSync } from "fs";

const UNION_DATA = {
  AL: {
    locals: [
      { name: "Ironworkers Local 92", number: "92", city: "Birmingham", url: "https://www.ironworkers.org/", phone: "(205) 251-6678", jurisdiction: "Alabama" },
    ],
    dc: "District Council of the Southeast",
    notes: "Local 92 covers Alabama. Contact the local to inquire about signatory agreements and apprenticeship programs.",
  },
  AK: {
    locals: [
      { name: "Ironworkers Local 751", number: "751", city: "Anchorage", url: "https://www.prior751.com/", phone: "(907) 272-4851", jurisdiction: "Alaska" },
    ],
    dc: "District Council of the Pacific Northwest",
    notes: "Local 751 covers all of Alaska. Strong demand for ironworkers on oil/gas and military construction projects.",
  },
  AZ: {
    locals: [
      { name: "Ironworkers Local 75", number: "75", city: "Phoenix", url: "https://www.ironworkers75.org/", phone: "(602) 253-0202", jurisdiction: "Arizona" },
    ],
    dc: "District Council of the Western States",
    notes: "Local 75 covers Arizona. Phoenix metro has a growing construction market with union opportunities.",
  },
  AR: {
    locals: [
      { name: "Ironworkers Local 584", number: "584", city: "Tulsa/Little Rock", url: "https://www.ironworkers.org/", phone: "(918) 627-0261", jurisdiction: "Arkansas and eastern Oklahoma" },
    ],
    dc: "District Council of Mid-South",
    notes: "Local 584 covers Arkansas. Industrial and infrastructure projects are primary union work in the state.",
  },
  CA: {
    locals: [
      { name: "Ironworkers Local 433", number: "433", city: "Los Angeles", url: "https://www.ironworkers433.org/", phone: "(323) 264-5901", jurisdiction: "Southern California" },
      { name: "Ironworkers Local 377", number: "377", city: "San Francisco", url: "https://www.ironworkers377.org/", phone: "(415) 285-4455", jurisdiction: "Northern California" },
      { name: "Ironworkers Local 118", number: "118", city: "Sacramento", url: "https://www.ironworkers118.org/", phone: "(916) 383-8480", jurisdiction: "Central/Northern California inland" },
    ],
    dc: "District Council of California & Vicinity",
    notes: "California has multiple ironworkers locals. Largest union ironwork market in the US. Strong prevailing wage enforcement means union rates are competitive. AISC-certified union fabrication shops throughout the state.",
  },
  CO: {
    locals: [
      { name: "Ironworkers Local 24", number: "24", city: "Denver", url: "https://www.ironworkers24.org/", phone: "(303) 297-0267", jurisdiction: "Colorado and Wyoming" },
    ],
    dc: "District Council of the Rocky Mountain Area",
    notes: "Local 24 covers Colorado and Wyoming. Denver's Front Range construction boom means strong union ironwork demand. Local 24 has an active apprenticeship program.",
  },
  CT: {
    locals: [
      { name: "Ironworkers Local 15", number: "15", city: "Hartford", url: "https://www.iwlocal15.org/", phone: "(860) 296-1513", jurisdiction: "Connecticut" },
    ],
    dc: "District Council of New England States",
    notes: "Local 15 covers Connecticut. Strong union presence in construction. Prevailing wage work is significant.",
  },
  DE: {
    locals: [
      { name: "Ironworkers Local 401", number: "401", city: "Philadelphia", url: "https://www.iwlocal401.org/", phone: "(215) 676-3000", jurisdiction: "Delaware, southern New Jersey, eastern Pennsylvania" },
    ],
    dc: "District Council of Mid-Atlantic States",
    notes: "Local 401 covers Delaware (along with southern NJ and eastern PA). Proximity to Philadelphia drives union construction work.",
  },
  FL: {
    locals: [
      { name: "Ironworkers Local 402", number: "402", city: "West Palm Beach", url: "https://www.ironworkers402.com/", phone: "(561) 842-8242", jurisdiction: "Southern Florida" },
      { name: "Ironworkers Local 808", number: "808", city: "Orlando", url: "https://www.iwlocal808.org/", phone: "(407) 422-3417", jurisdiction: "Central Florida" },
      { name: "Ironworkers Local 597", number: "597", city: "Jacksonville", url: "https://www.ironworkers.org/", phone: "(904) 724-0271", jurisdiction: "Northern Florida" },
    ],
    dc: "District Council of the Southeast",
    notes: "Florida has multiple ironworkers locals covering different regions. No state income tax makes take-home pay attractive. Hurricane reconstruction and theme park construction are major markets.",
  },
  GA: {
    locals: [
      { name: "Ironworkers Local 387", number: "387", city: "Atlanta", url: "https://www.iw387.org/", phone: "(404) 361-0353", jurisdiction: "Georgia" },
    ],
    dc: "District Council of the Southeast",
    notes: "Local 387 covers Georgia. Atlanta metro is one of the fastest-growing construction markets in the Southeast.",
  },
  HI: {
    locals: [
      { name: "Ironworkers Local 625", number: "625", city: "Honolulu", url: "https://www.ironworkers.org/", phone: "(808) 847-1658", jurisdiction: "Hawaii" },
    ],
    dc: "District Council of the Pacific Northwest",
    notes: "Local 625 covers all of Hawaii. Military base construction and resort/hotel projects are primary union markets.",
  },
  ID: {
    locals: [
      { name: "Ironworkers Local 732", number: "732", city: "Boise/Pocatello", url: "https://www.ironworkers.org/", phone: "(208) 344-8253", jurisdiction: "Idaho" },
    ],
    dc: "District Council of the Pacific Northwest",
    notes: "Local 732 covers Idaho. Growing Boise metro and industrial projects drive demand.",
  },
  IL: {
    locals: [
      { name: "Ironworkers Local 1", number: "1", city: "Chicago", url: "https://www.iwlocal1.com/", phone: "(312) 269-9820", jurisdiction: "Chicago and northern Illinois" },
      { name: "Ironworkers Local 46", number: "46", city: "Springfield", url: "https://www.ironworkers.org/", phone: "(217) 528-4517", jurisdiction: "Central and southern Illinois" },
    ],
    dc: "District Council of Chicago and Vicinity",
    notes: "Local 1 in Chicago is one of the oldest and largest ironworkers locals in the country. Illinois has strong prevailing wage on all public works. Chicago is one of the top union construction markets in the US.",
  },
  IN: {
    locals: [
      { name: "Ironworkers Local 22", number: "22", city: "Indianapolis", url: "https://www.iwlocal22.org/", phone: "(317) 635-8564", jurisdiction: "Indiana" },
    ],
    dc: "District Council of Great Lakes Area",
    notes: "Local 22 covers Indiana. Industrial and manufacturing construction are key markets.",
  },
  IA: {
    locals: [
      { name: "Ironworkers Local 67", number: "67", city: "Des Moines", url: "https://www.ironworkers.org/", phone: "(515) 276-4049", jurisdiction: "Iowa" },
    ],
    dc: "District Council of North Central States",
    notes: "Local 67 covers Iowa. Renewable energy (wind farms) and agricultural facilities drive ironwork demand.",
  },
  KS: {
    locals: [
      { name: "Ironworkers Local 10", number: "10", city: "Kansas City", url: "https://www.iwlocal10.org/", phone: "(816) 561-7804", jurisdiction: "Kansas and western Missouri" },
    ],
    dc: "District Council of Mid-South",
    notes: "Local 10 covers Kansas (and western Missouri). Kansas City metro area straddles both states.",
  },
  KY: {
    locals: [
      { name: "Ironworkers Local 70", number: "70", city: "Louisville", url: "https://www.ironworkerslocal70.com/", phone: "(502) 452-1424", jurisdiction: "Kentucky" },
    ],
    dc: "District Council of the Southeast",
    notes: "Local 70 covers Kentucky. River bridge construction and industrial facilities are key markets.",
  },
  LA: {
    locals: [
      { name: "Ironworkers Local 58", number: "58", city: "New Orleans", url: "https://www.ironworkers.org/", phone: "(504) 733-9432", jurisdiction: "Louisiana" },
    ],
    dc: "District Council of the Southeast",
    notes: "Local 58 covers Louisiana. Petrochemical/refinery construction and LNG facilities provide strong union ironwork opportunities.",
  },
  ME: {
    locals: [
      { name: "Ironworkers Local 7", number: "7", city: "Boston/New England", url: "https://www.iwlocal7.org/", phone: "(617) onal-7744", jurisdiction: "Maine, New Hampshire, Vermont, Massachusetts" },
    ],
    dc: "District Council of New England States",
    notes: "Local 7 covers Maine (along with other New England states). Bath Iron Works (shipbuilding) is a significant ironwork employer.",
  },
  MD: {
    locals: [
      { name: "Ironworkers Local 5", number: "5", city: "Washington DC/Maryland", url: "https://www.ironworkerslocal5.com/", phone: "(301) 459-1190", jurisdiction: "Maryland, District of Columbia, Virginia" },
    ],
    dc: "District Council of Mid-Atlantic States",
    notes: "Local 5 covers Maryland, DC, and Virginia. Massive federal construction market. Pentagon, military bases, and government buildings provide steady union ironwork.",
  },
  MA: {
    locals: [
      { name: "Ironworkers Local 7", number: "7", city: "Boston", url: "https://www.iwlocal7.org/", phone: "(617) 524-7744", jurisdiction: "Massachusetts and New England" },
    ],
    dc: "District Council of New England States",
    notes: "Local 7 covers Massachusetts. Boston has one of the strongest union construction markets in the US. Strong prevailing wage enforcement.",
  },
  MI: {
    locals: [
      { name: "Ironworkers Local 25", number: "25", city: "Detroit", url: "https://www.ironworkers25.org/", phone: "(248) 344-3480", jurisdiction: "Michigan" },
    ],
    dc: "District Council of Great Lakes Area",
    notes: "Local 25 covers Michigan. Automotive plant construction, bridge work, and manufacturing facilities are key markets. Prevailing wage was restored in 2024.",
  },
  MN: {
    locals: [
      { name: "Ironworkers Local 512", number: "512", city: "Minneapolis", url: "https://www.ironworkers512.org/", phone: "(612) 378-1855", jurisdiction: "Minnesota, North Dakota, South Dakota" },
    ],
    dc: "District Council of North Central States",
    notes: "Local 512 covers Minnesota (plus ND and SD). Minneapolis-St. Paul metro has strong union construction. Seasonal work due to climate.",
  },
  MS: {
    locals: [
      { name: "Ironworkers Local 619", number: "619", city: "Jackson/Gulf Coast", url: "https://www.ironworkers.org/", phone: "(601) 354-2458", jurisdiction: "Mississippi" },
    ],
    dc: "District Council of the Southeast",
    notes: "Local 619 covers Mississippi. Gulf Coast petrochemical and shipbuilding work are primary union markets.",
  },
  MO: {
    locals: [
      { name: "Ironworkers Local 396", number: "396", city: "St. Louis", url: "https://www.iwlocal396.org/", phone: "(314) 781-2555", jurisdiction: "Eastern Missouri and southern Illinois" },
      { name: "Ironworkers Local 10", number: "10", city: "Kansas City", url: "https://www.iwlocal10.org/", phone: "(816) 561-7804", jurisdiction: "Western Missouri and Kansas" },
    ],
    dc: "District Council of Mid-South",
    notes: "Missouri is split between Local 396 (St. Louis area) and Local 10 (Kansas City area). Both metros have active union ironwork markets.",
  },
  MT: {
    locals: [
      { name: "Ironworkers Local 732", number: "732", city: "Butte/Billings", url: "https://www.ironworkers.org/", phone: "(406) 723-5320", jurisdiction: "Montana" },
    ],
    dc: "District Council of the Pacific Northwest",
    notes: "Montana ironworkers often travel for work. Mining, energy, and infrastructure projects provide union opportunities.",
  },
  NE: {
    locals: [
      { name: "Ironworkers Local 21", number: "21", city: "Omaha", url: "https://www.ironworkers.org/", phone: "(402) 553-4174", jurisdiction: "Nebraska and western Iowa" },
    ],
    dc: "District Council of North Central States",
    notes: "Local 21 covers Nebraska. Omaha metro and industrial construction are primary markets.",
  },
  NV: {
    locals: [
      { name: "Ironworkers Local 433", number: "433", city: "Las Vegas", url: "https://www.ironworkers433.org/", phone: "(702) 452-1336", jurisdiction: "Southern Nevada" },
      { name: "Ironworkers Local 118", number: "118", city: "Reno", url: "https://www.ironworkers118.org/", phone: "(916) 383-8480", jurisdiction: "Northern Nevada" },
    ],
    dc: "District Council of California & Vicinity",
    notes: "Las Vegas is one of the hottest union ironwork markets in the US. Casino/resort construction, stadium projects, and infrastructure provide massive opportunities. Local 433 dispatch is very active.",
  },
  NH: {
    locals: [
      { name: "Ironworkers Local 7", number: "7", city: "Boston/New England", url: "https://www.iwlocal7.org/", phone: "(617) 524-7744", jurisdiction: "New Hampshire, Massachusetts, Maine, Vermont" },
    ],
    dc: "District Council of New England States",
    notes: "Local 7 covers New Hampshire. Power plant and bridge construction are key ironwork markets.",
  },
  NJ: {
    locals: [
      { name: "Ironworkers Local 11", number: "11", city: "Newark", url: "https://www.ironworkerslocal11.com/", phone: "(973) 344-2444", jurisdiction: "Northern New Jersey" },
      { name: "Ironworkers Local 399", number: "399", city: "Camden", url: "https://www.iwlocal399.org/", phone: "(856) 966-2011", jurisdiction: "Southern New Jersey" },
    ],
    dc: "District Council of Mid-Atlantic States",
    notes: "New Jersey has two ironworkers locals. NYC metro spillover drives northern NJ work. Major infrastructure (bridges, tunnels, transit) provides steady union ironwork.",
  },
  NM: {
    locals: [
      { name: "Ironworkers Local 495", number: "495", city: "Albuquerque", url: "https://www.ironworkers.org/", phone: "(505) 345-3455", jurisdiction: "New Mexico" },
    ],
    dc: "District Council of the Western States",
    notes: "Local 495 covers New Mexico. National laboratories (Sandia, Los Alamos), military installations (Kirtland, White Sands, Holloman), and renewable energy projects provide union ironwork opportunities.",
  },
  NY: {
    locals: [
      { name: "Ironworkers Local 40", number: "40", city: "New York City", url: "https://www.local40.org/", phone: "(212) 889-1800", jurisdiction: "New York City and vicinity (structural)" },
      { name: "Ironworkers Local 580", number: "580", city: "New York City", url: "https://www.local580.org/", phone: "(212) 594-0854", jurisdiction: "New York City and vicinity (ornamental/architectural)" },
      { name: "Ironworkers Local 6", number: "6", city: "Buffalo", url: "https://www.ironworkerslocal6.com/", phone: "(716) 893-1886", jurisdiction: "Western New York" },
      { name: "Ironworkers Local 12", number: "12", city: "Albany", url: "https://www.ironworkerslocal12.org/", phone: "(518) 785-4641", jurisdiction: "Eastern New York" },
    ],
    dc: "District Council of New York",
    notes: "New York has the most active union ironwork market in the US. Local 40 (structural) and Local 580 (ornamental) in NYC are legendary. NYC requires union labor on most major projects. Connectors and raising gangs are in constant demand.",
  },
  NC: {
    locals: [
      { name: "Ironworkers Local 848", number: "848", city: "Charlotte/Raleigh", url: "https://www.ironworkers.org/", phone: "(704) 596-0405", jurisdiction: "North Carolina" },
    ],
    dc: "District Council of the Southeast",
    notes: "Local 848 covers North Carolina. Growing Charlotte and Raleigh-Durham markets. Right-to-work state but union presence growing in commercial/industrial construction.",
  },
  ND: {
    locals: [
      { name: "Ironworkers Local 512", number: "512", city: "Minneapolis", url: "https://www.ironworkers512.org/", phone: "(612) 378-1855", jurisdiction: "North Dakota, Minnesota, South Dakota" },
    ],
    dc: "District Council of North Central States",
    notes: "Local 512 covers North Dakota from Minneapolis. Oil/energy infrastructure in the Bakken region has driven ironwork demand.",
  },
  OH: {
    locals: [
      { name: "Ironworkers Local 17", number: "17", city: "Cleveland", url: "https://www.ironworkers17.org/", phone: "(216) 771-1001", jurisdiction: "Northern Ohio" },
      { name: "Ironworkers Local 44", number: "44", city: "Cincinnati", url: "https://www.iwlocal44.org/", phone: "(513) 351-0200", jurisdiction: "Southern Ohio" },
      { name: "Ironworkers Local 172", number: "172", city: "Columbus", url: "https://www.ironworkers172.org/", phone: "(614) 224-4424", jurisdiction: "Central Ohio" },
    ],
    dc: "District Council of Great Lakes Area",
    notes: "Ohio has multiple ironworkers locals. Strong prevailing wage enforcement. Columbus is one of the fastest-growing markets. Manufacturing and bridge construction are key.",
  },
  OK: {
    locals: [
      { name: "Ironworkers Local 584", number: "584", city: "Tulsa", url: "https://www.ironworkers.org/", phone: "(918) 627-0261", jurisdiction: "Oklahoma and Arkansas" },
    ],
    dc: "District Council of Mid-South",
    notes: "Local 584 covers Oklahoma. Energy sector (oil/gas, refineries, wind farms) drives ironwork demand.",
  },
  OR: {
    locals: [
      { name: "Ironworkers Local 29", number: "29", city: "Portland", url: "https://www.ironworkers29.org/", phone: "(503) 774-0777", jurisdiction: "Oregon and southwestern Washington" },
    ],
    dc: "District Council of the Pacific Northwest",
    notes: "Local 29 covers Oregon and SW Washington. Portland metro has active union construction. Prevailing wage work on public projects ($50K+). Strong apprenticeship program.",
  },
  PA: {
    locals: [
      { name: "Ironworkers Local 401", number: "401", city: "Philadelphia", url: "https://www.iwlocal401.org/", phone: "(215) 676-3000", jurisdiction: "Eastern Pennsylvania, southern New Jersey, Delaware" },
      { name: "Ironworkers Local 3", number: "3", city: "Pittsburgh", url: "https://www.iwlocal3.com/", phone: "(412) 261-3063", jurisdiction: "Western Pennsylvania" },
    ],
    dc: "District Council of Mid-Atlantic States",
    notes: "Pennsylvania has two major locals. Philadelphia (Local 401) and Pittsburgh (Local 3) are both strong union ironwork markets. Separations Act means union subs get direct contracts on public work. Bridge and industrial construction are major markets.",
  },
  RI: {
    locals: [
      { name: "Ironworkers Local 37", number: "37", city: "Providence", url: "https://www.ironworkerslocal37.org/", phone: "(401) 751-6539", jurisdiction: "Rhode Island" },
    ],
    dc: "District Council of New England States",
    notes: "Local 37 covers Rhode Island. Small state but active naval construction (submarine base) and bridge work.",
  },
  SC: {
    locals: [
      { name: "Ironworkers Local 709", number: "709", city: "Savannah/Charleston", url: "https://www.ironworkers.org/", phone: "(912) 233-0406", jurisdiction: "South Carolina and coastal Georgia" },
    ],
    dc: "District Council of the Southeast",
    notes: "Local 709 covers South Carolina. Right-to-work state but nuclear power, military bases, and port construction provide union opportunities.",
  },
  SD: {
    locals: [
      { name: "Ironworkers Local 512", number: "512", city: "Minneapolis", url: "https://www.ironworkers512.org/", phone: "(612) 378-1855", jurisdiction: "South Dakota, Minnesota, North Dakota" },
    ],
    dc: "District Council of North Central States",
    notes: "Local 512 covers South Dakota from Minneapolis. Infrastructure and energy projects drive demand.",
  },
  TN: {
    locals: [
      { name: "Ironworkers Local 492", number: "492", city: "Nashville", url: "https://www.ironworkers.org/", phone: "(615) 242-2032", jurisdiction: "Tennessee" },
    ],
    dc: "District Council of the Southeast",
    notes: "Local 492 covers Tennessee. Nashville's construction boom has increased union ironwork demand. TVA projects and industrial construction are key markets.",
  },
  TX: {
    locals: [
      { name: "Ironworkers Local 263", number: "263", city: "Dallas/Fort Worth", url: "https://www.ironworkers263.com/", phone: "(214) 748-1637", jurisdiction: "North Texas" },
      { name: "Ironworkers Local 84", number: "84", city: "Houston", url: "https://www.iw84.org/", phone: "(713) 672-2681", jurisdiction: "South Texas and Gulf Coast" },
      { name: "Ironworkers Local 482", number: "482", city: "Austin/San Antonio", url: "https://www.ironworkers.org/", phone: "(512) 385-5225", jurisdiction: "Central Texas" },
    ],
    dc: "District Council of Texas and Mid-South",
    notes: "Texas has multiple ironworkers locals. Largest construction market in the US by volume. No state income tax. Right-to-work state but industrial/petrochemical/refinery work is heavily union. LNG export facilities on the Gulf Coast are major projects.",
  },
  UT: {
    locals: [
      { name: "Ironworkers Local 27", number: "27", city: "Salt Lake City", url: "https://www.ironworkers27.org/", phone: "(801) 972-3344", jurisdiction: "Utah" },
    ],
    dc: "District Council of the Rocky Mountain Area",
    notes: "Local 27 covers Utah. Wasatch Front construction boom, data center construction, and mining/industrial projects drive union ironwork.",
  },
  VT: {
    locals: [
      { name: "Ironworkers Local 7", number: "7", city: "Boston/New England", url: "https://www.iwlocal7.org/", phone: "(617) 524-7744", jurisdiction: "Vermont, Massachusetts, Maine, New Hampshire" },
    ],
    dc: "District Council of New England States",
    notes: "Local 7 covers Vermont. Bridge and infrastructure projects are primary ironwork markets.",
  },
  VA: {
    locals: [
      { name: "Ironworkers Local 5", number: "5", city: "Washington DC", url: "https://www.ironworkerslocal5.com/", phone: "(301) 459-1190", jurisdiction: "Virginia, Maryland, District of Columbia" },
      { name: "Ironworkers Local 28", number: "28", city: "Richmond", url: "https://www.ironworkerslocal28.org/", phone: "(804) 358-0880", jurisdiction: "Central and southern Virginia" },
    ],
    dc: "District Council of Mid-Atlantic States",
    notes: "Virginia is covered by Local 5 (NoVA/DC metro) and Local 28 (Richmond/southern VA). Federal construction around DC and military bases (Norfolk naval, Quantico, Ft. Belvoir) provide strong union ironwork demand.",
  },
  WA: {
    locals: [
      { name: "Ironworkers Local 86", number: "86", city: "Seattle", url: "https://www.ironworkers86.org/", phone: "(206) 324-4742", jurisdiction: "Western Washington" },
      { name: "Ironworkers Local 14", number: "14", city: "Spokane", url: "https://www.ironworkers14.org/", phone: "(509) 535-0877", jurisdiction: "Eastern Washington and northern Idaho" },
    ],
    dc: "District Council of the Pacific Northwest",
    notes: "Local 86 covers the Seattle metro and western WA. Local 14 covers eastern WA and northern ID. Seattle is a top-tier union ironwork market. Tech campus construction (Amazon, Microsoft, Google) and infrastructure projects drive demand. Strong apprenticeship programs.",
  },
  WV: {
    locals: [
      { name: "Ironworkers Local 301", number: "301", city: "Charleston", url: "https://www.ironworkers.org/", phone: "(304) 925-1171", jurisdiction: "West Virginia" },
    ],
    dc: "District Council of Mid-Atlantic States",
    notes: "Local 301 covers West Virginia. Chemical/industrial plant construction and bridge work are primary union markets.",
  },
  WI: {
    locals: [
      { name: "Ironworkers Local 8", number: "8", city: "Milwaukee", url: "https://www.iwlocal8.org/", phone: "(414) 671-0174", jurisdiction: "Wisconsin" },
    ],
    dc: "District Council of Great Lakes Area",
    notes: "Local 8 covers Wisconsin. Milwaukee and Madison metros have active union construction. Manufacturing and brewery/food processing facility construction are notable markets.",
  },
  WY: {
    locals: [
      { name: "Ironworkers Local 24", number: "24", city: "Denver", url: "https://www.ironworkers24.org/", phone: "(303) 297-0267", jurisdiction: "Wyoming and Colorado" },
    ],
    dc: "District Council of the Rocky Mountain Area",
    notes: "Local 24 covers Wyoming (from Denver). Energy sector (coal, oil/gas, wind) and mining construction drive ironwork demand. Workers may need to travel significant distances.",
  },
};

// Read the file
const file = readFileSync("content/state-registry.ts", "utf-8");

let result = file;

for (const [code, data] of Object.entries(UNION_DATA)) {
  const localsStr = JSON.stringify(data.locals).replace(/"/g, '"');
  const insertStr = `    ironworkersLocals: ${JSON.stringify(data.locals, null, 6).replace(/\n/g, '\n    ')},
    districtCouncil: "${data.dc}",
    unionNotes: "${data.notes.replace(/"/g, '\\"')}",`;
  
  // Find the barAssociationUrl line for this state and insert after it
  const pattern = new RegExp(`(  ${code}: \\{[\\s\\S]*?barAssociationUrl: "[^"]*",)`, 'm');
  const match = result.match(pattern);
  if (match) {
    result = result.replace(match[1], match[1] + '\n' + insertStr);
  } else {
    console.log(`WARNING: Could not find ${code} in registry`);
  }
}

writeFileSync("content/state-registry.ts", result);
console.log("Done! Added union data to all states.");
