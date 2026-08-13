export const content = {
  nav: [
    { label: 'ГОЛОВНА', href: '/' },
    { label: 'КАТАЛОГ', href: '/catalog' },
    { label: 'ДОСТАВКА Й ОПЛАТА', href: '/shipping' },
    { label: 'КОНТАКТИ', href: '/contact' }
  ],
  hero: {
    statement: 'АГРЕСИВНИЙ СПОРТ.',
    headline: 'АГРЕСИВНИЙ СПОРТ.',
    subheadline: 'БЕЗКОМПРОМІСНА ЯКІСТЬ ДЛЯ ТИХ, ХТО НЕ ЗДАЄТЬСЯ.',
    cta: 'КАТАЛОГ'
  }
};

export const navigation = [
  { name: 'ГОЛОВНА', href: '/' },
  { name: 'КАТАЛОГ', href: '/catalog' },
  { name: 'ДОСТАВКА Й ОПЛАТА', href: '/shipping' },
  { name: 'КОНТАКТИ', href: '/contact' }
];

/* ------------------------------------------------------------------ */
/*  Collections — groups products for the mega-menu and catalog        */
/* ------------------------------------------------------------------ */
export interface Collection {
  slug: string;
  name: string;
  description: string;
}

export const collections: Collection[] = [
  { slug: 'new-arrivals', name: 'New Arrivals', description: 'Нові колекції щосезону' },
  { slug: 'essentials', name: 'Essentials', description: 'Базовий гардероб ' },
  { slug: 'performance', name: 'Performance', description: 'Максимальна продуктивність' },
  { slug: 'streetwear', name: 'Streetwear', description: 'одяг для любителів вуличного стилю' },
  { slug: 'limited-edition', name: 'Limited Edition', description: 'Ексклюзивні дропи' },
];

/* ------------------------------------------------------------------ */
/*  Product categories for the mega-menu                               */
/* ------------------------------------------------------------------ */
export const menuCategories = [
  {
    title: 'Tops',
    items: ['T-Shirts', 'Tank Tops', 'Long Sleeves', 'Hoodies', 'Compression Tops'],
  },
  {
    title: 'Bottoms',
    items: ['Shorts', 'Joggers', 'Leggings', 'Compression Tights', 'Track Pants'],
  },
  {
    title: 'Outerwear',
    items: ['Hoodies & Zip-ups', 'Jackets', 'Windbreakers', 'Vests'],
  },
  {
    title: 'Accessories',
    items: ['Gym Bags', 'Caps', 'Socks', 'Wrist Wraps', 'Shakers'],
  },
];

/* ------------------------------------------------------------------ */
/*  Products                                                           */
/* ------------------------------------------------------------------ */
export const products = [
  // ── T-Shirts — Men's ──
  {
    id: 'p1',
    name: 'DISCIPLINE BUILDS FREEDOM TEE BLACK',
    price: '1 200 ₴',
    tag: 'ХІТ',
    category: 'T-Shirts',
    collection: 'essentials',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_900/app/0780422a-f84c-42a0-a322-29fdbc3daccb/gf-tee-discipline-black.png',
    description: 'Чорна чоловіча футболка з авторським принтом «Discipline Builds Freedom» і античною скульптурою. Щільний бавовняний трикотаж, дроп-шоулдер крій. Матеріал: 100% кільцевана бавовна 240 г/м².'
  },
  {
    id: 'p2',
    name: 'MENTALITY IS EVERYTHING TEE BEIGE',
    price: '1 100 ₴',
    tag: 'НОВИНКА',
    category: 'T-Shirts',
    collection: 'new-arrivals',
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_900/app/0780422a-f84c-42a0-a322-29fdbc3daccb/gf-tee-mentality-beige.png',
    description: 'Бежева чоловіча футболка з принтом атлетичної фігури та написом «Mentality Is Everything». Преміальна бавовна з м\'яким пісочним відтінком. Матеріал: 100% бавовна 220 г/м².'
  },
  {
    id: 'p3',
    name: 'BUILT DIFFERENT OVERSIZED TEE WHITE',
    price: '1 350 ₴',
    tag: 'УНІСЕКС',
    category: 'T-Shirts',
    collection: 'streetwear',
    sizes: ['M', 'L', 'XL', 'XXL'],
    image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_900/app/0780422a-f84c-42a0-a322-29fdbc3daccb/gf-tee-built-different-white.png',
    description: 'Біла оверсайз-футболка з мінімалістичним написом «Built Different» і фірмовим лого GF. Важкий крій, подовжена довжина. Матеріал: 100% кільцевана бавовна 280 г/м².'
  },
  // ── T-Shirts — Women's ──
  {
    id: 'p5',
    name: 'STRONGER EVERY DAY TEE BLACK',
    price: '1 150 ₴',
    tag: 'ЖІНОЧА',
    category: 'T-Shirts',
    collection: 'performance',
    sizes: ['XS', 'S', 'M', 'L'],
    image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_900/app/0780422a-f84c-42a0-a322-29fdbc3daccb/gf-tee-stronger-womens-black.png',
    description: 'Чорна жіноча футболка з принтом атлетичної фігури та написом «Stronger Every Day». Приталений крій, плоскі шви. Матеріал: 92% бавовна, 8% еластан.'
  },
  {
    id: 'p6',
    name: 'FOCUS ON YOU TEE BEIGE',
    price: '1 050 ₴',
    tag: 'ЖІНОЧА',
    category: 'T-Shirts',
    collection: 'essentials',
    sizes: ['XS', 'S', 'M', 'L'],
    image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_900/app/0780422a-f84c-42a0-a322-29fdbc3daccb/gf-tee-focus-womens-beige.png',
    description: 'Бежева жіноча футболка з делікатним ботанічним принтом і написом «Focus On You». Вільний жіночний крій, м\'яка тканина. Матеріал: 100% органічна бавовна 200 г/м².'
  },
  {
    id: 'p7',
    name: 'MIND BODY SOUL TEE DARK',
    price: '1 200 ₴',
    tag: 'ЖІНОЧА',
    category: 'T-Shirts',
    collection: 'new-arrivals',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_900/app/0780422a-f84c-42a0-a322-29fdbc3daccb/gf-tee-mindbodysoul-womens-dark.png',
    description: 'Темна жіноча футболка з символом лотоса та написом «Mind Body Soul». Для йоги, пілатесу та тренажерного залу. Матеріал: 88% поліестер, 12% еластан.'
  },

  // ── Long Sleeves ──
  {
    id: 'p4',
    name: 'COMPRESSION LONG-SLEEVE ASH',
    price: '1 400 ₴',
    tag: 'УНІСЕКС',
    category: 'Long Sleeves',
    collection: 'performance',
    sizes: ['S', 'M', 'L'],
    image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_900/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-4.png',
    description: 'Компресійний лонгслів для підтримки м\'язів під час силових і кардіотренувань. Чотиристороннє розтягування, UV-захист 30+ та антибактеріальна обробка. Матеріал: 78% нейлон, 22% спандекс.'
  },
  {
    id: 'p8',
    name: 'THERMAL BASE LAYER BLACK',
    price: '1 550 ₴',
    tag: 'НОВИНКА',
    category: 'Long Sleeves',
    collection: 'essentials',
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_900/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-4.png',
    description: 'Термобілизна верхній шар для холодних тренувань на вулиці. Мікрофлісова внутрішня сторона зберігає тепло без зайвого об\'єму. Матеріал: 92% поліестер, 8% еластан.'
  },

  // ── Tank Tops ──
  {
    id: 'p9',
    name: 'IRON TANK TOP BLACK',
    price: '950 ₴',
    tag: 'ХІТ',
    category: 'Tank Tops',
    collection: 'essentials',
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_900/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-1.png',
    description: 'Класична чорна майка з глибокими вирізами для максимальної свободи рук. Подовжена довжина для зручного заправлення. Матеріал: 95% бавовна, 5% еластан.'
  },
  {
    id: 'p10',
    name: 'APEX STRINGER WHITE',
    price: '850 ₴',
    tag: 'УНІСЕКС',
    category: 'Tank Tops',
    collection: 'performance',
    sizes: ['S', 'M', 'L'],
    image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_900/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-2.png',
    description: 'Стрінгер Apex з відкритою спиною для бодібілдерів та кросфітерів. Легка сітчаста тканина забезпечує вентиляцію. Матеріал: 100% поліестер.'
  },

  // ── Hoodies ──
  {
    id: 'p11',
    name: 'SHADOW PULLOVER HOODIE',
    price: '2 200 ₴',
    tag: 'ХІТ',
    category: 'Hoodies',
    collection: 'streetwear',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_900/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-3.png',
    description: 'Щільне худі Shadow з подвійним капюшоном і карманом кенгуру. Матовий чорний фініш, вишитий логотип. Матеріал: 80% бавовна, 20% поліестер, 340 г/м².'
  },
  {
    id: 'p12',
    name: 'ZENITH ZIP HOODIE SLATE',
    price: '2 450 ₴',
    tag: 'НОВИНКА',
    category: 'Hoodies',
    collection: 'new-arrivals',
    sizes: ['M', 'L', 'XL'],
    image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_900/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-4.png',
    description: 'Худі з блискавкою Zenith у кольорі Slate — зональна конструкція з легшою тканиною на спині для розминки і кардіо. Матеріал: 70% бавовна, 30% поліестер.'
  },
  {
    id: 'p13',
    name: 'BLACKOUT CROPPED HOODIE',
    price: '2 100 ₴',
    tag: 'ЖІНОЧА',
    category: 'Hoodies',
    collection: 'limited-edition',
    sizes: ['XS', 'S', 'M', 'L'],
    image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_900/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-1.png',
    description: 'Вкорочене жіноче худі Blackout з вільним кроєм. Широкі манжети та резинка на талії. Ідеально поєднується з леггінсами. Матеріал: 100% бавовна 300 г/м².'
  },

  // ── Shorts ──
  {
    id: 'p14',
    name: 'BLITZ 5" TRAINING SHORTS',
    price: '1 050 ₴',
    tag: 'ХІТ',
    category: 'Shorts',
    collection: 'performance',
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_900/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-2.png',
    description: 'Тренувальні шорти 5 дюймів з внутрішніми стягуючими вставками і кишенею на блискавці. Швидковисихаюча тканина. Матеріал: 86% поліестер, 14% еластан.'
  },
  {
    id: 'p15',
    name: 'CARBON 7" GYM SHORTS',
    price: '1 150 ₴',
    tag: 'УНІСЕКС',
    category: 'Shorts',
    collection: 'essentials',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_900/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-3.png',
    description: 'Універсальні шорти Carbon 7" з чотиристоронньою еластичністю. Резинка на поясі, бокові кишені. Матеріал: 88% поліестер, 12% еластан.'
  },
  {
    id: 'p16',
    name: 'STEALTH COMPRESSION SHORTS',
    price: '950 ₴',
    tag: 'НОВИНКА',
    category: 'Shorts',
    collection: 'performance',
    sizes: ['S', 'M', 'L'],
    image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_900/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-4.png',
    description: 'Компресійні шорти Stealth для підтримки м\'язів стегна. Плоскі шви, силіконова стрічка на нижньому краю. Матеріал: 78% нейлон, 22% спандекс.'
  },

  // ── Joggers ──
  {
    id: 'p17',
    name: 'VIPER SLIM JOGGERS BLACK',
    price: '1 800 ₴',
    tag: 'ХІТ',
    category: 'Joggers',
    collection: 'streetwear',
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_900/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-1.png',
    description: 'Вужчаний крій з манжетами на щиколотках. Три кишені на блискавці, резинка на поясі зі шнурком. Матеріал: 75% бавовна, 25% поліестер.'
  },
  {
    id: 'p18',
    name: 'NOMAD CARGO JOGGERS STONE',
    price: '1 950 ₴',
    tag: 'НОВИНКА',
    category: 'Joggers',
    collection: 'new-arrivals',
    sizes: ['M', 'L', 'XL'],
    image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_900/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-2.png',
    description: 'Карго-джогери Nomad з бічними накладними кишенями. Міцна тканина рипстоп зі стретчем. Матеріал: 98% бавовна, 2% еластан.'
  },

  // ── Leggings ──
  {
    id: 'p19',
    name: 'ECLIPSE HIGH-WAIST LEGGINGS',
    price: '1 600 ₴',
    tag: 'ЖІНОЧА',
    category: 'Leggings',
    collection: 'performance',
    sizes: ['XS', 'S', 'M', 'L'],
    image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_900/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-3.png',
    description: 'Леггінси з високою талією Eclipse — щільна компресія, бічна кишеня для телефону, непрозора тканина. Матеріал: 75% нейлон, 25% спандекс.'
  },
  {
    id: 'p20',
    name: 'ONYX SEAMLESS LEGGINGS',
    price: '1 750 ₴',
    tag: 'ХІТ',
    category: 'Leggings',
    collection: 'limited-edition',
    sizes: ['XS', 'S', 'M', 'L'],
    image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_900/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-4.png',
    description: 'Безшовні леггінси Onyx із зональним плетінням для підтримки та комфорту. Squat-proof. Матеріал: 58% нейлон, 34% поліестер, 8% еластан.'
  },

  // ── Compression Tights ──
  {
    id: 'p21',
    name: 'TITAN COMPRESSION TIGHTS',
    price: '1 500 ₴',
    tag: 'УНІСЕКС',
    category: 'Compression Tights',
    collection: 'performance',
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_900/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-1.png',
    description: 'Повнорозмірні компресійні тайтси Titan для бігу та функціональних тренувань. Рефлективні елементи, кишеня на поясі. Матеріал: 80% нейлон, 20% спандекс.'
  },

  // ── Accessories ──
  {
    id: 'p22',
    name: 'GF TACTICAL GYM BAG',
    price: '2 800 ₴',
    tag: 'НОВИНКА',
    category: 'Gym Bags',
    collection: 'new-arrivals',
    sizes: ['ONE SIZE'],
    image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_900/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-2.png',
    description: 'Тактична спортивна сумка GF із окремим відділенням для взуття, водонепроникним дном і ременем через плече. 45 л. Матеріал: кордура 1000D.'
  },
  {
    id: 'p23',
    name: 'STEALTH PERFORMANCE CAP',
    price: '650 ₴',
    tag: 'УНІСЕКС',
    category: 'Caps',
    collection: 'essentials',
    sizes: ['ONE SIZE'],
    image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_900/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-3.png',
    description: 'Структурована кепка з вигнутим козирком і вишитим логотипом GF. Регульована застібка. Матеріал: 100% перероблений поліестер.'
  },
  {
    id: 'p24',
    name: 'GF TRAINING SOCKS 3-PACK',
    price: '450 ₴',
    tag: 'БАЗОВИЙ',
    category: 'Socks',
    collection: 'essentials',
    sizes: ['S/M', 'L/XL'],
    image: 'https://static.kite.ai/image/upload/f_auto,q_auto,w_900/app/0780422a-f84c-42a0-a322-29fdbc3daccb/iter2/iter2-product-4.png',
    description: 'Набір з 3 пар тренувальних шкарпеток з посиленими зонами п\'яти та носка. Arch-support. Матеріал: 70% бавовна, 25% нейлон, 5% еластан.'
  },
];
