import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    // Verificar que el usuario está conectado a MercadoLibre
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { mercadolibreAccessToken: true },
    });

    if (!user?.mercadolibreAccessToken) {
      return NextResponse.json(
        { error: 'Debes conectar tu cuenta de MercadoLibre primero' },
        { status: 400 }
      );
    }

    // Datos de prueba basados en la API de MercadoLibre
    const testProducts = [
      {
        id: 'MLA' + Math.random().toString(36).substr(2, 9),
        title: 'iPhone 15 Pro Max 256GB',
        price: 1299999,
        thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_2X_123456-MLA12345678901-012023-F.webp',
        available_quantity: 5,
        status: 'active',
        sold_quantity: 12,
      },
      {
        id: 'MLA' + Math.random().toString(36).substr(2, 9),
        title: 'Samsung Galaxy S24 Ultra',
        price: 1099999,
        thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_2X_234567-MLA12345678902-012023-F.webp',
        available_quantity: 8,
        status: 'active',
        sold_quantity: 7,
      },
      {
        id: 'MLA' + Math.random().toString(36).substr(2, 9),
        title: 'MacBook Air M2 13" 256GB',
        price: 1499999,
        thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_2X_345678-MLA12345678903-012023-F.webp',
        available_quantity: 3,
        status: 'active',
        sold_quantity: 15,
      },
      {
        id: 'MLA' + Math.random().toString(36).substr(2, 9),
        title: 'iPad Pro 11" M2 128GB',
        price: 899999,
        thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_2X_456789-MLA12345678904-012023-F.webp',
        available_quantity: 6,
        status: 'active',
        sold_quantity: 9,
      },
    ];

    const testCustomers = [
      {
        id: 'CUST' + Math.random().toString(36).substr(2, 9),
        name: 'Juan Pérez',
        email: 'juan.perez@example.com',
        orders_count: 3,
        total_spent: 2899997,
      },
      {
        id: 'CUST' + Math.random().toString(36).substr(2, 9),
        name: 'María García',
        email: 'maria.garcia@example.com',
        orders_count: 2,
        total_spent: 1599998,
      },
      {
        id: 'CUST' + Math.random().toString(36).substr(2, 9),
        name: 'Carlos López',
        email: 'carlos.lopez@example.com',
        orders_count: 5,
        total_spent: 4199995,
      },
      {
        id: 'CUST' + Math.random().toString(36).substr(2, 9),
        name: 'Ana Martínez',
        email: 'ana.martinez@example.com',
        orders_count: 1,
        total_spent: 899999,
      },
    ];

    const testOrders = [
      {
        id: 'ORDER' + Math.random().toString(36).substr(2, 9),
        product_id: testProducts[0].id,
        customer_id: testCustomers[0].id,
        amount: 1299999,
        quantity: 1,
        status: 'completed',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
      },
      {
        id: 'ORDER' + Math.random().toString(36).substr(2, 9),
        product_id: testProducts[1].id,
        customer_id: testCustomers[1].id,
        amount: 1099999,
        quantity: 1,
        status: 'completed',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 días atrás
      },
      {
        id: 'ORDER' + Math.random().toString(36).substr(2, 9),
        product_id: testProducts[2].id,
        customer_id: testCustomers[2].id,
        amount: 1499999,
        quantity: 1,
        status: 'completed',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 día atrás
      },
    ];

    // Guardar en localStorage del lado del cliente
    // (En una implementación real, esto se guardaría en la base de datos)

    return NextResponse.json({
      success: true,
      message: 'Datos de prueba insertados correctamente',
      data: {
        products: testProducts,
        customers: testCustomers,
        orders: testOrders,
        stats: {
          totalProducts: testProducts.length,
          totalCustomers: testCustomers.length,
          totalOrders: testOrders.length,
          revenue: testOrders.reduce((sum, order) => sum + order.amount, 0),
        },
      },
    });
  } catch (error) {
    console.error('Error insertando datos de prueba:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
