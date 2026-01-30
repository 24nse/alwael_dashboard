// src/hooks/useOrders.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types/admin';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch
    fetchOrders();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('orders_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Order changed:', payload);
          fetchOrders(); // Refetch on any change
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      if (data) {
        // Transform snake_case to camelCase
        const transformedData = data.map((item: any) => ({
          id: item.id,
          customerName: item.customer_name,
          phone: item.phone,
          email: item.email,
          propertyType: item.property_type,
          location: item.location,
          budget: item.budget,
          message: item.message,
          status: item.status,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));
        setOrders(transformedData as Order[]);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Transform camelCase to snake_case
      const dbData = {
        customer_name: orderData.customerName,
        phone: orderData.phone,
        email: orderData.email,
        property_type: orderData.propertyType,
        location: orderData.location,
        budget: orderData.budget,
        message: orderData.message,
        status: orderData.status,
      };

      const { data, error: insertError } = await supabase
        .from('orders')
        .insert([dbData])
        .select()
        .single();

      if (insertError) throw insertError;
      return data;
    } catch (err) {
      console.error('Error creating order:', err);
      throw err;
    }
  };

  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    try {
      // Transform camelCase to snake_case
      const dbUpdates: any = {};
      if (updates.customerName) dbUpdates.customer_name = updates.customerName;
      if (updates.phone) dbUpdates.phone = updates.phone;
      if (updates.email) dbUpdates.email = updates.email;
      if (updates.propertyType) dbUpdates.property_type = updates.propertyType;
      if (updates.location) dbUpdates.location = updates.location;
      if (updates.budget) dbUpdates.budget = updates.budget;
      if (updates.message) dbUpdates.message = updates.message;
      if (updates.status) dbUpdates.status = updates.status;

      const { data, error: updateError } = await supabase
        .from('orders')
        .update(dbUpdates)
        .eq('id', orderId)
        .select()
        .single();

      if (updateError) throw updateError;
      return data;
    } catch (err) {
      console.error('Error updating order:', err);
      throw err;
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (deleteError) throw deleteError;
    } catch (err) {
      console.error('Error deleting order:', err);
      throw err;
    }
  };

  return {
    orders,
    loading,
    error,
    createOrder,
    updateOrder,
    deleteOrder,
    refetch: fetchOrders
  };
}