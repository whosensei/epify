'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AddProductForm {
  name: string;
  type: string;
  sku: string;
  image_url: string;
  description: string;
  quantity: string;
  price: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const [formData, setFormData] = useState<AddProductForm>({
    name: '',
    type: '',
    sku: '',
    image_url: '',
    description: '',
    quantity: '',
    price: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        return;
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.quantity) || 0,
          price: Number(formData.price) || 0
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Product added successfully!');
        setFormData({
          name: '',
          type: '',
          sku: '',
          image_url: '',
          description: '',
          quantity: '',
          price: '',
        });
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      alert('Failed to add product');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProducts = () => {
    router.push('/products/view');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add New Product</h1>
            <p className="text-slate-600 mt-2">Fill in the details to add a product to your inventory</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
            <form onSubmit={handleAddProduct} className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Type
                  </label>
                  <input
                    type="text"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent"
                    placeholder="Enter product type"
                  />
                </div>
      
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    required
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent"
                    placeholder="Enter SKU"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    required
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent"
                    placeholder="Enter quantity"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent"
                    placeholder="Enter price"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent resize-none"
                    placeholder="Enter product description"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-white py-2.5 px-4 rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? 'Adding Product...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <div className="text-center space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">View Products</h2>
              <p className="text-sm text-slate-600">Browse and manage your existing inventory</p>
              <button
                onClick={handleViewProducts}
                className="bg-slate-100 text-slate-900 py-2.5 px-6 rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 transition-colors font-medium"
              >
                View All Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 