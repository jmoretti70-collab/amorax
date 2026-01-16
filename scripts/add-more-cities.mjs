import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function addMoreCities() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    console.log('Adicionando perfis em novas cidades...');
    
    // Perfis para Rio de Janeiro
    const rioProfiles = [
      {
        displayName: 'Fernanda Lima',
        slug: 'fernanda-lima-rj',
        category: 'women',
        city: 'Rio de Janeiro',
        neighborhood: 'Copacabana',
        state: 'RJ',
        age: 26,
        height: 172,
        weight: 58,
        bio: 'Acompanhante de luxo em Copacabana. Atendimento exclusivo com total discrição.',
        pricePerHour: 450,
        whatsapp: '21999887766',
        photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400'
      },
      {
        displayName: 'Ricardo Santos',
        slug: 'ricardo-santos-rj',
        category: 'men',
        city: 'Rio de Janeiro',
        neighborhood: 'Ipanema',
        state: 'RJ',
        age: 30,
        height: 185,
        weight: 82,
        bio: 'Acompanhante masculino em Ipanema. Atendimento para mulheres e casais.',
        pricePerHour: 400,
        whatsapp: '21988776655',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
      },
      {
        displayName: 'Bianca Ferreira',
        slug: 'bianca-ferreira-rj',
        category: 'trans',
        city: 'Rio de Janeiro',
        neighborhood: 'Leblon',
        state: 'RJ',
        age: 24,
        height: 175,
        weight: 65,
        bio: 'Trans elegante no Leblon. Atendimento VIP com local próprio.',
        pricePerHour: 500,
        whatsapp: '21977665544',
        photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400'
      }
    ];
    
    // Perfis para Belo Horizonte
    const bhProfiles = [
      {
        displayName: 'Carolina Melo',
        slug: 'carolina-melo-bh',
        category: 'women',
        city: 'Belo Horizonte',
        neighborhood: 'Savassi',
        state: 'MG',
        age: 25,
        height: 168,
        weight: 55,
        bio: 'Acompanhante sofisticada na Savassi. Atendimento com classe e elegância.',
        pricePerHour: 350,
        whatsapp: '31999887766',
        photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400'
      },
      {
        displayName: 'Thiago Oliveira',
        slug: 'thiago-oliveira-bh',
        category: 'men',
        city: 'Belo Horizonte',
        neighborhood: 'Funcionários',
        state: 'MG',
        age: 28,
        height: 180,
        weight: 78,
        bio: 'Acompanhante masculino em BH. Discreto e profissional.',
        pricePerHour: 300,
        whatsapp: '31988776655',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
      }
    ];
    
    // Perfis para Curitiba
    const curitibaProfiles = [
      {
        displayName: 'Larissa Souza',
        slug: 'larissa-souza-ctba',
        category: 'women',
        city: 'Curitiba',
        neighborhood: 'Batel',
        state: 'PR',
        age: 27,
        height: 170,
        weight: 56,
        bio: 'Acompanhante de alto padrão no Batel. Atendimento exclusivo.',
        pricePerHour: 380,
        whatsapp: '41999887766',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'
      },
      {
        displayName: 'Valentina Trans',
        slug: 'valentina-trans-ctba',
        category: 'trans',
        city: 'Curitiba',
        neighborhood: 'Centro',
        state: 'PR',
        age: 23,
        height: 173,
        weight: 62,
        bio: 'Trans linda e feminina em Curitiba. Atendimento 24h.',
        pricePerHour: 350,
        whatsapp: '41977665544',
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'
      }
    ];
    
    // Perfis para Salvador
    const salvadorProfiles = [
      {
        displayName: 'Gabriela Costa',
        slug: 'gabriela-costa-ssa',
        category: 'women',
        city: 'Salvador',
        neighborhood: 'Barra',
        state: 'BA',
        age: 24,
        height: 165,
        weight: 54,
        bio: 'Morena baiana na Barra. Atendimento com muito carinho.',
        pricePerHour: 300,
        whatsapp: '71999887766',
        photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400'
      },
      {
        displayName: 'Bruno Almeida',
        slug: 'bruno-almeida-ssa',
        category: 'men',
        city: 'Salvador',
        neighborhood: 'Ondina',
        state: 'BA',
        age: 29,
        height: 182,
        weight: 80,
        bio: 'Acompanhante masculino em Salvador. Atendimento para todas.',
        pricePerHour: 280,
        whatsapp: '71988776655',
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400'
      }
    ];
    
    const allProfiles = [...rioProfiles, ...bhProfiles, ...curitibaProfiles, ...salvadorProfiles];
    
    for (const profile of allProfiles) {
      // Insert profile
      const [result] = await connection.execute(
        `INSERT INTO advertiser_profiles 
        (userId, displayName, slug, category, city, neighborhood, state, age, height, weight, bio, pricePerHour, whatsapp, documentsVerified, ageVerified, photosVerified, isActive, plan, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [1, profile.displayName, profile.slug, profile.category, profile.city, profile.neighborhood, profile.state, profile.age, profile.height, profile.weight, profile.bio, profile.pricePerHour, profile.whatsapp, true, true, true, true, 'premium']
      );
      
      const profileId = result.insertId;
      
      // Insert photo
      await connection.execute(
        `INSERT INTO profile_media (profileId, type, url, isMain, createdAt)
        VALUES (?, 'photo', ?, true, NOW())`,
        [profileId, profile.photo]
      );
      
      console.log(`✓ Perfil criado: ${profile.displayName} (${profile.city})`);
    }
    
    console.log('\\n✅ Todos os perfis foram adicionados com sucesso!');
    console.log(`Total: ${allProfiles.length} novos perfis`);
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await connection.end();
  }
}

addMoreCities();
