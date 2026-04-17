"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import Image from "next/image";

// --- Funciones para PKCE ---
function base64URLEncode(str: Buffer) {
  return str.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
async function generateCodeChallenge(verifier: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return base64URLEncode(Buffer.from(digest));
}

interface UserProfile {
  user: { id: string; name: string; email: string; createdAt: string };
  mercadolibre: {
    connected: boolean;
    userId?: string;
    expiresAt?: string;
    profile?: {
      nickname: string;
      first_name: string;
      last_name: string;
      email: string;
      permalink: string;
    };
  };
}
interface Customer {
  id: string;
  mercadolibreId: string;
  nickname: string;
  firstName?: string | null;
  lastName?: string | null;
  purchaseCount: number;
  lastOrderId?: string | null;
  lastShippingMethod?: string | null;
  province?: string | null;
}
interface MLProduct {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  available_quantity: number;
}

export default function DashboardPage() {
  // Paginación productos
  const PRODUCTS_PER_PAGE = 10;
  const [productsPage] = useState(1);
  // Paginación compradores
  const CUSTOMERS_PER_PAGE = 20;
  const [customersPage, setCustomersPage] = useState(1);
  const router = useRouter();
  const { notify } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [purchaseFilter, setPurchaseFilter] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("");
  const [availableProvinces, setAvailableProvinces] = useState<string[]>([]);
  const [products, setProducts] = useState<MLProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [promotionData, setPromotionData] = useState<Record<string, { link: string; promotionId: string; expiresAt: string }>>({});
  const [messageModal, setMessageModal] = useState<{ open: boolean; customer?: Customer; text: string }>({ open: false, text: "" });
  const [bulkModal, setBulkModal] = useState<{ open: boolean; text: string }>({ open: false, text: "" });
  const [promotionModal, setPromotionModal] = useState<{ open: boolean; productId?: string; discount: string; days: string }>({ open: false, discount: "", days: "" });
  const [disconnectModal, setDisconnectModal] = useState(false);
  // MercadoLibre
  const mlAppId = process.env.NEXT_PUBLIC_MERCADOLIBRE_APP_ID;
  const mlRedirectUri = process.env.NEXT_PUBLIC_MERCADOLIBRE_REDIRECT_URI;

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      let match = true;
      if (purchaseFilter === "1") match = match && c.purchaseCount === 1;
      else if (purchaseFilter === "1-5") match = match && c.purchaseCount > 1 && c.purchaseCount <= 5;
      else if (purchaseFilter === "5-10") match = match && c.purchaseCount > 5 && c.purchaseCount <= 10;
      else if (purchaseFilter === "10+") match = match && c.purchaseCount > 10;
      if (provinceFilter) match = match && c.province === provinceFilter;
      return match;
    });
  }, [customers, purchaseFilter, provinceFilter]);

  // 1. CARGA DE PERFIL REAL desde la API
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) {
          throw new Error('Error cargando perfil');
        }
        const data = await res.json();
        setUserProfile(data);
      } catch (error) {
        console.error('Error:', error);
        notify('Error cargando perfil');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [notify, router]);

  // 2. CARGA DE COMPRADORES REAL desde la API
  useEffect(() => {
    async function loadCustomers() {
      setCustomersLoading(true);
      try {
        const res = await fetch('/api/customers');
        if (res.ok) {
          const data = await res.json();
          setCustomers(data.customers || []);
          const provinces = [...new Set(data.customers?.map((c: Customer) => c.province).filter(Boolean))];
          setAvailableProvinces(provinces as string[]);
        } else {
          setCustomers([]);
        }
      } catch (error) {
        console.error('Error cargando clientes:', error);
        setCustomers([]);
      } finally {
        setCustomersLoading(false);
      }
    }
    loadCustomers();
  }, [customersPage]);

  // 3. CARGA DE PRODUCTOS REAL desde MercadoLibre
  useEffect(() => {
    async function loadProducts() {
      setProductsLoading(true);
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error cargando productos:', error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    }
    loadProducts();
  }, [productsPage]);

  // Handlers para los modales y acciones
  const handleSendMessage = async () => {
    if (!messageModal.customer || !messageModal.text) return;
    notify("✅ Mensaje enviado a " + messageModal.customer.nickname);
    setMessageModal({ open: false, customer: undefined, text: "" });
  };

  const handleSendBulk = async () => {
    if (!bulkModal.text) return;
    notify("✅ Mensajes masivos enviados correctamente");
    setBulkModal({ open: false, text: "" });
  };

  const handleApplyPromotion = async () => {
    notify("✅ Promoción aplicada con éxito");
    setPromotionModal({ open: false, productId: undefined, discount: "", days: "" });
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    notify("Link copiado");
  };

  const handleLogout = async () => {
    router.push("/login");
  };

  function handleMercadoLibreConnect() {
    notify("Iniciando conexión...");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fiddo-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Modales */}
      <Modal
        title="Enviar mensaje"
        open={messageModal.open}
        onClose={() => setMessageModal({ open: false, customer: undefined, text: "" })}
        onConfirm={handleSendMessage}
        confirmText="Enviar"
      >
        <textarea
          className="w-full border rounded-xl p-2 mt-2"
          rows={4}
          value={messageModal.text}
          onChange={e => setMessageModal(m => ({ ...m, text: e.target.value }))}
          placeholder="Escribe el mensaje individual..."
        />
      </Modal>

      <Modal
        title="Enviar mensaje masivo"
        open={bulkModal.open}
        onClose={() => setBulkModal({ open: false, text: "" })}
        onConfirm={handleSendBulk}
        confirmText="Enviar"
      >
        <textarea
          className="w-full border rounded-xl p-2 mt-2"
          rows={4}
          value={bulkModal.text}
          onChange={e => setBulkModal(m => ({ ...m, text: e.target.value }))}
          placeholder="Mensaje para todos los compradores filtrados..."
        />
      </Modal>

      <Modal
        title="Aplicar promoción"
        open={promotionModal.open}
        onClose={() => setPromotionModal({ open: false, productId: undefined, discount: "", days: "" })}
        onConfirm={handleApplyPromotion}
        confirmText="Aplicar"
      >
        <div className="flex flex-col gap-2">
          <input
            className="border rounded-xl p-2"
            type="number"
            placeholder="Descuento (%)"
            value={promotionModal.discount}
            onChange={e => setPromotionModal(m => ({ ...m, discount: e.target.value }))}
          />
          <input
            className="border rounded-xl p-2"
            type="number"
            placeholder="Días de duración"
            value={promotionModal.days}
            onChange={e => setPromotionModal(m => ({ ...m, days: e.target.value }))}
          />
        </div>
      </Modal>

      {/* Dashboard principal */}
      <div className="min-h-screen bg-fiddo-blue/10 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header del Dashboard */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img src="/brand/Fiddo.JPG" alt="Fiddo Logo" style={{height: 48, width: 'auto', maxWidth: 80}} />
                <div>
                  <span className="font-bold text-2xl text-fiddo-blue">F</span><span className="font-bold text-2xl text-fiddo-orange">i</span><span className="font-bold text-2xl text-fiddo-turquoise">ddo</span>
                  <p className="text-gray-600 mt-1">¡Bienvenido, {userProfile?.user.name}!</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-md bg-fiddo-orange px-4 py-2 font-semibold text-white transition-colors hover:bg-fiddo-turquoise"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Integraciones */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">MercadoLibre</h2>
              <div className="space-y-3">
                {/* Estado de conexión real */}
                {userProfile?.mercadolibre.connected ? (
                  <>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-green-700 font-medium">Conectado</span>
                    </div>
                    {userProfile.mercadolibre.profile && (
                      <>
                        <div>
                          <span className="text-gray-600">Usuario:</span>
                          <span className="ml-2 font-medium">{userProfile.mercadolibre.profile.nickname}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Nombre:</span>
                          <span className="ml-2 font-medium">
                            {userProfile.mercadolibre.profile.first_name} {userProfile.mercadolibre.profile.last_name}
                          </span>
                        </div>
                      </>
                    )}
                    <button className="w-full rounded-md bg-fiddo-orange/20 px-4 py-2 font-medium text-fiddo-orange">
                      Cuenta verificada
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-red-700 font-medium">No conectado</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Conecta tu cuenta de MercadoLibre para ver tus productos y clientes.
                    </p>
                    <button
                      onClick={handleMercadoLibreConnect}
                      className="w-full rounded-md bg-fiddo-blue px-4 py-2 font-medium text-white hover:bg-fiddo-turquoise transition"
                    >
                      Conectar MercadoLibre
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Listado de compradores */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Compradores</h2>
            <div className="flex flex-wrap items-center mb-4 gap-4">
              <div className="flex items-center text-sm">
                <label className="mr-2 text-gray-700">Filtro compras:</label>
                <select className="border rounded px-2 py-1">
                  <option>Todas</option>
                  <option>Recurrentes</option>
                </select>
              </div>
              <button
                onClick={() => setBulkModal({ open: true, text: "" })}
                className="ml-auto rounded bg-fiddo-blue px-3 py-1 text-sm font-medium text-white hover:bg-fiddo-turquoise"
              >
                Enviar mensaje masivo
              </button>
            </div>
            
            {customersLoading ? (
              <p className="text-gray-600">Cargando compradores...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Nickname</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Nombre</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Provincia</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Compras</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{customer.nickname}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{customer.firstName} {customer.lastName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{customer.province}</td>
                        <td className="px-4 py-3 text-sm font-bold text-fiddo-blue">{customer.purchaseCount}</td>
                        <td className="px-4 py-3">
                          <button
                            className="rounded bg-fiddo-blue px-3 py-1 text-white text-xs hover:bg-fiddo-turquoise transition"
                            onClick={() => setMessageModal({ open: true, customer, text: '' })}
                          >
                            Mensaje
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Listado de productos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Productos en Catálogo</h2>
            {productsLoading ? (
              <p className="text-gray-600">Cargando productos...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white flex flex-col">
                    <div className="w-full h-32 flex items-center justify-center p-2">
                      <img src={product.thumbnail} alt={product.title} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="p-3 flex flex-col flex-grow bg-neutral-50 border-t">
                      <div className="text-xs font-bold text-gray-800 line-clamp-2 min-h-[32px]">{product.title}</div>
                      <div className="text-fiddo-blue font-black text-base my-1">${product.price.toLocaleString()}</div>
                      <div className="text-[10px] text-gray-500 mb-3">Disponibles: {product.available_quantity}</div>
                      <button
                        onClick={() => setPromotionModal({ open: true, productId: product.id, discount: '', days: '' })}
                        className="rounded-full bg-fiddo-orange py-1 text-[10px] font-bold text-white hover:bg-fiddo-turquoise transition mt-auto"
                      >
                        Crear Promoción
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}