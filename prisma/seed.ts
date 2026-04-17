import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando carga de datos de prueba...');

// 1. Buscar al Vendedor (User) que creaste en la web
  const seller = await prisma.user.findUnique({
    where: { email: "video@fiddo.com" } // Asegúrate de poner el mail exacto que usaste
  });

  if (!seller) {
    console.error("Vendedor no encontrado. Regístrate en la web primero.");
    process.exit(1);
  }

  // 2. Instanciación del Catálogo (Product)
  const products = [];
  for (let i = 0; i < 5; i++) {
    const product = await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        cost: parseFloat(faker.commerce.price({ min: 10, max: 50 })),
        price: parseFloat(faker.commerce.price({ min: 60, max: 200 })),
        userId: seller.id,
      }
    });
    products.push(product);
  }

  // 3. Instanciación de Compradores y Registro de Operaciones (Customer & Order)
  for (let i = 0; i < 15; i++) {
    const customer = await prisma.customer.create({
      data: {
        mercadolibreId: faker.number.bigInt({ min: BigInt(100000000), max: BigInt(100000000) }),
        nickname: faker.internet.username(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        userId: seller.id,
      }
    });

    const numOrders = faker.number.int({ min: 1, max: 3 });
    
    for (let j = 0; j < numOrders; j++) {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      
      await prisma.order.create({
        data: {
          mercadolibreOrderId: faker.number.bigInt({ min: BigInt(100000000), max: BigInt(100000000) }),
          status: 'paid',
          orderDate: faker.date.recent({ days: 30 }),
          totalAmount: randomProduct.price,
          productId: randomProduct.id,
          userId: seller.id,
          customerId: customer.id,
        }
      });
    }
  }

  console.log('¡Datos generados y almacenados con éxito en la base de datos!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });