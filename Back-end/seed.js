require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/usermodel');
const Event = require('./models/Event');
const bcrypt = require('bcrypt');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");

    let manager = await User.findOne({ role: "event_manager" });
    if (!manager) {
      manager = new User({
        name: "Admin Manager",
        email: "manager@eventhub.com",
        password: await bcrypt.hash("password123", 10),
        role: "event_manager"
      });
      await manager.save();
      console.log("Created default manager account: manager@eventhub.com");
    }

    await Event.deleteMany({});
    console.log("Cleared existing events...");

    const events = [
      {
        title: "Kalki 2898 AD",
        description: "A modern myth-verse set in a dystopian world. An epic action film.",
        category: "Movies",
        date: new Date(Date.now() + 86400000 * 2), // in 2 days
        startTime: "18:00",
        endTime: "21:00",
        location: "PVR Cinemas, Mumbai",
        ticketPrice: 350,
        totalTickets: 200,
        availableTickets: 200,
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        createdBy: manager._id
      },
      {
        title: "Deadpool & Wolverine",
        description: "The ultimate superhero crossover. Action packed comedy.",
        category: "Movies",
        date: new Date(Date.now() + 86400000 * 5),
        startTime: "20:00",
        endTime: "22:30",
        location: "INOX, Bangalore",
        ticketPrice: 450,
        totalTickets: 150,
        availableTickets: 150,
        image: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        createdBy: manager._id
      },
      {
        title: "Arijit Singh Live in Concert",
        description: "Experience the magic of Arijit Singh's soulful voice live in concert.",
        category: "Music",
        date: new Date(Date.now() + 86400000 * 14),
        startTime: "19:00",
        endTime: "23:00",
        location: "Jio World Garden, Mumbai",
        ticketPrice: 1500,
        totalTickets: 5000,
        availableTickets: 5000,
        image: "https://images.unsplash.com/photo-1540039155732-68746868d22c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        createdBy: manager._id
      },
      {
        title: "Ed Sheeran: +-=÷x Tour",
        description: "The Mathematics tour brings Ed Sheeran back to India.",
        category: "Music",
        date: new Date(Date.now() + 86400000 * 30),
        startTime: "18:30",
        endTime: "22:00",
        location: "Mahalaxmi Race Course",
        ticketPrice: 3500,
        totalTickets: 10000,
        availableTickets: 10000,
        image: "https://images.unsplash.com/photo-1470229722913-7c090be5c520?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        createdBy: manager._id
      },
      {
        title: "Zakir Khan Live",
        description: "Sakht Launda is back with his new special. Guaranteed laughs.",
        category: "Standup Comedy",
        date: new Date(Date.now() + 86400000 * 10),
        startTime: "20:00",
        endTime: "21:30",
        location: "NCPA, Mumbai",
        ticketPrice: 999,
        totalTickets: 800,
        availableTickets: 800,
        image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        createdBy: manager._id
      },
      {
        title: "Bassi - New Material",
        description: "Anubhav Singh Bassi testing new jokes.",
        category: "Standup Comedy",
        date: new Date(Date.now() + 86400000 * 4),
        startTime: "19:30",
        endTime: "21:00",
        location: "Habitat, Mumbai",
        ticketPrice: 499,
        totalTickets: 150,
        availableTickets: 150,
        image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        createdBy: manager._id
      },
      {
        title: "IPL Final 2026",
        description: "The biggest T20 cricketing clash of the year.",
        category: "Sports",
        date: new Date(Date.now() + 86400000 * 20),
        startTime: "19:30",
        endTime: "23:30",
        location: "Wankhede Stadium, Mumbai",
        ticketPrice: 2000,
        totalTickets: 30000,
        availableTickets: 30000,
        image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        createdBy: manager._id
      },
      {
        title: "Hamlet",
        description: "A modern retelling of Shakespeare's classic play.",
        category: "Plays",
        date: new Date(Date.now() + 86400000 * 12),
        startTime: "17:00",
        endTime: "19:30",
        location: "Prithvi Theatre, Juhu",
        ticketPrice: 500,
        totalTickets: 100,
        availableTickets: 100,
        image: "https://images.unsplash.com/photo-1507676184212-d0330a15233c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        createdBy: manager._id
      }
    ];

    await Event.insertMany(events);
    console.log(`Successfully seeded ${events.length} events!`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
