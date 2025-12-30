import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not found in environment');
  process.exit(1);
}

async function seed() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('🌱 Starting database seed...');

  try {
    // Create demo profiles for each category
    const profiles = [
      // Women
      {
        userId: 1,
        displayName: 'Julia Santos',
        slug: 'julia-santos',
        category: 'women',
        bio: 'Olá! Sou a Julia, uma acompanhante sofisticada e elegante. Adoro conhecer pessoas interessantes e proporcionar momentos inesquecíveis. Sou discreta, educada e muito carinhosa.',
        age: 25,
        height: 170,
        weight: 58,
        eyeColor: 'Castanhos',
        hairColor: 'Castanho',
        bodyType: 'Magra',
        ethnicity: 'Branca',
        whatsapp: '11999999001',
        city: 'São Paulo',
        state: 'SP',
        neighborhood: 'Moema',
        latitude: -23.6015,
        longitude: -46.6657,
        hasOwnPlace: true,
        doesOutcalls: true,
        pricePerHour: '300.00',
        pricePerNight: '2000.00',
        acceptsPix: true,
        acceptsCard: true,
        acceptsCash: true,
        documentsVerified: true,
        ageVerified: true,
        photosVerified: true,
        plan: 'premium',
        isActive: true,
        isFeatured: true,
        viewCount: 1520,
        contactCount: 68,
      },
      {
        userId: 1,
        displayName: 'Amanda Oliveira',
        slug: 'amanda-oliveira',
        category: 'women',
        bio: 'Prazer, sou Amanda! Uma mulher sensual e cheia de energia. Gosto de homens que sabem apreciar uma boa companhia. Atendo com hora marcada.',
        age: 28,
        height: 165,
        weight: 55,
        eyeColor: 'Verdes',
        hairColor: 'Loiro',
        bodyType: 'Curvilínea',
        ethnicity: 'Branca',
        whatsapp: '11999999002',
        city: 'São Paulo',
        state: 'SP',
        neighborhood: 'Jardins',
        latitude: -23.5632,
        longitude: -46.6658,
        hasOwnPlace: true,
        doesOutcalls: true,
        pricePerHour: '500.00',
        pricePerNight: '3500.00',
        acceptsPix: true,
        acceptsCard: true,
        acceptsCash: true,
        documentsVerified: true,
        ageVerified: true,
        photosVerified: true,
        plan: 'vip',
        isActive: true,
        isFeatured: true,
        viewCount: 2340,
        contactCount: 125,
      },
      {
        userId: 1,
        displayName: 'Carol Mello',
        slug: 'carol-mello',
        category: 'women',
        bio: 'Oi amor! Sou a Carol, uma morena de tirar o fôlego. Adoro fazer massagens relaxantes e proporcionar momentos de puro prazer.',
        age: 24,
        height: 168,
        weight: 60,
        eyeColor: 'Castanhos',
        hairColor: 'Preto',
        bodyType: 'Atlética',
        ethnicity: 'Morena',
        whatsapp: '11999999003',
        city: 'São Paulo',
        state: 'SP',
        neighborhood: 'Pinheiros',
        latitude: -23.5667,
        longitude: -46.6917,
        hasOwnPlace: true,
        doesOutcalls: false,
        pricePerHour: '250.00',
        pricePerNight: '1800.00',
        acceptsPix: true,
        acceptsCard: false,
        acceptsCash: true,
        documentsVerified: true,
        ageVerified: true,
        photosVerified: false,
        plan: 'premium',
        isActive: true,
        isFeatured: false,
        viewCount: 890,
        contactCount: 45,
      },
      // Men
      {
        userId: 1,
        displayName: 'Lucas Ferreira',
        slug: 'lucas-ferreira',
        category: 'men',
        bio: 'Olá! Sou o Lucas, um acompanhante discreto e elegante. Perfeito para eventos sociais, jantares ou momentos íntimos. Educado e bem apresentável.',
        age: 30,
        height: 185,
        weight: 82,
        eyeColor: 'Azuis',
        hairColor: 'Castanho',
        bodyType: 'Atlético',
        ethnicity: 'Branco',
        whatsapp: '11999999004',
        city: 'São Paulo',
        state: 'SP',
        neighborhood: 'Itaim Bibi',
        latitude: -23.5858,
        longitude: -46.6756,
        hasOwnPlace: true,
        doesOutcalls: true,
        pricePerHour: '400.00',
        pricePerNight: '2500.00',
        acceptsPix: true,
        acceptsCard: true,
        acceptsCash: true,
        documentsVerified: true,
        ageVerified: true,
        photosVerified: true,
        plan: 'premium',
        isActive: true,
        isFeatured: true,
        viewCount: 650,
        contactCount: 32,
      },
      {
        userId: 1,
        displayName: 'Rafael Costa',
        slug: 'rafael-costa',
        category: 'men',
        bio: 'Prazer, sou Rafael! Um homem charmoso e atencioso. Ideal para mulheres que buscam companhia de qualidade. Discreto e profissional.',
        age: 28,
        height: 180,
        weight: 78,
        eyeColor: 'Castanhos',
        hairColor: 'Preto',
        bodyType: 'Musculoso',
        ethnicity: 'Moreno',
        whatsapp: '11999999005',
        city: 'São Paulo',
        state: 'SP',
        neighborhood: 'Vila Olímpia',
        latitude: -23.5958,
        longitude: -46.6856,
        hasOwnPlace: false,
        doesOutcalls: true,
        pricePerHour: '350.00',
        pricePerNight: '2200.00',
        acceptsPix: true,
        acceptsCard: false,
        acceptsCash: true,
        documentsVerified: true,
        ageVerified: true,
        photosVerified: true,
        plan: 'free',
        isActive: true,
        isFeatured: false,
        viewCount: 420,
        contactCount: 18,
      },
      // Trans
      {
        userId: 1,
        displayName: 'Valentina Silva',
        slug: 'valentina-silva',
        category: 'trans',
        bio: 'Oi querido! Sou a Valentina, uma trans linda e feminina. Adoro proporcionar momentos únicos e especiais. Venha me conhecer!',
        age: 26,
        height: 175,
        weight: 65,
        eyeColor: 'Castanhos',
        hairColor: 'Loiro',
        bodyType: 'Curvilínea',
        ethnicity: 'Latina',
        whatsapp: '11999999006',
        city: 'São Paulo',
        state: 'SP',
        neighborhood: 'República',
        latitude: -23.5430,
        longitude: -46.6420,
        hasOwnPlace: true,
        doesOutcalls: true,
        pricePerHour: '280.00',
        pricePerNight: '1800.00',
        acceptsPix: true,
        acceptsCard: true,
        acceptsCash: true,
        documentsVerified: true,
        ageVerified: true,
        photosVerified: true,
        plan: 'premium',
        isActive: true,
        isFeatured: true,
        viewCount: 1100,
        contactCount: 55,
      },
      {
        userId: 1,
        displayName: 'Bianca Martins',
        slug: 'bianca-martins',
        category: 'trans',
        bio: 'Olá! Sou a Bianca, uma acompanhante trans super feminina e carinhosa. Atendo com muito carinho e dedicação. Sigilo absoluto!',
        age: 24,
        height: 172,
        weight: 62,
        eyeColor: 'Verdes',
        hairColor: 'Ruivo',
        bodyType: 'Magra',
        ethnicity: 'Branca',
        whatsapp: '11999999007',
        city: 'São Paulo',
        state: 'SP',
        neighborhood: 'Consolação',
        latitude: -23.5520,
        longitude: -46.6580,
        hasOwnPlace: true,
        doesOutcalls: false,
        pricePerHour: '250.00',
        pricePerNight: '1600.00',
        acceptsPix: true,
        acceptsCard: false,
        acceptsCash: true,
        documentsVerified: true,
        ageVerified: true,
        photosVerified: false,
        plan: 'free',
        isActive: true,
        isFeatured: false,
        viewCount: 580,
        contactCount: 28,
      },
    ];

    // Insert profiles
    for (const profile of profiles) {
      const columns = Object.keys(profile).join(', ');
      const placeholders = Object.keys(profile).map(() => '?').join(', ');
      const values = Object.values(profile);

      await connection.execute(
        `INSERT INTO advertiser_profiles (${columns}) VALUES (${placeholders})`,
        values
      );
      console.log(`✅ Created profile: ${profile.displayName}`);
    }

    // Get profile IDs
    const [profileRows] = await connection.execute('SELECT id, slug FROM advertiser_profiles');
    const profileMap = {};
    profileRows.forEach(row => {
      profileMap[row.slug] = row.id;
    });

    // Add profile media (photos)
    const mediaItems = [
      // Julia Santos
      { profileId: profileMap['julia-santos'], type: 'photo', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop', isMain: true, sortOrder: 1 },
      { profileId: profileMap['julia-santos'], type: 'photo', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop', isMain: false, sortOrder: 2 },
      { profileId: profileMap['julia-santos'], type: 'photo', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop', isMain: false, sortOrder: 3 },
      
      // Amanda Oliveira
      { profileId: profileMap['amanda-oliveira'], type: 'photo', url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop', isMain: true, sortOrder: 1 },
      { profileId: profileMap['amanda-oliveira'], type: 'photo', url: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=500&fit=crop', isMain: false, sortOrder: 2 },
      
      // Carol Mello
      { profileId: profileMap['carol-mello'], type: 'photo', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop', isMain: true, sortOrder: 1 },
      
      // Lucas Ferreira
      { profileId: profileMap['lucas-ferreira'], type: 'photo', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop', isMain: true, sortOrder: 1 },
      { profileId: profileMap['lucas-ferreira'], type: 'photo', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop', isMain: false, sortOrder: 2 },
      
      // Rafael Costa
      { profileId: profileMap['rafael-costa'], type: 'photo', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop', isMain: true, sortOrder: 1 },
      
      // Valentina Silva
      { profileId: profileMap['valentina-silva'], type: 'photo', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop', isMain: true, sortOrder: 1 },
      { profileId: profileMap['valentina-silva'], type: 'photo', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop', isMain: false, sortOrder: 2 },
      
      // Bianca Martins
      { profileId: profileMap['bianca-martins'], type: 'photo', url: 'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=400&h=500&fit=crop', isMain: true, sortOrder: 1 },
    ];

    for (const media of mediaItems) {
      await connection.execute(
        'INSERT INTO profile_media (profileId, type, url, isMain, sortOrder) VALUES (?, ?, ?, ?, ?)',
        [media.profileId, media.type, media.url, media.isMain, media.sortOrder]
      );
    }
    console.log(`✅ Created ${mediaItems.length} media items`);

    // Add availability slots for each profile
    const defaultSlots = [
      { dayOfWeek: 1, startTime: '10:00', endTime: '22:00' }, // Monday
      { dayOfWeek: 2, startTime: '10:00', endTime: '22:00' }, // Tuesday
      { dayOfWeek: 3, startTime: '10:00', endTime: '22:00' }, // Wednesday
      { dayOfWeek: 4, startTime: '10:00', endTime: '22:00' }, // Thursday
      { dayOfWeek: 5, startTime: '10:00', endTime: '23:00' }, // Friday
      { dayOfWeek: 6, startTime: '12:00', endTime: '23:00' }, // Saturday
    ];

    for (const profileId of Object.values(profileMap)) {
      for (const slot of defaultSlots) {
        await connection.execute(
          'INSERT INTO availability_slots (profileId, dayOfWeek, startTime, endTime, isActive) VALUES (?, ?, ?, ?, ?)',
          [profileId, slot.dayOfWeek, slot.startTime, slot.endTime, true]
        );
      }
    }
    console.log(`✅ Created availability slots for all profiles`);

    // Add some reviews
    const reviews = [
      { profileId: profileMap['julia-santos'], authorName: 'Carlos M.', rating: 5, comment: 'Excelente profissional! Muito educada e atenciosa. Recomendo!', isApproved: true },
      { profileId: profileMap['julia-santos'], authorName: 'Pedro R.', rating: 5, comment: 'Simplesmente incrível. Superou todas as expectativas.', isApproved: true },
      { profileId: profileMap['julia-santos'], authorName: 'Anônimo', rating: 4, comment: 'Muito boa, pontual e discreta.', isApproved: true },
      { profileId: profileMap['amanda-oliveira'], authorName: 'Ricardo S.', rating: 5, comment: 'A melhor da cidade! Vale cada centavo.', isApproved: true },
      { profileId: profileMap['amanda-oliveira'], authorName: 'João P.', rating: 5, comment: 'Profissional de alto nível. Ambiente impecável.', isApproved: true },
      { profileId: profileMap['valentina-silva'], authorName: 'Marcos L.', rating: 5, comment: 'Linda demais! Muito carinhosa e atenciosa.', isApproved: true },
      { profileId: profileMap['lucas-ferreira'], authorName: 'Ana C.', rating: 5, comment: 'Cavalheiro e muito educado. Excelente companhia!', isApproved: true },
    ];

    for (const review of reviews) {
      await connection.execute(
        'INSERT INTO reviews (profileId, authorName, rating, comment, isApproved, isVisible) VALUES (?, ?, ?, ?, ?, ?)',
        [review.profileId, review.authorName, review.rating, review.comment, review.isApproved, true]
      );
    }
    console.log(`✅ Created ${reviews.length} reviews`);

    // Create subscription plans
    const plans = [
      { name: 'Gratuito', slug: 'free', priceMonthly: '0.00', maxPhotos: 3, maxVideos: 0, featuredPosition: false, verifiedBadge: false, prioritySupport: false, analyticsAccess: false },
      { name: 'Premium', slug: 'premium', priceMonthly: '99.90', priceQuarterly: '269.70', priceYearly: '959.00', maxPhotos: 10, maxVideos: 2, featuredPosition: true, verifiedBadge: true, prioritySupport: false, analyticsAccess: true },
      { name: 'VIP', slug: 'vip', priceMonthly: '199.90', priceQuarterly: '539.70', priceYearly: '1919.00', maxPhotos: 20, maxVideos: 5, featuredPosition: true, verifiedBadge: true, prioritySupport: true, analyticsAccess: true },
    ];

    for (const plan of plans) {
      const columns = Object.keys(plan).join(', ');
      const placeholders = Object.keys(plan).map(() => '?').join(', ');
      const values = Object.values(plan);

      await connection.execute(
        `INSERT INTO subscription_plans (${columns}) VALUES (${placeholders})`,
        values
      );
    }
    console.log(`✅ Created ${plans.length} subscription plans`);

    console.log('\n🎉 Database seeded successfully!');
    console.log(`\nCreated:`);
    console.log(`  - ${profiles.length} profiles`);
    console.log(`  - ${mediaItems.length} media items`);
    console.log(`  - ${Object.keys(profileMap).length * defaultSlots.length} availability slots`);
    console.log(`  - ${reviews.length} reviews`);
    console.log(`  - ${plans.length} subscription plans`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

seed().catch(console.error);
