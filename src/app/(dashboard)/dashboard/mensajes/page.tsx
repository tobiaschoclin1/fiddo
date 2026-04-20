"use client";

import { useState, useEffect, Suspense } from "react";
import { useToast } from "@/components/ui/Toast";
import { initiateMLOAuth } from "@/lib/mercadolibre-oauth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSearchParams } from "next/navigation";

export const dynamic = 'force-dynamic';

interface UserProfile {
  mercadolibre: {
    connected: boolean;
  };
}

interface Customer {
  id: string;
  name?: string;
  email?: string;
}

function MensajesContent() {
  const { notify } = useToast();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) throw new Error(t('errorLoadingProfile'));
        const data = await res.json();
        setUserProfile(data);

        if (data.mercadolibre.connected) {
          const testCustomers = localStorage.getItem('test_customers');
          if (testCustomers) {
            setCustomers(JSON.parse(testCustomers));
          }
        }

        // Si hay customers en la URL, pre-seleccionarlos
        const customersParam = searchParams.get('customers');
        if (customersParam) {
          setSelectedCustomers(new Set(customersParam.split(',')));
        }
      } catch (error) {
        console.error('Error:', error);
        notify(t('errorLoadingData'), 'error');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [notify, searchParams]);

  const toggleCustomer = (id: string) => {
    setSelectedCustomers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      notify(t('writeMessage'), 'warning');
      return;
    }

    if (selectedCustomers.size === 0) {
      notify(t('selectAtLeastOne'), 'warning');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerIds: Array.from(selectedCustomers),
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        notify(data.message, 'success');
        setMessage('');
        setSelectedCustomers(new Set());
      } else {
        notify(data.error || t('errorSendingMessages'), 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      notify(t('errorSendingMessages'), 'error');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-fiddo-orange"></div>
      </div>
    );
  }

  if (!userProfile?.mercadolibre.connected) {
    return (
      <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">{t('mensajes')}</h1>
          <p className="text-slate-400 mt-1">{t('manageConversations')}</p>
        </header>
        <div className="p-8 flex items-center justify-center">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center max-w-2xl">
            <div className="h-20 w-20 bg-slate-700/50 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">{t('connectML')}</h2>
            <p className="text-slate-400 mb-6">{t('toManageMessages')}</p>
            <button
              onClick={initiateMLOAuth}
              className="px-8 py-3 bg-gradient-to-r from-fiddo-orange to-fiddo-turquoise text-white font-semibold rounded-xl hover:shadow-2xl transition"
            >
              {t('connect')} MercadoLibre
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50 px-8 py-6">
        <h1 className="text-3xl font-bold text-white">{t('mensajes')}</h1>
        <p className="text-slate-400 mt-1">{t('sendMessagesToCustomers')}</p>
      </header>

      <div className="p-8 max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Selection */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">{t('selectCustomers')}</h2>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {customers.length === 0 ? (
                <p className="text-slate-400 text-center py-8">{t('noCustomersAvailable')}</p>
              ) : (
                customers.map((customer) => (
                  <label
                    key={customer.id}
                    className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCustomers.has(customer.id)}
                      onChange={() => toggleCustomer(customer.id)}
                      className="rounded border-slate-500 text-fiddo-orange focus:ring-fiddo-orange"
                    />
                    <div className="h-10 w-10 bg-gradient-to-br from-fiddo-orange to-fiddo-turquoise rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {customer.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{customer.name || t('noName')}</p>
                      <p className="text-sm text-slate-400 truncate">{customer.email || 'N/A'}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <p className="text-sm text-slate-400">
                {selectedCustomers.size} {selectedCustomers.size === 1 ? t('customer') : t('customers_')} {t('selectedCustomers')}
              </p>
            </div>
          </div>

          {/* Message Composer */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">{t('messageText')}</h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('writeMessageHere')}
              className="w-full h-[400px] px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fiddo-turquoise resize-none"
            />
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-400">{message.length} {t('characters')}</p>
              <button
                onClick={handleSendMessage}
                disabled={sending || selectedCustomers.size === 0 || !message.trim()}
                className="px-8 py-3 bg-gradient-to-r from-fiddo-orange to-fiddo-turquoise text-white font-semibold rounded-xl hover:shadow-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? t('sending') : `${t('send')} (${selectedCustomers.size})`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MensajesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-fiddo-orange"></div>
      </div>
    }>
      <MensajesContent />
    </Suspense>
  );
}
