const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');
const City = require('./models/City');
const Event = require('./models/Event');
const Showtime = require('./models/Showtime');
const Seat = require('./models/Seat');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const { generateSeatsForShowtime } = require('./utils/seatGenerator');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventhub');
    console.log('MongoDB Connected for Seeding...');

    console.log('Clearing old database records...');
    try { await Event.collection.drop(); } catch (e) {}
    try { await Booking.collection.drop(); } catch (e) {}
    try { await Seat.collection.drop(); } catch (e) {}
    await City.deleteMany({});
    await User.deleteMany({});
    await Category.deleteMany({});
    await Showtime.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});

    console.log('Inserting Cities (10 cities)...');
    const citiesData = [
      { name: 'Mumbai', slug: 'mumbai', isActive: true },
      { name: 'Delhi', slug: 'delhi', isActive: true },
      { name: 'Bengaluru', slug: 'bengaluru', isActive: true },
      { name: 'Hyderabad', slug: 'hyderabad', isActive: true },
      { name: 'Chennai', slug: 'chennai', isActive: true },
      { name: 'Pune', slug: 'pune', isActive: true },
      { name: 'Kolkata', slug: 'kolkata', isActive: true },
      { name: 'Ahmedabad', slug: 'ahmedabad', isActive: true },
      { name: 'Jaipur', slug: 'jaipur', isActive: true },
      { name: 'Udaipur', slug: 'udaipur', isActive: true },
    ];
    const cities = await City.insertMany(citiesData);

    console.log('Inserting Categories...');
    const categories = await Category.insertMany([
      { name: 'Movies', slug: 'movies' },
      { name: 'Concerts', slug: 'concerts' },
      { name: 'Comedy', slug: 'comedy' },
      { name: 'Sports', slug: 'sports' },
      { name: 'Kids', slug: 'kids' },
      { name: 'Workshops', slug: 'workshops' },
    ]);

    const catMap = {};
    categories.forEach((c) => (catMap[c.slug] = c._id));

    console.log('Creating Admin, Organisers & User...');
    const admin = await User.create({
      name: 'EventHub System Admin',
      email: 'admin@eventhub.com',
      password_hash: 'admin123',
      role: 'ADMIN',
      phone: '+91 9900011122',
      city: 'Mumbai',
    });

    const approvedOrganiser = await User.create({
      name: 'Red Chillies & PVR Events',
      email: 'organiser@pvr.com',
      password_hash: 'organiser123',
      role: 'ORGANISER',
      organiserStatus: 'APPROVED',
      phone: '+91 9820012345',
      city: 'Mumbai',
    });

    const pendingOrganiser = await User.create({
      name: 'Apex Comedy Club',
      email: 'apex@comedy.com',
      password_hash: 'organiser123',
      role: 'ORGANISER',
      organiserStatus: 'PENDING',
      phone: '+91 9811122233',
      city: 'Delhi',
    });

    const customerUser = await User.create({
      name: 'Rohan Sharma',
      email: 'rohan@example.com',
      password_hash: 'user123',
      role: 'USER',
      phone: '+91 9876543210',
      city: 'Mumbai',
    });

    console.log('Creating 25+ Events across categories & cities...');
    const eventsData = [
      // --- MOVIES (5) ---
      {
        organiser: approvedOrganiser._id,
        title: 'Interstellar - IMAX 70mm Special Re-Release',
        description: 'Experience Christopher Nolan Sci-Fi masterpiece on the largest IMAX screen with immersive 12-channel surround sound.',
        category: catMap['movies'],
        bannerUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1000',
        city: 'Mumbai',
        venue: 'PVR INOX IMAX, Phoenix Lower Parel',
        eventLanguage: 'English',
        durationMinutes: 169,
        status: 'PUBLISHED',
        isFeatured: true,
      },
      {
        organiser: approvedOrganiser._id,
        title: 'Oppenheimer - 4K Remastered Experience',
        description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
        category: catMap['movies'],
        bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1000',
        city: 'Bengaluru',
        venue: 'PVR Forum Mall, Koramangala',
        eventLanguage: 'English',
        durationMinutes: 180,
        status: 'PUBLISHED',
        isFeatured: true,
      },
      {
        organiser: approvedOrganiser._id,
        title: 'Dune: Part Two - IMAX Experience',
        description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
        category: catMap['movies'],
        bannerUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1000',
        city: 'Delhi',
        venue: 'PVR Director’s Cut, Vasant Kunj',
        eventLanguage: 'English',
        durationMinutes: 166,
        status: 'PUBLISHED',
        isFeatured: true,
      },
      {
        organiser: approvedOrganiser._id,
        title: 'Avatar: The Way of Water 3D',
        description: 'Jake Sully lives with his newfound family formed on the planet of Pandora in this visual masterpiece.',
        category: catMap['movies'],
        bannerUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1000',
        city: 'Hyderabad',
        venue: 'Prasads IMAX Screen 1, Banjara Hills',
        eventLanguage: 'English & Telugu',
        durationMinutes: 192,
        status: 'PUBLISHED',
        isFeatured: false,
      },
      {
        organiser: approvedOrganiser._id,
        title: 'Spider-Man: Into the Spider-Verse Special Screening',
        description: 'Teen Miles Morales becomes the Spider-Man of his universe and must join with five spider-powered individuals from other dimensions.',
        category: catMap['movies'],
        bannerUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=1000',
        city: 'Chennai',
        venue: 'SPI Palazzo, Forum Vijaya Mall',
        eventLanguage: 'English',
        durationMinutes: 117,
        status: 'PUBLISHED',
        isFeatured: false,
      },

      // --- CONCERTS (5) ---
      {
        organiser: approvedOrganiser._id,
        title: 'Coldplay - Music Of The Spheres World Tour Live',
        description: 'The iconic global band brings their groundbreaking stadium tour with LED wristbands, laser lights, and legendary anthems.',
        category: catMap['concerts'],
        bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000',
        city: 'Mumbai',
        venue: 'DY Patil Stadium, Navi Mumbai',
        eventLanguage: 'English',
        durationMinutes: 180,
        status: 'PUBLISHED',
        isFeatured: true,
      },
      {
        organiser: approvedOrganiser._id,
        title: 'A.R. Rahman Live in Concert - Soul of India',
        description: 'Experience the Oscar-winning maestro live with a 50-piece symphony orchestra performing timeless Indian melodies.',
        category: catMap['concerts'],
        bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1000',
        city: 'Chennai',
        venue: 'Jawaharlal Nehru Stadium',
        eventLanguage: 'Tamil & Hindi',
        durationMinutes: 210,
        status: 'PUBLISHED',
        isFeatured: true,
      },
      {
        organiser: approvedOrganiser._id,
        title: 'Sunburn Festival 2026 Arena Tour',
        description: 'Asia largest Electronic Dance Music festival features top international DJs, pyro displays, and non-stop beats.',
        category: catMap['concerts'],
        bannerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1000',
        city: 'Pune',
        venue: 'Mahalaxmi Lawns, Karve Nagar',
        eventLanguage: 'English',
        durationMinutes: 300,
        status: 'PUBLISHED',
        isFeatured: false,
      },
      {
        organiser: approvedOrganiser._id,
        title: 'Prateek Kuhad - Silhouettes India Tour',
        description: 'Indie acoustic sensation Prateek Kuhad sings intimate fan-favorites including Cold/Mess and Kasoor in a starry setup.',
        category: catMap['concerts'],
        bannerUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=1000',
        city: 'Delhi',
        venue: 'JL N Stadium Grounds, New Delhi',
        eventLanguage: 'Hindi & English',
        durationMinutes: 120,
        status: 'PUBLISHED',
        isFeatured: false,
      },
      {
        organiser: approvedOrganiser._id,
        title: 'Coke Studio Bharat Live Showcase',
        description: 'Fusion folk and contemporary Indian pop coming together live with legendary folk artists and breakthrough indie acts.',
        category: catMap['concerts'],
        bannerUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=1000',
        city: 'Kolkata',
        venue: 'Nicco Park Grounds, Salt Lake',
        eventLanguage: 'Bengali & Hindi',
        durationMinutes: 180,
        status: 'PUBLISHED',
        isFeatured: false,
      },

      // --- COMEDY (5) ---
      {
        organiser: approvedOrganiser._id,
        title: 'Anubhav Singh Bassi - Live Standup Unfiltered',
        description: 'Laugh till your stomach hurts with Bassi latest 90-minute hilarious solo special packed with raw, relatable storytelling.',
        category: catMap['comedy'],
        bannerUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&q=80&w=1000',
        city: 'Delhi',
        venue: 'Siri Fort Auditorium, New Delhi',
        eventLanguage: 'Hindi',
        durationMinutes: 90,
        status: 'PUBLISHED',
        isFeatured: true,
      },
      {
        organiser: approvedOrganiser._id,
        title: 'Zakir Khan - Tathastu & Beyond',
        description: 'The master of storytelling Zakir Khan brings Sakht Launda humor and heartwarming poetry live on stage.',
        category: catMap['comedy'],
        bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1000',
        city: 'Mumbai',
        venue: 'Shanmukhananda Hall, Sion',
        eventLanguage: 'Hindi',
        durationMinutes: 100,
        status: 'PUBLISHED',
        isFeatured: true,
      },
      {
        organiser: approvedOrganiser._id,
        title: 'Vir Das - Mind Fool World Tour',
        description: 'Emmy award winning comedian Vir Das delivers sharp observational wit and global political humor.',
        category: catMap['comedy'],
        bannerUrl: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&q=80&w=1000',
        city: 'Bengaluru',
        venue: 'Chowdiah Memorial Hall, Malleshwaram',
        eventLanguage: 'English',
        durationMinutes: 90,
        status: 'PUBLISHED',
        isFeatured: false,
      },
      {
        organiser: approvedOrganiser._id,
        title: 'Abhishek Upmanyu - Jealous of Sabjiwala',
        description: 'Fast-paced punchlines and hilarious everyday anxieties presented by Abhishek Upmanyu.',
        category: catMap['comedy'],
        bannerUrl: 'https://images.unsplash.com/photo-1561489413-985b06da5bee?auto=format&fit=crop&q=80&w=1000',
        city: 'Hyderabad',
        venue: 'Shilpakala Vedika, HITECH City',
        eventLanguage: 'Hindi',
        durationMinutes: 80,
        status: 'PUBLISHED',
        isFeatured: false,
      },
      {
        organiser: approvedOrganiser._id,
        title: 'Kanan Gill - Is This It? Live Standup',
        description: 'Existential comedy and razor-sharp crowd interaction with Kanan Gill in a brand new solo show.',
        category: catMap['comedy'],
        bannerUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=1000',
        city: 'Jaipur',
        venue: 'Birla Auditorium, Statue Circle',
        eventLanguage: 'English & Hindi',
        durationMinutes: 75,
        status: 'PUBLISHED',
        isFeatured: false,
      },

      // --- SPORTS (5) ---
      {
        organiser: approvedOrganiser._id,
        title: 'ISL Championship Final: Mumbai City FC vs Mohun Bagan',
        description: 'Witness the ultimate Indian football clash for the trophy! High intensity, electrifying atmosphere, and world-class action.',
        category: catMap['sports'],
        bannerUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1000',
        city: 'Mumbai',
        venue: 'Mumbai Football Arena, Andheri',
        eventLanguage: 'English & Hindi',
        durationMinutes: 120,
        status: 'PUBLISHED',
        isFeatured: false,
      },
      {
        organiser: approvedOrganiser._id,
        title: 'IPL T20 Clash: Royal Challengers vs Chennai Super Kings',
        description: 'High-octane cricket rivalry under the floodlights with explosive sixes and packed stands.',
        category: catMap['sports'],
        bannerUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1000',
        city: 'Bengaluru',
        venue: 'M. Chinnaswamy Stadium',
        eventLanguage: 'English & Kannada',
        durationMinutes: 210,
        status: 'PUBLISHED',
        isFeatured: true,
      },
      {
        organiser: approvedOrganiser._id,
        title: 'Pro Kabaddi League Semi-Finals 2026',
        description: 'Fast, intense, athletic raids and bone-crunching tackles as four top teams battle for a spot in the finals.',
        category: catMap['sports'],
        bannerUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&q=80&w=1000',
        city: 'Ahmedabad',
        venue: 'EKA Arena by TransStadia',
        eventLanguage: 'Hindi & Gujarati',
        durationMinutes: 150,
        status: 'PUBLISHED',
        isFeatured: false,
      },
      {
        organiser: approvedOrganiser._id,
        title: 'National Badminton Super Series 2026',
        description: 'Catch India top Olympic shuttlers in action at the indoor championship stadium.',
        category: catMap['sports'],
        bannerUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=1000',
        city: 'Hyderabad',
        venue: 'Gachibowli Indoor Stadium',
        eventLanguage: 'English & Telugu',
        durationMinutes: 240,
        status: 'PUBLISHED',
        isFeatured: false,
      },
      {
        organiser: approvedOrganiser._id,
        title: 'Rajasthan Polo Cup Championship',
        description: 'Royalty meets sport! Enjoy an afternoon of equestrian polo, royal hospitality, and live acoustic music.',
        category: catMap['sports'],
        bannerUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&q=80&w=1000',
        city: 'Udaipur',
        venue: 'Udaipur Polo Grounds, Manek Chowk',
        eventLanguage: 'English',
        durationMinutes: 180,
        status: 'PUBLISHED',
        isFeatured: false,
      },

      // --- WORKSHOPS (5) ---
      {
        organiser: approvedOrganiser._id,
        title: 'Generative AI & LLM Engineering Masterclass Workshop',
        description: 'Hands-on intensive bootcamp on building autonomous AI agents, RAG pipelines, and fine-tuning open-source models.',
        category: catMap['workshops'],
        bannerUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000',
        city: 'Bengaluru',
        venue: 'Indiranagar Tech Hub Auditorium',
        eventLanguage: 'English',
        durationMinutes: 240,
        status: 'PUBLISHED',
        isFeatured: false,
      },
      {
        organiser: approvedOrganiser._id,
        title: 'UI/UX & Design Systems Masterclass',
        description: 'Learn modern Figma workflows, component libraries, responsive design, and design system tokens from senior product designers.',
        category: catMap['workshops'],
        bannerUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=1000',
        city: 'Pune',
        venue: 'Viman Nagar Co-Working Space',
        eventLanguage: 'English',
        durationMinutes: 180,
        status: 'PUBLISHED',
        isFeatured: false,
      },
      {
        organiser: approvedOrganiser._id,
        title: 'Culinary Arts & Artisan Baking Bootcamp',
        description: 'Master sourdough bread, French pastries, and artisanal chocolate making with celebrity pastry chefs.',
        category: catMap['workshops'],
        bannerUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000',
        city: 'Mumbai',
        venue: 'Culinary Craft Studio, Bandra West',
        eventLanguage: 'English & Hindi',
        durationMinutes: 210,
        status: 'PUBLISHED',
        isFeatured: false,
      },
      {
        organiser: approvedOrganiser._id,
        title: 'Photography & Visual Storytelling Workshop',
        description: 'Golden hour photography, camera manual settings, framing, and Adobe Lightroom editing breakdown.',
        category: catMap['workshops'],
        bannerUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80&w=1000',
        city: 'Udaipur',
        venue: 'Fateh Sagar Lake Front Studio',
        eventLanguage: 'English & Hindi',
        durationMinutes: 180,
        status: 'PUBLISHED',
        isFeatured: false,
      },
      {
        organiser: approvedOrganiser._id,
        title: 'Startup Pitch & Venture Capital Masterclass',
        description: 'Learn how to structure pitch decks, build financial projections, and negotiate seed term sheets with VC investors.',
        category: catMap['workshops'],
        bannerUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000',
        city: 'Delhi',
        venue: 'Innov8 Coworking, Connaught Place',
        eventLanguage: 'English',
        durationMinutes: 180,
        status: 'PUBLISHED',
        isFeatured: false,
      },
    ];

    const events = await Event.insertMany(eventsData);

    console.log('Creating Showtimes & Seat Maps for Events...');
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const dayAfter = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const showtimesToCreate = [];

    for (const ev of events) {
      const isMovie = ev.category.toString() === catMap['movies'].toString();
      const hasSeatMap = isMovie;
      const seatMapConfig = hasSeatMap
        ? {
            rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'],
            seatsPerRowLeft: 8,
            seatsPerRowRight: 8,
          }
        : null;

      showtimesToCreate.push({
        event: ev._id,
        dateTime: tomorrow,
        price: isMovie ? 350 : 799,
        totalSeats: hasSeatMap ? 240 : 200,
        seatsAvailable: hasSeatMap ? 240 : 200,
        hasSeatMap,
        seatMapConfig,
      });

      showtimesToCreate.push({
        event: ev._id,
        dateTime: dayAfter,
        price: isMovie ? 400 : 899,
        totalSeats: hasSeatMap ? 240 : 200,
        seatsAvailable: hasSeatMap ? 240 : 200,
        hasSeatMap,
        seatMapConfig,
      });
    }

    const createdShowtimes = await Showtime.insertMany(showtimesToCreate);

    console.log('Generating Seats for Movie Showtimes...');
    let totalSeatsGenerated = 0;
    for (const st of createdShowtimes) {
      if (st.hasSeatMap) {
        const count = await generateSeatsForShowtime(st._id, st.seatMapConfig);
        totalSeatsGenerated += count;
      }
    }
    console.log(`Generated ${totalSeatsGenerated} seat records for cinema showtimes.`);

    console.log('Creating Sample User Bookings...');
    const sampleShowtime = createdShowtimes[0]; // Interstellar movie showtime
    const sampleSeats = await Seat.find({ showtime: sampleShowtime._id, row: 'A', number: { $in: [5, 6] } });

    if (sampleSeats.length > 0) {
      const bkg = await Booking.create({
        user: customerUser._id,
        showtime: sampleShowtime._id,
        numTickets: sampleSeats.length,
        seats: sampleSeats.map((s) => s._id),
        seatNames: sampleSeats.map((s) => `${s.row}${s.number}`),
        totalAmount: sampleShowtime.price * sampleSeats.length,
        status: 'CONFIRMED',
        bookingId: 'BKG-849201',
        bookingRef: 'BKG-849201',
      });

      await Seat.updateMany(
        { _id: { $in: sampleSeats.map((s) => s._id) } },
        { status: 'SOLD', booking: bkg._id }
      );

      await Showtime.findByIdAndUpdate(sampleShowtime._id, {
        $inc: { seatsAvailable: -sampleSeats.length },
      });
    }

    console.log('Creating Sample Event Reviews...');
    await Review.create({
      user: customerUser._id,
      event: events[0]._id,
      rating: 5,
      comment: 'Unbelievable audio quality and visuals! Truly unmatched IMAX experience.',
    });

    console.log('\n✅ Database Seed Completed Successfully!');
    console.log('----------------------------------------------------');
    console.log(`Cities Seeded: ${cities.length}`);
    console.log(`Events Seeded: ${events.length}`);
    console.log(`Showtimes Seeded: ${createdShowtimes.length}`);
    console.log('----------------------------------------------------');
    console.log('Admin Account: admin@eventhub.com / admin123');
    console.log('Approved Organiser: organiser@pvr.com / organiser123');
    console.log('Pending Organiser: apex@comedy.com / organiser123');
    console.log('User Account: rohan@example.com / user123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (err) {
    console.error('Seed script error:', err);
    process.exit(1);
  }
};

seedDatabase();
