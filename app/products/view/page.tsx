"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  productName: string;
  type: string;
  sku?: string;
  quantity?: number;
  price?: number;
  description?: string;
  image_url?: string;
  userID?: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function ProductsViewPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [editingQuantity, setEditingQuantity] = useState<number | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const fetchProducts = async (page: number = 1, isPageChange: boolean = false) => {
    if (isPageChange) {
      setPageLoading(true);
    } else {
      setLoading(true);
    }
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/products?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
        setPagination(data.pagination);
        setCurrentPage(page);
        setHasLoaded(true);
      } else {
        alert("Failed to fetch products");
      }
    } catch (error) {
      alert("Failed to fetch products");
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && pagination && page <= pagination.totalPages) {
      fetchProducts(page, true);
    }
  };

  const handlePreviousPage = () => {
    if (pagination?.hasPreviousPage) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleQuantityUpdate = async (productId: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/products/${productId}/quantity`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        alert("Quantity updated successfully!");
        setEditingQuantity(null);
        setNewQuantity(0);
        fetchProducts(currentPage, true);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      alert("Failed to update quantity");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Products Inventory
              </h1>
              <p className="text-slate-600 mt-2">
                View and manage your product inventory
              </p>
            </div>
            <button
              onClick={() => router.push("/products")}
              className="bg-slate-900 text-white py-2.5 px-4 rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 transition-colors font-medium"
            >
              Add New Product
            </button>
          </div>

          {!hasLoaded && (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
              <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">
                  Load Your Products
                </h2>
                <p className="text-slate-600">
                  Click the button below to view your inventory
                </p>
                <button
                  onClick={() => fetchProducts(1)}
                  disabled={loading}
                  className="bg-slate-900 text-white py-2.5 px-6 rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? "Loading Products..." : "Load Products"}
                </button>
              </div>
            </div>
          )}

          {hasLoaded && (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Products {pagination && `(${pagination.totalProducts} total)`}
                  </h2>
                    <button
                     onClick={() => void fetchProducts(currentPage, true)}
                     disabled={loading || pageLoading}
                     className="bg-slate-100 text-slate-900 py-2 px-4 rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                     {loading || pageLoading ? "Refreshing..." : "Refresh"}
                    </button>
                </div>
              </div>

              <div className="p-6 relative">
                {pageLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-b-lg">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                      <span className="text-sm text-slate-600">Loading page {currentPage}...</span>
                    </div>
                  </div>
                )}
                
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-slate-400 mb-4">
                      <svg
                        className="mx-auto h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">
                      No products found
                    </h3>
                    <p className="text-slate-600 mt-1">
                      Get started by adding your first product
                    </p>
                    <button
                      onClick={() => router.push("/products")}
                      className="mt-4 bg-slate-900 text-white py-2 px-4 rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 transition-colors font-medium"
                    >
                      Add Product
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                  {product.productName}
                                </h3>
                                <p className="text-sm text-slate-500">
                                  ID: {product.id}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                              <div>
                                <p className="text-sm font-medium text-slate-700">
                                  Type
                                </p>
                                <p className="text-slate-600">
                                  {product.type || "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-700">
                                  SKU
                                </p>
                                <p className="text-slate-600">
                                  {product.sku || "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-700">
                                  Current Stock
                                </p>
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      (product.quantity || 0) > 10
                                        ? "bg-green-100 text-green-800"
                                        : (product.quantity || 0) > 0
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {product.quantity || 0} units
                                  </span>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-700">
                                  Price
                                </p>
                                <p className="text-slate-600">
                                  ${product.price || 0}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-700">
                                  Created by User
                                </p>
                                <p className="text-slate-600 text-sm">
                                  ID: {product.userID || "Unknown"}
                                </p>
                              </div>
                            </div>

                            {product.description && (
                              <div>
                                <p className="text-sm font-medium text-slate-700">
                                  Description
                                </p>
                                <p className="text-slate-600 text-sm">
                                  {product.description}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="ml-6 flex-shrink-0">
                            {editingQuantity === product.id ? (
                              <div className="flex items-center space-x-2">
                                <div className="flex flex-col space-y-2">
                                  <input
                                    type="number"
                                    value={newQuantity}
                                    onChange={(e) =>
                                      setNewQuantity(Number(e.target.value))
                                    }
                                    className="w-24 px-3 py-2 text-slate-900 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent text-sm"
                                    placeholder="Qty"
                                  />
                                  <div className="flex space-x-1">
                                    <button
                                      onClick={() =>
                                        handleQuantityUpdate(product.id)
                                      }
                                      disabled={loading}
                                      className="flex-1 bg-slate-900 text-white px-3 py-1.5 rounded text-xs hover:bg-slate-800 disabled:opacity-50 font-medium"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingQuantity(null);
                                        setNewQuantity(0);
                                      }}
                                      className="flex-1 bg-slate-200 text-slate-700 px-3 py-1.5 rounded text-xs hover:bg-slate-300 font-medium"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingQuantity(product.id);
                                  setNewQuantity(product.quantity || 0);
                                }}
                                className="bg-slate-100 text-slate-900 px-4 py-2 rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 transition-colors font-medium text-sm"
                              >
                                Update Stock
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-6">
                    <div className="flex items-center text-sm text-slate-600">
                      <span>
                        Showing {((currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                        {Math.min(currentPage * pagination.itemsPerPage, pagination.totalProducts)} of{' '}
                        {pagination.totalProducts} products
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handlePreviousPage}
                        disabled={!pagination.hasPreviousPage || pageLoading}
                        className="px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          let pageNum;
                          if (pagination.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= pagination.totalPages - 2) {
                            pageNum = pagination.totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              disabled={pageLoading}
                              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                pageNum === currentPage
                                  ? 'bg-slate-900 text-white'
                                  : 'text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-700'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={handleNextPage}
                        disabled={!pagination.hasNextPage || pageLoading}
                        className="px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
