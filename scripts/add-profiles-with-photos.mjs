import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Gerar sufixo único
const uniqueSuffix = Date.now().toString(36);

async function addProfilesWithPhotos() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    console.log('Adicionando novos perfis com fotos...');
    
    // Adicionar perfis masculinos
    const [lucasResult] = await connection.execute(`
      INSERT INTO advertiser_profiles (
        userId, displayName, slug, category, age, bio, 
        city, state, neighborhood, pricePerHour, 
        height, weight, ethnicity, hairColor, eyeColor,
        bodyType, hasOwnPlace, acceptsCard, acceptsPix, plan
      ) VALUES (
        1, 'Lucas Silva', ?, 'men', 28,
        'Homem elegante e discreto. Atendo com muito carinho e profissionalismo. Experiência em eventos sociais e viagens.',
        'Rio de Janeiro', 'RJ', 'Copacabana', 400.00,
        182, 78, 'Branco', 'Castanho', 'Castanhos',
        'Atlético', true, true, true, 'premium'
      )
    `, [`lucas-silva-${uniqueSuffix}`]);
    const lucasId = lucasResult.insertId;
    console.log(`Lucas Silva criado com ID: ${lucasId}`);
    
    // Adicionar foto do Lucas
    await connection.execute(`
      INSERT INTO profile_media (profileId, type, url, isMain, sortOrder)
      VALUES (?, 'photo', '/profiles/men/lucas-silva.jpg', true, 0)
    `, [lucasId]);
    
    const [rafaelResult] = await connection.execute(`
      INSERT INTO advertiser_profiles (
        userId, displayName, slug, category, age, bio, 
        city, state, neighborhood, pricePerHour, 
        height, weight, ethnicity, hairColor, eyeColor,
        bodyType, hasOwnPlace, acceptsCard, acceptsPix, plan
      ) VALUES (
        1, 'Rafael Costa', ?, 'men', 32,
        'Sofisticado e charmoso. Perfeito para acompanhar em eventos corporativos, viagens de negócios ou momentos especiais.',
        'São Paulo', 'SP', 'Jardins', 500.00,
        185, 82, 'Branco', 'Castanho', 'Verdes',
        'Atlético', true, true, true, 'vip'
      )
    `, [`rafael-costa-${uniqueSuffix}`]);
    const rafaelId = rafaelResult.insertId;
    console.log(`Rafael Costa criado com ID: ${rafaelId}`);
    
    // Adicionar foto do Rafael
    await connection.execute(`
      INSERT INTO profile_media (profileId, type, url, isMain, sortOrder)
      VALUES (?, 'photo', '/profiles/men/rafael-costa.jpg', true, 0)
    `, [rafaelId]);
    
    // Adicionar perfis trans
    const [valentinaResult] = await connection.execute(`
      INSERT INTO advertiser_profiles (
        userId, displayName, slug, category, age, bio, 
        city, state, neighborhood, pricePerHour, 
        height, weight, ethnicity, hairColor, eyeColor,
        bodyType, hasOwnPlace, acceptsCard, acceptsPix, plan
      ) VALUES (
        1, 'Valentina Rose', ?, 'trans', 25,
        'Mulher trans elegante e sofisticada. Atendo com muito carinho, discrição e profissionalismo. Experiência em eventos e viagens.',
        'São Paulo', 'SP', 'Moema', 450.00,
        175, 65, 'Morena', 'Castanho', 'Castanhos',
        'Curvilíneo', true, true, true, 'vip'
      )
    `, [`valentina-rose-${uniqueSuffix}`]);
    const valentinaId = valentinaResult.insertId;
    console.log(`Valentina Rose criada com ID: ${valentinaId}`);
    
    // Adicionar foto da Valentina
    await connection.execute(`
      INSERT INTO profile_media (profileId, type, url, isMain, sortOrder)
      VALUES (?, 'photo', '/profiles/trans/valentina-rose.jpg', true, 0)
    `, [valentinaId]);
    
    const [amandaResult] = await connection.execute(`
      INSERT INTO advertiser_profiles (
        userId, displayName, slug, category, age, bio, 
        city, state, neighborhood, pricePerHour, 
        height, weight, ethnicity, hairColor, eyeColor,
        bodyType, hasOwnPlace, acceptsCard, acceptsPix, plan
      ) VALUES (
        1, 'Amanda Star', ?, 'trans', 27,
        'Loira deslumbrante e carinhosa. Atendo com muita dedicação e profissionalismo. Ambiente discreto e confortável.',
        'Rio de Janeiro', 'RJ', 'Ipanema', 400.00,
        172, 62, 'Branca', 'Loiro', 'Azuis',
        'Curvilíneo', true, true, true, 'premium'
      )
    `, [`amanda-star-${uniqueSuffix}`]);
    const amandaId = amandaResult.insertId;
    console.log(`Amanda Star criada com ID: ${amandaId}`);
    
    // Adicionar foto da Amanda
    await connection.execute(`
      INSERT INTO profile_media (profileId, type, url, isMain, sortOrder)
      VALUES (?, 'photo', '/profiles/trans/amanda-star.jpg', true, 0)
    `, [amandaId]);
    
    // Adicionar slots de disponibilidade para os novos perfis
    const profileIds = [lucasId, rafaelId, valentinaId, amandaId];
    for (const profileId of profileIds) {
      for (let day = 0; day <= 6; day++) {
        await connection.execute(`
          INSERT INTO availability_slots (profileId, dayOfWeek, startTime, endTime, isActive)
          VALUES (?, ?, '10:00', '22:00', true)
        `, [profileId, day]);
      }
    }
    
    // Adicionar algumas avaliações
    const reviews = [
      { profileId: lucasId, name: 'Cliente Anônimo', rating: 5, comment: 'Excelente profissional, muito educado e pontual. Recomendo!' },
      { profileId: rafaelId, name: 'Maria S.', rating: 5, comment: 'Rafael é um cavalheiro perfeito. Me acompanhou em um evento e foi impecável.' },
      { profileId: valentinaId, name: 'João P.', rating: 5, comment: 'Valentina é simplesmente maravilhosa. Muito carinhosa e profissional.' },
      { profileId: amandaId, name: 'Cliente VIP', rating: 5, comment: 'Amanda é incrível! Ambiente muito discreto e atendimento de primeira.' },
    ];
    
    for (const review of reviews) {
      await connection.execute(`
        INSERT INTO reviews (profileId, authorName, rating, comment, isApproved)
        VALUES (?, ?, ?, ?, true)
      `, [review.profileId, review.name, review.rating, review.comment]);
    }
    
    console.log('Novos perfis com fotos adicionados com sucesso!');
    console.log(`Slugs criados: lucas-silva-${uniqueSuffix}, rafael-costa-${uniqueSuffix}, valentina-rose-${uniqueSuffix}, amanda-star-${uniqueSuffix}`);
    
  } catch (error) {
    console.error('Erro ao adicionar perfis:', error);
  } finally {
    await connection.end();
  }
}

addProfilesWithPhotos();
