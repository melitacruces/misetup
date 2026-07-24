const { Client, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

const DEMO_PROFILE = {
  title: 'MiSetup - Panel de Inventario Personal',
  tagline: 'Un setup híbrido para crear, jugar, producir audio y trabajar desde cualquier lugar.',
  description:
    'Escenario de ejemplo con el inventario actual, inversión conocida y una wishlist priorizada para el próximo ciclo de upgrades.',
  defaultCurrency: 'CLP',
  wishlistBudget: 1000000,
};

const DEMO_ITEMS = [
  {
    brand: 'be quiet!',
    model: 'Pure Base 500 Window White',
    type: 'case',
    itemKind: 'hardware',
    status: 'active',
    websiteUrl: 'https://www.bequiet.com/es/case/1718',
    tags: ['pc', 'silencio', 'atx'],
    purchasePrice: 129990,
    purchaseDate: '2025-04-12',
    warrantyUntil: '2027-04-12',
    choiceReason: 'Equilibra flujo de aire, construcción sobria y un nivel de ruido bajo para jornadas largas.',
    compatibilityNotes: 'Admite la placa micro-ATX actual, radiador frontal de hasta 360 mm y ventiladores de 140 mm.',
  },
  {
    brand: 'MSI',
    model: 'PRO B760M-P DDR4',
    type: 'motherboard',
    itemKind: 'hardware',
    status: 'active',
    websiteUrl: 'https://latam.msi.com/Motherboard/PRO-B760M-P-DDR4/Overview',
    tags: ['pc', 'lga1700', 'ddr4'],
    purchasePrice: 119990,
    purchaseDate: '2025-04-12',
    warrantyUntil: '2028-04-12',
    choiceReason: 'Mantiene la plataforma Intel con funciones suficientes sin encarecer una configuración enfocada en rendimiento.',
    compatibilityNotes: 'Compatible con el Core i5-14400F, memoria DDR4 y la GPU PCIe 5.0 planificada.',
  },
  {
    brand: 'Kingston',
    model: 'FURY Beast DDR4',
    type: 'ram',
    itemKind: 'hardware',
    status: 'active',
    websiteUrl: 'https://www.kingston.com/latam/memory/gaming/kingston-fury-beast-ddr4-memory',
    tags: ['pc', 'memoria', 'dual-channel'],
    purchasePrice: 64990,
    purchaseDate: '2025-04-12',
    warrantyUntil: '2030-04-12',
    choiceReason: 'La configuración en dual channel entrega una base equilibrada para producción y multitarea.',
    compatibilityNotes: 'Perfil XMP de 3200 MHz validado con la placa MSI PRO B760M-P DDR4.',
  },
  {
    brand: 'be quiet!',
    model: 'Shadow Rock 3',
    type: 'cooler',
    itemKind: 'hardware',
    status: 'active',
    websiteUrl: 'https://www.bequiet.com/es/cpucooler/1743',
    tags: ['pc', 'cpu', 'silencio'],
    purchasePrice: 54990,
    purchaseDate: '2025-04-12',
    warrantyUntil: '2028-04-12',
    choiceReason: 'Prioriza una refrigeración silenciosa y estable para cargas largas de CPU.',
    compatibilityNotes: 'Altura compatible con el Pure Base 500 y anclaje para LGA 1700.',
  },
  {
    brand: 'be quiet!',
    model: 'Silent Wings 4 HS',
    type: 'fans',
    itemKind: 'hardware',
    status: 'active',
    websiteUrl: 'https://www.bequiet.com/es/casefans/3704',
    tags: ['pc', 'airflow', 'pwm'],
    purchasePrice: 39990,
    purchaseDate: '2025-04-12',
    warrantyUntil: '2028-04-12',
    choiceReason: 'Mejoran el flujo de aire sin comprometer el perfil acústico del equipo.',
    compatibilityNotes: 'Dos ventiladores de 140 mm controlados desde los conectores PWM de la placa MSI.',
  },
  {
    brand: 'Gigabyte',
    model: 'AORUS ELITE P850W 80+ Platinum',
    type: 'psu',
    itemKind: 'hardware',
    status: 'active',
    websiteUrl: 'https://www.gigabyte.com/cl/Power-Supply/GP-AE850PM-PG5-ICE-rev-20',
    tags: ['pc', 'fuente', 'atx-3.1'],
    purchasePrice: 149990,
    purchaseDate: '2025-04-12',
    warrantyUntil: '2035-04-12',
    choiceReason: 'Deja margen para una GPU más exigente y reduce el cableado gracias a su diseño modular.',
    compatibilityNotes: 'Incluye soporte ATX 3.1 y conector PCIe 5.1 para la futura tarjeta gráfica.',
  },
  {
    brand: 'MSI',
    model: 'GeForce RTX 5050 8G GAMING OC',
    type: 'gpu',
    itemKind: 'hardware',
    status: 'wishlist',
    websiteUrl: 'https://latam.msi.com/Graphics-Card/GeForce-RTX-5050-8G-GAMING-OC',
    tags: ['pc', 'upgrade', 'gpu'],
    targetPrice: 429990,
    wishlistPriority: 1,
    plannedFor: '2026-10-15',
    roadmapPosition: 0,
    choiceReason: 'Es el upgrade con mayor impacto para edición acelerada, juegos y cargas de IA locales.',
    compatibilityNotes: 'La fuente de 850 W y el chasis ya tienen margen térmico y alimentación PCIe 5.1.',
  },
  {
    brand: 'Intel',
    model: 'Core i5-14400F',
    type: 'cpu',
    itemKind: 'hardware',
    status: 'active',
    websiteUrl: 'https://www.intel.la/content/www/xl/es/products/sku/236777/intel-core-i5-processor-14400f-20m-cache-up-to-4-70-ghz/specifications.html',
    tags: ['pc', 'cpu', 'productividad'],
    purchasePrice: 179990,
    purchaseDate: '2025-04-12',
    warrantyUntil: '2028-04-12',
    choiceReason: 'Ofrece núcleos suficientes para producción, multitarea y juegos sin sobredimensionar el presupuesto.',
    compatibilityNotes: 'Instalado en el socket LGA 1700 de la MSI B760M y refrigerado por Shadow Rock 3.',
  },
  {
    brand: 'Irok',
    model: 'MG68 ACE',
    type: 'keyboard',
    itemKind: 'hardware',
    status: 'active',
    websiteUrl: 'https://es.aliexpress.com/item/1005011939311444.html?spm=a2g0o.order_list.order_list_main.10.45ed194dsPWJBy&gatewayAdapt=glo2esp',
    tags: ['desk', 'teclado', 'hall-effect'],
    purchasePrice: 89990,
    purchaseDate: '2025-03-04',
    warrantyUntil: '2026-03-04',
    choiceReason: 'Los switches magnéticos y la tasa de sondeo alta dan una respuesta consistente para escribir y jugar.',
    compatibilityNotes: 'Conexión USB directa al escritorio; perfiles configurables para trabajo y juegos.',
  },
  {
    brand: 'GameSir',
    model: 'G7 Pro',
    type: 'controller',
    itemKind: 'hardware',
    status: 'wishlist',
    websiteUrl: 'https://es.aliexpress.com/item/1005010447557053.html?spm=a2g0o.order_list.order_list_main.5.45ed194dsPWJBy&gatewayAdapt=glo2esp',
    tags: ['desk', 'gaming', 'hall-effect'],
    targetPrice: 99990,
    wishlistPriority: 2,
    plannedFor: '2026-11-05',
    roadmapPosition: 1,
    choiceReason: 'Añade un mando con sticks magnéticos para evitar el drift y completar el escritorio híbrido.',
    compatibilityNotes: 'Compatible con PC y la colección actual; evaluar la versión con cable según disponibilidad local.',
  },
  {
    brand: 'MCHOSE',
    model: 'A7 Ultra',
    type: 'mouse',
    itemKind: 'hardware',
    status: 'active',
    websiteUrl: 'https://es.aliexpress.com/item/1005008800493208.html?spm=a2g0o.order_list.order_list_main.70.45ed194dsPWJBy&gatewayAdapt=glo2esp',
    tags: ['desk', 'mouse', 'productividad'],
    purchasePrice: 69990,
    purchaseDate: '2025-03-04',
    warrantyUntil: '2026-03-04',
    choiceReason: 'Combina sensor de alta precisión, peso contenido y switches ópticos para una respuesta predecible.',
    compatibilityNotes: 'Funciona mediante receptor inalámbrico y admite perfiles de sensibilidad para trabajo o juegos.',
  },
  {
    brand: 'tomtoc',
    model: 'Navigator-T67',
    type: 'bag',
    itemKind: 'hardware',
    status: 'active',
    websiteUrl: 'https://www.tomtoc.com/products/navigator-t67-travel-laptop-backpack',
    tags: ['mobile', 'viajes', 'organización'],
    purchasePrice: 89990,
    purchaseDate: '2025-02-10',
    warrantyUntil: '2027-02-10',
    choiceReason: 'Organiza un setup móvil completo sin sacrificar acceso rápido a cables y periféricos.',
    compatibilityNotes: 'Capacidad de 38 L para portátil, interfaz, accesorios y una jornada de viaje.',
  },
  {
    brand: 'UGREEN',
    model: 'Nexode Power Bank',
    type: 'battery',
    itemKind: 'hardware',
    status: 'wishlist',
    websiteUrl: 'https://es.aliexpress.com/item/1005006118904725.html?spm=a2g0o.order_list.order_list_main.24.45ed194dsPWJBy&gatewayAdapt=glo2esp',
    tags: ['mobile', 'carga', 'viajes'],
    targetPrice: 149990,
    wishlistPriority: 3,
    plannedFor: '2027-03-01',
    roadmapPosition: 3,
    choiceReason: 'Da autonomía real para sesiones fuera del escritorio y recargas simultáneas de varios equipos.',
    compatibilityNotes: 'Verificar que el cargador y los cables USB-C soporten la potencia de 145 W anunciada.',
  },
  {
    brand: 'Ableton',
    model: 'Live 12 standard',
    type: 'daw',
    itemKind: 'software',
    status: 'active',
    websiteUrl: 'https://www.ableton.com/es/live/',
    tags: ['studio', 'producción', 'software'],
    purchasePrice: 229990,
    purchaseDate: '2025-01-20',
    choiceReason: 'Centraliza composición, arreglos y mezcla en un flujo de trabajo familiar y rápido.',
    compatibilityNotes: 'Integración nativa con Launchkey y salida de audio a través de la interfaz Audient.',
  },
  {
    brand: 'Audient',
    model: 'iD4 MKII',
    type: 'interface',
    itemKind: 'hardware',
    status: 'active',
    websiteUrl: 'https://audient.com/es/products/audio-interfaces/id4/overview/',
    tags: ['studio', 'audio', 'usb-c'],
    purchasePrice: 229990,
    purchaseDate: '2025-01-20',
    warrantyUntil: '2027-01-20',
    choiceReason: 'Aporta un preamplificador limpio y controles físicos directos para grabar y monitorear sin fricción.',
    compatibilityNotes: 'Entrega ganancia suficiente para el SM7dB y salida dedicada hacia monitores o audífonos.',
  },
  {
    brand: 'Shure',
    model: 'SM7dB',
    type: 'mic',
    itemKind: 'hardware',
    status: 'active',
    websiteUrl: 'https://www.shure.com/es-MX/productos/microfonos/sm7db?variant=SM7dB',
    tags: ['studio', 'voz', 'streaming'],
    purchasePrice: 499990,
    purchaseDate: '2025-01-20',
    warrantyUntil: '2027-01-20',
    choiceReason: 'El preamplificador integrado reduce complejidad y conserva una voz controlada en una sala doméstica.',
    compatibilityNotes: 'Conectado por XLR a la Audient iD4 MKII; usar brazo articulado y filtro pop.',
  },
  {
    brand: 'Audio-Technica',
    model: 'ATH-M50x',
    type: 'monitors',
    itemKind: 'hardware',
    status: 'active',
    websiteUrl: 'https://www.audio-technica.com/en-us/ath-m50x',
    tags: ['studio', 'monitoreo', 'audio'],
    purchasePrice: 149990,
    purchaseDate: '2025-01-20',
    warrantyUntil: '2027-01-20',
    choiceReason: 'Son una referencia cerrada fiable para revisar mezclas, grabar voces y trabajar sin molestar al entorno.',
    compatibilityNotes: 'Conector desmontable de 2.5 mm; usar con la salida de audífonos de la Audient iD4 MKII.',
    manualUrls: ['https://www.audio-technica.com/en-us/support/ath-m50x'],
  },
  {
    brand: 'Novation',
    model: 'Launchkey Mini 25 mk4',
    type: 'midi',
    itemKind: 'hardware',
    status: 'wishlist',
    websiteUrl: 'https://novationmusic.com/products/launchkey-mini-25',
    tags: ['studio', 'midi', 'ableton'],
    targetPrice: 169990,
    wishlistPriority: 2,
    plannedFor: '2027-01-15',
    roadmapPosition: 2,
    choiceReason: 'Acelera la composición con controles físicos y una integración directa con el flujo de Ableton.',
    compatibilityNotes: 'Funciona por USB-C con Ableton Live 12; reservar un puerto libre en el hub de escritorio.',
  },
];

function connectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING
  );
}

async function run() {
  const databaseUrl = connectionString();
  if (!databaseUrl) {
    throw new Error('Falta DATABASE_URL o una variable POSTGRES_URL compatible.');
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    await client.query('BEGIN');
    await client.query(
      `
        UPDATE setup_profile
        SET
          title = $1,
          tagline = $2,
          description = $3,
          default_currency = $4,
          wishlist_budget = $5,
          show_prices = TRUE,
          updated_at = NOW()
        WHERE id = 1
      `,
      [
        DEMO_PROFILE.title,
        DEMO_PROFILE.tagline,
        DEMO_PROFILE.description,
        DEMO_PROFILE.defaultCurrency,
        DEMO_PROFILE.wishlistBudget,
      ]
    );

    for (const item of DEMO_ITEMS) {
      const isWishlist = item.status === 'wishlist';
      const { rowCount } = await client.query(
        `
          UPDATE equipment
          SET
            type = $1,
            item_kind = $2,
            status = $3,
            is_public = TRUE,
            tags = $4,
            description = COALESCE($5, description),
            website_url = $6,
            purchase_price = $7,
            target_price = $8,
            currency = 'CLP',
            purchase_date = $9,
            warranty_until = $10,
            choice_reason = $11,
            manual_urls = $12,
            wishlist_priority = $13,
            planned_for = $14,
            roadmap_position = $15,
            compatibility_notes = $16,
            private_notes = $17,
            updated_at = NOW()
          WHERE brand = $18 AND model = $19
        `,
        [
          item.type,
          item.itemKind,
          item.status,
          item.tags,
          item.description || null,
          item.websiteUrl,
          isWishlist ? null : item.purchasePrice,
          isWishlist ? item.targetPrice : null,
          isWishlist ? null : item.purchaseDate || null,
          isWishlist ? null : item.warrantyUntil || null,
          item.choiceReason,
          item.manualUrls || [],
          isWishlist ? item.wishlistPriority : 2,
          isWishlist ? item.plannedFor : null,
          isWishlist ? item.roadmapPosition : 0,
          item.compatibilityNotes,
          'Dato de demostración: puedes reemplazarlo desde el modo editor.',
          item.brand,
          item.model,
        ]
      );

      if (rowCount !== 1) {
        throw new Error(`No se encontró un único elemento para ${item.brand} ${item.model}.`);
      }
    }

    await client.query('COMMIT');
    console.log(`Datos de demostración actualizados: ${DEMO_ITEMS.length} elementos y 4 upgrades.`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
