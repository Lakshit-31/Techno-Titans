const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Category = require("./models/Category");
const City = require("./models/City");
const Event = require("./models/Event");
const Showtime = require("./models/Showtime");
const Seat = require("./models/Seat");
const Booking = require("./models/Booking");
const Review = require("./models/Review");

dotenv.config();

const CITIES = [
  { name: "Mumbai", slug: "mumbai", isActive: true },
  { name: "Delhi", slug: "delhi", isActive: true },
  { name: "Bengaluru", slug: "bengaluru", isActive: true },
  { name: "Hyderabad", slug: "hyderabad", isActive: true },
  { name: "Chennai", slug: "chennai", isActive: true },
  { name: "Pune", slug: "pune", isActive: true },
  { name: "Kolkata", slug: "kolkata", isActive: true },
  { name: "Ahmedabad", slug: "ahmedabad", isActive: true },
  { name: "Jaipur", slug: "jaipur", isActive: true },
  { name: "Udaipur", slug: "udaipur", isActive: true },
];

const CITY_VENUES = {
  Mumbai: {
    movies: [
      "PVR INOX IMAX, Phoenix Lower Parel",
      "Cinepolis, Viviana Mall Thane",
      "PVR ECX, Kurla Marketcity",
      "INOX, Nariman Point",
      "Carnival Cinemas, Wadala",
    ],
    concerts: [
      "DY Patil Stadium, Navi Mumbai",
      "Jio World Garden, BKC",
      "NESCO Center, Goregaon",
      "Mahalaxmi Racecourse",
      "Nita Mukesh Ambani Cultural Centre",
    ],
    comedy: [
      "Shanmukhananda Hall, Sion",
      "The Habitat, Khar",
      "Bal Gandharva Rang Mandir, Bandra",
      "NCPA, Nariman Point",
      "Canvas Dramatic Club, Lower Parel",
    ],
    sports: [
      "Mumbai Football Arena, Andheri",
      "Wankhede Stadium, Churchgate",
      "Brabourne Stadium",
      "COOP Arena, Powai",
      "Turf Park, Mahalaxmi",
    ],
    workshops: [
      "Culinary Craft Studio, Bandra West",
      "WeWork BKC, Mumbai",
      "Design Fabric Studio, Lower Parel",
      "The Maker Studio, Juhu",
      "ISDI School of Design, Parel",
    ],
  },
  Delhi: {
    movies: [
      "PVR Director’s Cut, Vasant Kunj",
      "PVR Anupam, Saket",
      "INOX, Nehru Place",
      "Delite Cinema, Daryaganj",
      "PVR Plaza, Connaught Place",
    ],
    concerts: [
      "Jawaharlal Nehru Stadium Grounds",
      "Indira Gandhi Arena, ITO",
      "Siri Fort Open Air Theatre",
      "Major Dhyan Chand Stadium",
      "Talkatora Stadium Grounds",
    ],
    comedy: [
      "Siri Fort Auditorium, New Delhi",
      "The Comedy Store, DLF CyberHub",
      "Kamani Auditorium, Mandi House",
      "Akshara Theatre, Baba Kharak Singh Marg",
      "Habitat Centre, Lodhi Road",
    ],
    sports: [
      "Arun Jaitley Cricket Stadium",
      "Indira Gandhi Indoor Stadium",
      "Karni Singh Shooting Range",
      "Major Dhyan Chand Hockey Stadium",
      "Yamuna Sports Complex",
    ],
    workshops: [
      "Innov8 Coworking, Connaught Place",
      "Design Village, Noida",
      "Craft Council Studio, Hauz Khas",
      "Tinkering Lab, Saket",
      "Studio 21, Cyber City",
    ],
  },
  Bengaluru: {
    movies: [
      "PVR Forum Mall, Koramangala",
      "PVR Gold Class, Orion Mall Rajajinagar",
      "INOX, Garuda Mall Magrath Road",
      "Cinepolis, Nexus Shantiniketan",
      "UrVashi Theatre, Lalbagh Road",
    ],
    concerts: [
      "Manyata Tech Park Amphitheatre",
      "Manpho Convention Center, Nagavara",
      "Jayamahal Palace Grounds",
      "Phoenix Marketcity Courtyard",
      "UB City Amphitheatre",
    ],
    comedy: [
      "Chowdiah Memorial Hall, Malleshwaram",
      "The Comedy Club, Koramangala",
      "Good Shepherd Auditorium, Museum Road",
      "Jagriti Theatre, Whitefield",
      "Bhoomika Theatre, Jayanagar",
    ],
    sports: [
      "M. Chinnaswamy Stadium",
      "Kanteerava Indoor Stadium",
      "Bangalore Football Stadium",
      "Padukone-Dravid Centre for Sports Excellence",
      "Kicks on Fire Turf, HSR Layout",
    ],
    workshops: [
      "Indiranagar Tech Hub Auditorium",
      "WeWork Galaxy, MG Road",
      "Workbench Projects, Ulsoor",
      "Culinary Academy, Koramangala",
      "Clay Station Pottery, HSR Layout",
    ],
  },
  Hyderabad: {
    movies: [
      "Prasads IMAX Screen 1, Banjara Hills",
      "AMB Cinemas, Gachibowli",
      "PVR Next Galleria, Panjagutta",
      "Cinepolis, Mantra Mall Attapur",
      "INOX, GVK One Mall",
    ],
    concerts: [
      "Gachibowli Outdoor Arena",
      "Hitex Exhibition Centre, Madhapur",
      "NTR Stadium Grounds",
      "Cyber Convention Center",
      "Chowmahalla Palace Courtyard",
    ],
    comedy: [
      "Shilpakala Vedika, HITECH City",
      "The Habitat, Jubilee Hills",
      "Ravindra Bharathi Auditorium",
      "Bhartiya Vidya Bhavan, King Koti",
      "Comic Den, Madhapur",
    ],
    sports: [
      "Gachibowli Indoor Stadium",
      "Rajiv Gandhi International Cricket Stadium",
      "Lal Bahadur Shastri Stadium",
      "Kotla Vijay Bhaskar Reddy Indoor Stadium",
      "Sports Village, Financial District",
    ],
    workshops: [
      "T-Hub Phase 2 Auditorium",
      "WeWork Krishe Emerald, Kondapur",
      "Hyderabad Art Society, Madhapur",
      "Culinary Studio, Jubilee Hills",
      "Maker Guild, Begumpet",
    ],
  },
  Chennai: {
    movies: [
      "SPI Palazzo, Forum Vijaya Mall",
      "Sathyam Cinemas, Royapettah",
      "AGS Cinemas, T. Nagar",
      "PVR VR Chennai, Anna Nagar",
      "Rohini Silver Screens, Koyambedu",
    ],
    concerts: [
      "YMCA Grounds, Royapettah",
      "Jawaharlal Nehru Stadium",
      "Island Grounds, Park Town",
      "Kalakshetra Foundation Open Air",
      "Chennai Trade Centre, Nandambakkam",
    ],
    comedy: [
      "Music Academy TTK Road",
      "Museum Theatre, Egmore",
      "Sir Mutha Venkatasubba Rao Hall, Chetpet",
      "The Medai Cultural Space, Alwarpet",
      "Alliance Française, Nungambakkam",
    ],
    sports: [
      "MA Chidambaram Stadium, Chepauk",
      "Jawaharlal Nehru Stadium Complex",
      "SDAT Tennis Stadium, Nungambakkam",
      "Velodrome Complex, Guindy",
      "Mayor Radhakrishnan Hockey Stadium",
    ],
    workshops: [
      "IIT Madras Research Park Auditorium",
      "The Hive Co-working, Anna Nagar",
      "Ekam Art Studio, Mylapore",
      "Chef Academy, Besant Nagar",
      "Chitra Kala Crafts, Adyar",
    ],
  },
  Pune: {
    movies: [
      "PVR Market City, Viman Nagar",
      "Cinepolis, Seasons Mall Hadapsar",
      "INOX, Elpro City Square Chinchwad",
      "Victory Theatre, Camp",
      "PVR Westend Mall, Aundh",
    ],
    concerts: [
      "Mahalaxmi Lawns, Karve Nagar",
      "Sunny’s World Amphitheatre, Bavdhan",
      "Piramal Lawns, Hadapsar",
      "Pyramid Lawns, Koregaon Park",
      "Balewadi Stadium Grounds",
    ],
    comedy: [
      "Bal Gandharva Ranga Mandir, JM Road",
      "The House of Comedy, Koregaon Park",
      "Yashwantrao Chavan Natyagruha, Kothrud",
      "Tilak Smarak Mandir, Sadashiv Peth",
      "Classic Rock Coffee Co, Kalyani Nagar",
    ],
    sports: [
      "Balewadi Sports Complex Auditorium",
      "MCA International Cricket Stadium, Gahunje",
      "Nehru Stadium Pune",
      "Deccan Gymkhana Turf",
      "Poona Club Grounds",
    ],
    workshops: [
      "Viman Nagar Co-Working Hub",
      "Kirloskar Institute Campus",
      "The Desk Co-working, Baner",
      "Arts & Crafts Collective, Aundh",
      "Baking Studio, Kalyani Nagar",
    ],
  },
  Kolkata: {
    movies: [
      "INOX Quest Mall, Park Street",
      "PVR Mani Square, Kankurgachi",
      "Nandan Cinema Complex, Rabindra Sadan",
      "PVR South City, Jadavpur",
      "Star Theatre, Hatibagan",
    ],
    concerts: [
      "Nicco Park Grounds, Salt Lake",
      "Aquatica Water Park Grounds, Rajarhat",
      "Science City Amphitheatre",
      "Mohor Kunja Park Grounds",
      "Netaji Indoor Stadium",
    ],
    comedy: [
      "Kala Mandir Theatre, Theatre Road",
      "Mahajati Sadan, MG Road",
      "G D Birla Sabhagar, Ballygunge",
      "Nazrul Mancha, Rabindra Sarobar",
      "The Laugh Store, Park Street",
    ],
    sports: [
      "Eden Gardens Stadium",
      "Salt Lake Stadium (VYBK)",
      "Netaji Indoor Stadium",
      "Calcutta Rowing Club Grounds",
      "CC&FC Grounds, Ballygunge",
    ],
    workshops: [
      "Science City Auditorium",
      "Design Innovation Centre, Salt Lake",
      "Kolkata Arts Studio, New Town",
      "Culinary Hub, Southern Avenue",
      "Bishwatma Craft Hub, Alipore",
    ],
  },
  Ahmedabad: {
    movies: [
      "PVR Acropolis Mall, Thaltej",
      "Cinepolis, Alpha One Mall Vastrapur",
      "WIDE ANGLE Cinema, SG Highway",
      "INOX, Himalaya Mall Drive-In",
      "PVR Arved Transcube, Ranip",
    ],
    concerts: [
      "Sabarmati Riverfront Event Ground",
      "EKA Arena Outdoor Grounds",
      "Gujarat University Convention Centre",
      "GMDC Ground, Drive-In Road",
      "Sardar Patel Stadium Grounds",
    ],
    comedy: [
      "Pandit Deendayal Upadhyay Auditorium",
      "Tagore Memorial Hall, Paldi",
      "The Comedy Factory, Bodakdev",
      "Town Hall, Ashram Road",
      "HK Hall, Ashram Road",
    ],
    sports: [
      "Narendra Modi Stadium, Motera",
      "EKA Arena by TransStadia",
      "Sardar Vallabhbhai Patel Indoor Stadium",
      "Ahmedabad Racquet Club",
      "Gujarat Police Hockey Stadium",
    ],
    workshops: [
      "iCreate Innovation Hub, SG Highway",
      "Design Village Campus, Gandhinagar",
      "Craft & Heritage Center, Old City",
      "Creative Culinary Kitchen, Prahlad Nagar",
      "TechHub Ahmedabad, Satellite",
    ],
  },
  Jaipur: {
    movies: [
      "INOX Crystal Palm, C-Scheme",
      "Raj Mandir Cinema, Bhagwan Das Road",
      "PVR World Trade Park, Malviya Nagar",
      "Cinepolis, Triton Mall Jhotwara",
      "Fun Cinema, Mansarovar",
    ],
    concerts: [
      "Jaipur Exhibition & Convention Centre (JECC)",
      "SMS Stadium Grounds",
      "Albert Hall Museum Lawns",
      "Entertainment Paradise Open Air",
      "Chokhi Dhani Cultural Grounds",
    ],
    comedy: [
      "Birla Auditorium, Statue Circle",
      "Maharana Pratap Auditorium",
      "Jawahar Kala Kendra, JLN Marg",
      "Ravindra Manch, Ram Niwas Garden",
      "The Laughter Club, Vaishali Nagar",
    ],
    sports: [
      "Sawai Mansingh Stadium",
      "Rajasthan Cricket Academy Ground",
      "Chogan Stadium, Gangori Bazaar",
      "Jaipur Polo Club Grounds",
      "SMS Indoor Sports Complex",
    ],
    workshops: [
      "Rajasthan Innovation Hub, Malviya Nagar",
      "Jawahar Kala Kendra Craft Studio",
      "Blue Pottery Collective, Sanganer",
      "Heritage Culinary School, C-Scheme",
      "Digital Academy, Raja Park",
    ],
  },
  Udaipur: {
    movies: [
      "PVR Celebration Mall, Bhuwana",
      "INOX Lake City Mall, Ashok Nagar",
      "Picture Palace, Surajpole",
      "Miraj Bioscope, Sukher",
      "PVR Urban Square Mall",
    ],
    concerts: [
      "Fateh Sagar Lakefront Amphitheatre",
      "Shilpgram Crafts Village Grounds",
      "City Palace Zenana Mahal Courtyard",
      "Bhartiya Lok Kala Mandal Open Air",
      "Field Club Lawns",
    ],
    comedy: [
      "Maharana Pratap Auditorium, City Center",
      "Town Hall Theatre, Saheli Marg",
      "Lake City Laugh Club, Panchwati",
      "Sukhadia Circle Amphitheatre",
      "Cultural Center Auditorium",
    ],
    sports: [
      "Udaipur Polo Grounds, Manek Chowk",
      "Khel Gaon Sports Complex, Chitrakoot",
      "MB Cricket Stadium",
      "Lake City Turf Arena",
      "Fateh High School Grounds",
    ],
    workshops: [
      "Fateh Sagar Lake Front Studio",
      "Shilpgram Traditional Crafts Workshop",
      "Udaipur Art Residency, Saheli Nagar",
      "Royal Heritage Baking Kitchen",
      "Visual Storytelling Hub, Hiran Magri",
    ],
  },
};

const MOVIE_TEMPLATES = [
  {
    titlePattern: (city) =>
      `Interstellar - IMAX 70mm Special Screening (${city})`,
    desc: "Experience Christopher Nolan Sci-Fi masterpiece on the largest IMAX screen with immersive 12-channel surround sound.",
    banner:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1000",
    lang: "English",
    duration: 169,
    price: 450,
  },
  {
    titlePattern: (city) => `Oppenheimer - 4K Remastered Experience (${city})`,
    desc: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    banner:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1000",
    lang: "English",
    duration: 180,
    price: 380,
  },
  {
    titlePattern: (city) => `Dune: Part Two - IMAX Experience (${city})`,
    desc: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    banner:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1000",
    lang: "English",
    duration: 166,
    price: 420,
  },
  {
    titlePattern: (city) => `Avatar: The Way of Water 3D (${city})`,
    desc: "Jake Sully lives with his newfound family formed on the planet of Pandora in this visual masterpiece.",
    banner:
      "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1000",
    lang: "English & Hindi",
    duration: 192,
    price: 350,
  },
  {
    titlePattern: (city) => `Spider-Man: Across the Spider-Verse (${city})`,
    desc: "Teen Miles Morales becomes the Spider-Man of his universe and must join with spider-powered heroes across dimensions.",
    banner:
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=1000",
    lang: "English",
    duration: 140,
    price: 320,
  },
];

const CONCERT_TEMPLATES = [
  {
    titlePattern: (city) => `Coldplay - Music Of The Spheres Live in ${city}`,
    desc: "The iconic global band brings their groundbreaking stadium tour with LED wristbands, laser lights, and legendary anthems.",
    banner:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000",
    lang: "English",
    duration: 180,
    price: 2500,
  },
  {
    titlePattern: (city) =>
      `A.R. Rahman Live in Concert - Soul of India (${city})`,
    desc: "Experience the Oscar-winning maestro live with a 50-piece symphony orchestra performing timeless Indian melodies.",
    banner:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1000",
    lang: "Tamil & Hindi",
    duration: 210,
    price: 1800,
  },
  {
    titlePattern: (city) => `Sunburn Festival Arena Tour - ${city}`,
    desc: "Asia largest Electronic Dance Music festival features top international DJs, pyro displays, and non-stop beats.",
    banner:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1000",
    lang: "English",
    duration: 300,
    price: 1500,
  },
  {
    titlePattern: (city) => `Prateek Kuhad - Silhouettes Tour (${city})`,
    desc: "Indie acoustic sensation Prateek Kuhad sings intimate fan-favorites including Cold/Mess and Kasoor live.",
    banner:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=1000",
    lang: "Hindi & English",
    duration: 120,
    price: 1200,
  },
  {
    titlePattern: (city) => `Coke Studio Bharat Live Showcase - ${city}`,
    desc: "Fusion folk and contemporary Indian pop coming together live with legendary folk artists and breakthrough indie acts.",
    banner:
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=1000",
    lang: "Hindi & Regional",
    duration: 180,
    price: 999,
  },
];

const COMEDY_TEMPLATES = [
  {
    titlePattern: (city) => `Anubhav Singh Bassi - Live Standup in ${city}`,
    desc: "Laugh till your stomach hurts with Bassi latest 90-minute hilarious solo special packed with raw, relatable storytelling.",
    banner:
      "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&q=80&w=1000",
    lang: "Hindi",
    duration: 90,
    price: 799,
  },
  {
    titlePattern: (city) => `Zakir Khan - Tathastu & Beyond (${city})`,
    desc: "The master of storytelling Zakir Khan brings Sakht Launda humor and heartwarming poetry live on stage.",
    banner:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1000",
    lang: "Hindi",
    duration: 100,
    price: 999,
  },
  {
    titlePattern: (city) => `Vir Das - Mind Fool World Tour (${city})`,
    desc: "Emmy award winning comedian Vir Das delivers sharp observational wit and global political humor.",
    banner:
      "https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&q=80&w=1000",
    lang: "English",
    duration: 90,
    price: 850,
  },
  {
    titlePattern: (city) => `Abhishek Upmanyu - Jealous of Sabjiwala (${city})`,
    desc: "Fast-paced punchlines and hilarious everyday anxieties presented by Abhishek Upmanyu.",
    banner:
      "https://images.unsplash.com/photo-1561489413-985b06da5bee?auto=format&fit=crop&q=80&w=1000",
    lang: "Hindi",
    duration: 80,
    price: 699,
  },
  {
    titlePattern: (city) => `Kanan Gill - Is This It? Live in ${city}`,
    desc: "Existential comedy and razor-sharp crowd interaction with Kanan Gill in a brand new solo show.",
    banner:
      "https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=1000",
    lang: "English & Hindi",
    duration: 75,
    price: 750,
  },
];

const SPORTS_TEMPLATES = [
  {
    titlePattern: (city) => `${city} Super Cup Football Championship`,
    desc: "Witness the ultimate Indian football clash for the trophy! High intensity, electrifying atmosphere, and world-class action.",
    banner:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    lang: "English & Hindi",
    duration: 120,
    price: 350,
  },
  {
    titlePattern: (city) => `IPL T20 Blockbuster Clash - ${city} Stadium`,
    desc: "High-octane cricket rivalry under the floodlights with explosive sixes and packed stands.",
    banner:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1000",
    lang: "English & Hindi",
    duration: 210,
    price: 1200,
  },
  {
    titlePattern: (city) => `Pro Kabaddi League Semi-Finals - ${city}`,
    desc: "Fast, intense, athletic raids and bone-crunching tackles as top teams battle for a spot in the finals.",
    banner:
      "https://images.unsplash.com/photo-1736660605444-3cbd15f8bcde?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    lang: "Hindi & Regional",
    duration: 150,
    price: 499,
  },
  {
    titlePattern: (city) => `National Badminton Super Series 2026 (${city})`,
    desc: "Catch India top Olympic shuttlers in action at the indoor championship stadium.",
    banner:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=1000",
    lang: "English",
    duration: 240,
    price: 300,
  },
  {
    titlePattern: (city) => `${city} Polo & Equestrian Championship`,
    desc: "Royalty meets sport! Enjoy an afternoon of equestrian polo, royal hospitality, and live acoustic music.",
    banner:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&q=80&w=1000",
    lang: "English",
    duration: 180,
    price: 999,
  },
];

const WORKSHOP_TEMPLATES = [
  {
    titlePattern: (city) =>
      `Generative AI & LLM Engineering Bootcamp - ${city}`,
    desc: "Hands-on intensive bootcamp on building autonomous AI agents, RAG pipelines, and fine-tuning open-source models.",
    banner:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000",
    lang: "English",
    duration: 240,
    price: 1499,
  },
  {
    titlePattern: (city) => `UI/UX & Design Systems Masterclass (${city})`,
    desc: "Learn modern Figma workflows, component libraries, responsive design, and design system tokens from senior product designers.",
    banner:
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=1000",
    lang: "English",
    duration: 180,
    price: 999,
  },
  {
    titlePattern: (city) =>
      `Culinary Arts & Artisan Baking Masterclass - ${city}`,
    desc: "Master sourdough bread, French pastries, and artisanal chocolate making with celebrity pastry chefs.",
    banner:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000",
    lang: "English & Hindi",
    duration: 210,
    price: 1299,
  },
  {
    titlePattern: (city) =>
      `Photography & Visual Storytelling Workshop (${city})`,
    desc: "Golden hour photography, camera manual settings, framing, and Adobe Lightroom editing breakdown.",
    banner:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80&w=1000",
    lang: "English & Hindi",
    duration: 180,
    price: 899,
  },
  {
    titlePattern: (city) =>
      `Startup Pitch & Venture Capital Masterclass - ${city}`,
    desc: "Learn how to structure pitch decks, build financial projections, and negotiate seed term sheets with VC investors.",
    banner:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000",
    lang: "English",
    duration: 180,
    price: 1199,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/eventhub",
    );
    console.log("MongoDB Connected for Seeding...");

    console.log("Clearing old database records...");
    try {
      await Event.collection.drop();
    } catch (e) {}
    try {
      await Booking.collection.drop();
    } catch (e) {}
    try {
      await Seat.collection.drop();
    } catch (e) {}
    await City.deleteMany({});
    await User.deleteMany({});
    await Category.deleteMany({});
    await Showtime.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});

    console.log("Inserting 10 Cities...");
    const cities = await City.insertMany(CITIES);

    console.log("Inserting Categories...");
    const categories = await Category.insertMany([
      { name: "Movies", slug: "movies" },
      { name: "Concerts", slug: "concerts" },
      { name: "Comedy", slug: "comedy" },
      { name: "Sports", slug: "sports" },
      { name: "Kids", slug: "kids" },
      { name: "Workshops", slug: "workshops" },
    ]);

    const catMap = {};
    categories.forEach((c) => (catMap[c.slug] = c._id));

    console.log("Creating Admin, Organisers & User Accounts...");
    const admin = await User.create({
      name: "EventHub System Admin",
      email: "admin@eventhub.com",
      password_hash: "admin123",
      role: "ADMIN",
      phone: "+91 9900011122",
      city: "Mumbai",
    });

    const approvedOrganiser = await User.create({
      name: "Red Chillies & PVR Events",
      email: "organiser@pvr.com",
      password_hash: "organiser123",
      role: "ORGANISER",
      organiserStatus: "APPROVED",
      phone: "+91 9820012345",
      city: "Mumbai",
    });

    const pendingOrganiser = await User.create({
      name: "Apex Comedy Club",
      email: "apex@comedy.com",
      password_hash: "organiser123",
      role: "ORGANISER",
      organiserStatus: "PENDING",
      phone: "+91 9811122233",
      city: "Delhi",
    });

    const customerUser = await User.create({
      name: "Rohan Sharma",
      email: "rohan@example.com",
      password_hash: "user123",
      role: "USER",
      phone: "+91 9876543210",
      city: "Mumbai",
    });

    console.log(
      "Programmatically generating 25 events per city (250 events total)...",
    );
    const eventsToInsert = [];

    const categoryTemplateMap = {
      movies: MOVIE_TEMPLATES,
      concerts: CONCERT_TEMPLATES,
      comedy: COMEDY_TEMPLATES,
      sports: SPORTS_TEMPLATES,
      workshops: WORKSHOP_TEMPLATES,
    };

    const categoryKeys = [
      "movies",
      "concerts",
      "comedy",
      "sports",
      "workshops",
    ];

    for (const cityObj of CITIES) {
      const cityName = cityObj.name;
      const citySlug = cityObj.slug;
      const venuesObj = CITY_VENUES[cityName];

      categoryKeys.forEach((catSlug) => {
        const templates = categoryTemplateMap[catSlug];
        const venues = venuesObj[catSlug];

        templates.forEach((tpl, idx) => {
          const venue = venues[idx % venues.length];
          const isFeatured = idx === 0; // Feature 1 event per category per city

          eventsToInsert.push({
            organiser: approvedOrganiser._id,
            title: tpl.titlePattern(cityName),
            description: tpl.desc,
            category: catMap[catSlug],
            bannerUrl: tpl.banner,
            city: cityName,
            citySlug: citySlug,
            venue: venue,
            eventLanguage: tpl.lang,
            durationMinutes: tpl.duration,
            status: "PUBLISHED",
            isFeatured,
          });
        });
      });
    }

    const createdEvents = await Event.insertMany(eventsToInsert);
    console.log(
      `Successfully created ${createdEvents.length} events across all 10 cities.`,
    );

    console.log("Creating Showtimes & Seat Maps...");
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const dayAfter = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const showtimesToInsert = [];

    for (const ev of createdEvents) {
      const isMovie = ev.category.toString() === catMap["movies"].toString();
      const hasSeatMap = isMovie;
      const seatMapConfig = hasSeatMap
        ? {
            rows: [
              "A",
              "B",
              "C",
              "D",
              "E",
              "F",
              "G",
              "H",
              "I",
              "J",
              "K",
              "L",
              "M",
              "N",
              "O",
            ],
            seatsPerRowLeft: 8,
            seatsPerRowRight: 8,
          }
        : null;

      showtimesToInsert.push({
        event: ev._id,
        dateTime: tomorrow,
        price: isMovie ? 350 : 799,
        totalSeats: hasSeatMap ? 240 : 200,
        seatsAvailable: hasSeatMap ? 240 : 200,
        hasSeatMap,
        seatMapConfig,
      });

      showtimesToInsert.push({
        event: ev._id,
        dateTime: dayAfter,
        price: isMovie ? 400 : 899,
        totalSeats: hasSeatMap ? 240 : 200,
        seatsAvailable: hasSeatMap ? 240 : 200,
        hasSeatMap,
        seatMapConfig,
      });
    }

    const createdShowtimes = await Showtime.insertMany(showtimesToInsert);
    console.log(`Created ${createdShowtimes.length} showtimes.`);

    console.log(
      "Generating Seats for Movie Showtimes with pre-marked SOLD seats...",
    );
    const seatsToInsert = [];
    const rows = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
    ];

    const bulkShowtimeUpdates = [];

    for (const st of createdShowtimes) {
      if (!st.hasSeatMap) continue;

      // Pre-select 18 seats to be marked SOLD for visible variety
      const soldSeatKeys = new Set();
      // E.g. B3, B4, C5, C6, D8, E1, E2, F9, F10, G11, G12, H5, H6, J1, J2, K7, K8, L15
      const soldNumbers = [3, 4, 5, 6, 8, 9, 10, 11, 12, 1, 2, 7, 14, 15];
      const soldRows = ["B", "C", "D", "E", "F", "G", "H", "J", "K", "L"];

      let soldCount = 0;

      for (const r of rows) {
        // Left block (1..8)
        for (let num = 1; num <= 8; num++) {
          let seatType = "REGULAR";
          if (r === "A") {
            if (num === 1 || num === 2) seatType = "WHEELCHAIR";
            else if (num === 3 || num === 4) seatType = "COMPANION";
          }

          const isSold =
            soldRows.includes(r) && (num === 3 || num === 4 || num === 5);
          if (isSold) soldCount++;

          seatsToInsert.push({
            showtime: st._id,
            row: r,
            number: num,
            section: "left",
            seatType,
            status: isSold ? "SOLD" : "AVAILABLE",
            booking: null,
          });
        }

        // Right block (9..16)
        for (let num = 9; num <= 16; num++) {
          let seatType = "REGULAR";
          if (r === "A") {
            if (num === 9 || num === 10) seatType = "WHEELCHAIR";
            else if (num === 11 || num === 12) seatType = "COMPANION";
          }

          const isSold = soldRows.includes(r) && (num === 11 || num === 12);
          if (isSold) soldCount++;

          seatsToInsert.push({
            showtime: st._id,
            row: r,
            number: num,
            section: "right",
            seatType,
            status: isSold ? "SOLD" : "AVAILABLE",
            booking: null,
          });
        }
      }

      // Decrement seatsAvailable for pre-marked sold seats
      st.seatsAvailable = 240 - soldCount;
      bulkShowtimeUpdates.push(st.save());
    }

    await Promise.all(bulkShowtimeUpdates);
    console.log(
      `Inserting ${seatsToInsert.length} seat documents into MongoDB...`,
    );

    // Insert in batches of 5000 for maximum performance
    const BATCH_SIZE = 5000;
    for (let i = 0; i < seatsToInsert.length; i += BATCH_SIZE) {
      const batch = seatsToInsert.slice(i, i + BATCH_SIZE);
      await Seat.insertMany(batch);
    }

    console.log("Creating Sample User Bookings & Reviews...");
    const sampleShowtime = createdShowtimes.find((st) => st.hasSeatMap);
    const sampleSeats = await Seat.find({
      showtime: sampleShowtime._id,
      row: "A",
      number: { $in: [5, 6] },
    });

    if (sampleSeats.length > 0) {
      const bkg = await Booking.create({
        user: customerUser._id,
        showtime: sampleShowtime._id,
        numTickets: sampleSeats.length,
        seats: sampleSeats.map((s) => s._id),
        seatNames: sampleSeats.map((s) => `${s.row}${s.number}`),
        totalAmount: sampleShowtime.price * sampleSeats.length,
        paymentMethod: "UPI",
        maskedPaymentDetail: "rohan@upi",
        status: "CONFIRMED",
        bookingId: "BKG-849201",
        bookingRef: "BKG-849201",
      });

      await Seat.updateMany(
        { _id: { $in: sampleSeats.map((s) => s._id) } },
        { status: "SOLD", booking: bkg._id },
      );
    }

    await Review.create({
      user: customerUser._id,
      event: createdEvents[0]._id,
      rating: 5,
      comment:
        "Unbelievable audio quality and visuals! Truly unmatched experience.",
    });

    console.log("\n✅ Comprehensive Database Seed Completed Successfully!");
    console.log("----------------------------------------------------");
    console.log(`Cities Seeded: ${cities.length}`);
    console.log(`Events Seeded: ${createdEvents.length} (25 events per city)`);
    console.log(`Showtimes Seeded: ${createdShowtimes.length}`);
    console.log(`Seat Documents Generated: ${seatsToInsert.length}`);
    console.log("----------------------------------------------------");
    console.log("Admin Account: admin@eventhub.com / admin123");
    console.log("Approved Organiser: organiser@pvr.com / organiser123");
    console.log("Pending Organiser: apex@comedy.com / organiser123");
    console.log("User Account: rohan@example.com / user123");
    console.log("----------------------------------------------------");

    process.exit(0);
  } catch (err) {
    console.error("Seed script error:", err);
    process.exit(1);
  }
};

seedDatabase();
