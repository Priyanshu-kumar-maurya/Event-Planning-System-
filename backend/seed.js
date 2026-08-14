// seed.js — Inserts mock users (Admin + Students) & events with registeredUsers into MongoDB
// Run: node seed.js

const mongoose = require("mongoose");
require("dotenv").config();

const Event = require("./models/Event");
const User = require("./models/User");

const usersToSeed = [
  {
    name: "Admin Officer",
    email: "admin@eventhub.com",
    password: "admin123",
    role: "admin",
    college: "NSUT Delhi (Admin Office)",
    phone: "9876543210",
  },
  {
    name: "Rahul Sharma",
    email: "rahul@nsut.ac.in",
    password: "user123",
    role: "user",
    college: "NSUT - CSE 3rd Year",
    phone: "9812345678",
  },
  {
    name: "Priya Patel",
    email: "priya@delhi.edu",
    password: "user123",
    role: "user",
    college: "DU - Electronics 2nd Year",
    phone: "9823456789",
  },
  {
    name: "Aman Verma",
    email: "aman@iitd.ac.in",
    password: "user123",
    role: "user",
    college: "IIT Delhi - Mech 4th Year",
    phone: "9834567890",
  },
  {
    name: "Sneha Gupta",
    email: "sneha@dtu.ac.in",
    password: "user123",
    role: "user",
    college: "DTU - IT 2nd Year",
    phone: "9845678901",
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB:", process.env.MONGO_URI);

    // 1. Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    console.log("🗑️  Cleared existing Users and Events");

    // 2. Insert Users (pre-save hook will hash passwords)
    const createdUsers = [];
    for (const u of usersToSeed) {
      const user = new User(u);
      await user.save();
      createdUsers.push(user);
    }
    console.log(`✅ Seeded ${createdUsers.length} Users into MongoDB:`);
    createdUsers.forEach((u) => console.log(`   → [${u.role.toUpperCase()}] ${u.name} (${u.email})`));

    const adminUser = createdUsers.find((u) => u.role === "admin");
    const u1 = createdUsers[1];
    const u2 = createdUsers[2];
    const u3 = createdUsers[3];
    const u4 = createdUsers[4];

    // 3. Sample Events with realistic registeredUsers
    const sampleEvents = [
      {
        title: "Tech Fest 2025: Innovate & Hack",
        category: "Technology",
        date: "2025-09-15",
        time: "10:00 AM",
        location: "Convention Centre, Block A, NSUT Delhi",
        description:
          "The premier technology festival! 3 days of high-intensity hackathons, AI/ML workshops, robotics showcases, and keynote speeches by tech visionaries.",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
        organizer: "NSUT Tech Club",
        seats: 500,
        price: 0,
        tags: ["Hackathon", "AI", "Workshops", "Coding"],
        createdBy: adminUser._id,
        creatorEmail: adminUser.email,
        registeredUsers: [
          { userId: u1._id, name: u1.name, email: u1.email, college: u1.college, phone: u1.phone, registeredAt: new Date(Date.now() - 3600000 * 24 * 2) },
          { userId: u2._id, name: u2.name, email: u2.email, college: u2.college, phone: u2.phone, registeredAt: new Date(Date.now() - 3600000 * 24 * 1) },
          { userId: u3._id, name: u3.name, email: u3.email, college: u3.college, phone: u3.phone, registeredAt: new Date(Date.now() - 3600000 * 5) },
        ],
      },
      {
        title: "Annual Cultural Night: Rangmanch",
        category: "Cultural",
        date: "2025-09-22",
        time: "6:00 PM",
        location: "Open Air Amphitheatre, Campus Lawn",
        description:
          "An electrifying night celebrating music, classical & western dance, theatrical drama, and street plays with celebrity guest performances and food stalls.",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
        organizer: "Cultural Committee",
        seats: 800,
        price: 50,
        tags: ["Music", "Dance", "Drama", "Live"],
        createdBy: adminUser._id,
        creatorEmail: adminUser.email,
        registeredUsers: [
          { userId: u2._id, name: u2.name, email: u2.email, college: u2.college, phone: u2.phone, registeredAt: new Date(Date.now() - 3600000 * 24 * 3) },
          { userId: u4._id, name: u4.name, email: u4.email, college: u4.college, phone: u4.phone, registeredAt: new Date(Date.now() - 3600000 * 12) },
        ],
      },
      {
        title: "Inter-College Sports League 2025",
        category: "Sports",
        date: "2025-10-05",
        time: "8:00 AM",
        location: "University Sports Arena & Grounds",
        description:
          "Championship tournaments in Cricket, Football, Basketball, Table Tennis, and Athletics. Compete with top university squads and win grand trophies!",
        image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80",
        organizer: "Sports Council",
        seats: 300,
        price: 100,
        tags: ["Cricket", "Football", "Athletics"],
        createdBy: u1._id,
        creatorEmail: u1.email,
        registeredUsers: [
          { userId: u1._id, name: u1.name, email: u1.email, college: u1.college, phone: u1.phone, registeredAt: new Date(Date.now() - 3600000 * 24 * 4) },
          { userId: u3._id, name: u3.name, email: u3.email, college: u3.college, phone: u3.phone, registeredAt: new Date(Date.now() - 3600000 * 18) },
        ],
      },
      {
        title: "Young Entrepreneurs Business Summit",
        category: "Business",
        date: "2025-10-12",
        time: "9:00 AM",
        location: "Management Auditorium, Block C",
        description:
          "Pitch your startup idea to angel investors, participate in business case study competitions, and learn product-building from industry founders.",
        image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80",
        organizer: "E-Cell & Incubation Center",
        seats: 200,
        price: 200,
        tags: ["Startup", "Pitch", "Investment", "Networking"],
        createdBy: adminUser._id,
        creatorEmail: adminUser.email,
        registeredUsers: [
          { userId: u1._id, name: u1.name, email: u1.email, college: u1.college, phone: u1.phone, registeredAt: new Date(Date.now() - 3600000 * 8) },
          { userId: u4._id, name: u4.name, email: u4.email, college: u4.college, phone: u4.phone, registeredAt: new Date(Date.now() - 3600000 * 2) },
        ],
      },
      {
        title: "National Photography & Art Gala",
        category: "Art",
        date: "2025-10-20",
        time: "11:00 AM",
        location: "Fine Arts Gallery, Central Library",
        description:
          "Showcasing mesmerizing photography, digital artwork, and canvas paintings created by university students across India.",
        image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80",
        organizer: "Photography & Arts Society",
        seats: 150,
        price: 0,
        tags: ["Photography", "Exhibition", "Visual Arts"],
        createdBy: u2._id,
        creatorEmail: u2.email,
        registeredUsers: [
          { userId: u2._id, name: u2.name, email: u2.email, college: u2.college, phone: u2.phone, registeredAt: new Date() },
        ],
      },
      {
        title: "Rock & Indie Music Fest: Echoes",
        category: "Music",
        date: "2025-11-01",
        time: "5:00 PM",
        location: "Open Stage, North Campus",
        description:
          "Live concert featuring underground college rock bands, acoustic sets, indie pop artists, and DJ night to conclude the weekend.",
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
        organizer: "Music Club",
        seats: 1000,
        price: 150,
        tags: ["Concert", "Rock", "DJ Night"],
        createdBy: adminUser._id,
        creatorEmail: adminUser.email,
        registeredUsers: [
          { userId: u1._id, name: u1.name, email: u1.email, college: u1.college, phone: u1.phone, registeredAt: new Date() },
          { userId: u2._id, name: u2.name, email: u2.email, college: u2.college, phone: u2.phone, registeredAt: new Date() },
          { userId: u3._id, name: u3.name, email: u3.email, college: u3.college, phone: u3.phone, registeredAt: new Date() },
          { userId: u4._id, name: u4.name, email: u4.email, college: u4.college, phone: u4.phone, registeredAt: new Date() },
        ],
      },
      {
        title: "24-Hour Code Clash Hackathon",
        category: "Technology",
        date: "2025-11-08",
        time: "9:00 AM",
        location: "Computer Labs 1-4, IT Department",
        description:
          "Non-stop 24-hour coding marathon. Build web & mobile applications addressing real problems. Free food, mentors, and ₹50,000 cash prizes!",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
        organizer: "Developer Community",
        seats: 120,
        price: 0,
        tags: ["Hackathon", "Coding", "Cash Prize"],
        createdBy: adminUser._id,
        creatorEmail: adminUser.email,
        registeredUsers: [
          { userId: u3._id, name: u3.name, email: u3.email, college: u3.college, phone: u3.phone, registeredAt: new Date() },
        ],
      },
      {
        title: "Global Street Food & Culture Fiesta",
        category: "Food",
        date: "2025-11-15",
        time: "12:00 PM",
        location: "Central Courtyard & Food Street",
        description:
          "Delicious cuisines, masterclasses by culinary chefs, student-run food trucks, and eating challenges. Free entry for all college students!",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
        organizer: "Student Union",
        seats: 600,
        price: 0,
        tags: ["Food", "Festival", "Culinary"],
        createdBy: adminUser._id,
        creatorEmail: adminUser.email,
        registeredUsers: [
          { userId: u1._id, name: u1.name, email: u1.email, college: u1.college, phone: u1.phone, registeredAt: new Date() },
          { userId: u4._id, name: u4.name, email: u4.email, college: u4.college, phone: u4.phone, registeredAt: new Date() },
        ],
      },
    ];

    // Compute initial registered counts
    sampleEvents.forEach((ev) => {
      ev.registered = ev.registeredUsers.length;
    });

    const insertedEvents = await Event.insertMany(sampleEvents);
    console.log(`✅ Seeded ${insertedEvents.length} Events with registeredUsers into MongoDB!`);

    console.log("\n============================================");
    console.log("🎉 DATABASE SEEDED SUCCESSFULLY!");
    console.log("============================================");
    console.log("👑 ADMIN CREDENTIALS:");
    console.log("   Email:    admin@eventhub.com");
    console.log("   Password: admin123");
    console.log("--------------------------------------------");
    console.log("👤 TEST STUDENT CREDENTIALS:");
    console.log("   Email:    rahul@nsut.ac.in");
    console.log("   Password: user123");
    console.log("============================================\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seedDatabase();
