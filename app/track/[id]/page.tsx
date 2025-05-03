"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, Package, Truck, AlertCircle, ChevronRight, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { GetOrdersById } from "@/lib/action"
import { VideoPlayerWithLoader } from "@/components/track/VideoPlayerWithLoader"

interface OrderStatus {
  step: number
  title: string
  description: string
  completed: boolean
  video?: string
}


interface OrderDetails {
    id: any;
    type: any;
    userName: any;
    userEmail: any;
    userRoll: any;
    tshirtDetails: any[];
    statusUpdates?: OrderStatus[]
}

export default function TrackingPage() {
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching order data
    const fetchOrder = async () => {
      const order = await GetOrdersById(orderId);

      if (!order) {
        setOrder(null); // Explicitly set null if not found
        setLoading(false);
        return;
      }

      const statusUpdates = [
        {
          step: 1,
          title: "Order Placed",
          description: "Your order has been received",
          completed: true,
        },
        {
          step: 2,
          title: "Processing",
          description: "Your order is being processed",
          completed: true,
        },
        {
          step: 3,
          title: "Printing Started",
          description: "Your order is now being printed",
          completed: false,
          video: order.type.includes("WebnD Merch") ? "/videos/webnd-print.mp4" : "/videos/code-print.mp4",
        },
      //   {
      //     step: 3,
      //     title: "Shipped",
      //     description: "Your order has been shipped",
      //     completed: false,
      //   },
      //   {
      //     step: 4,
      //     title: "Delivered",
      //     description: "Your order has been delivered",
      //     date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleString(),
      //     completed: Math.random() > 0.8,
      //   },
      ]


      if (!order) return; // or handle appropriately

const final: OrderDetails = {
  ...order,
  statusUpdates,
};

setOrder(final);

      setOrder(final);
        
      setLoading(false)
    }

    fetchOrder()
  }, [orderId])

  const getStatusIcon = (status: OrderStatus) => {
    if (!status.completed) {
      return <Clock className="h-6 w-6 text-gray-400" />
    }

    switch (status.title) {
      case "Order Placed":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />
      case "Processing":
        return <Package className="h-6 w-6 text-blue-500" />
      case "Shipped":
        return <Truck className="h-6 w-6 text-purple-500" />
      case "Delivered":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />
      case "Cancelled":
        return <AlertCircle className="h-6 w-6 text-red-500" />
      default:
        return <Clock className="h-6 w-6 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "Printing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <TrackingPageSkeleton />
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-gray-500 mb-8">We couldn't find an order with the ID: {orderId}</p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-sm text-gray-500 hover:text-[#1a3857]">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-500" />
            <span className="text-sm">Order Tracking</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-bold">Order Tracking</h1>
            <Badge className={`text-sm px-3 py-1 ${getStatusColor("Printing")}`}>
            Processing
            </Badge>
          </div>
        </div>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Order ID:</span>
                  <span className="font-medium">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Customer:</span>
                  <span className="font-medium">{order.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Roll Number:</span>
                  <span className="font-medium">{order.userRoll}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Product:</span>
                  <span className="font-medium">{order.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Quantity:</span>
                  <span className="font-medium">{order.tshirtDetails.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated Delivery:</span>
                  <span className="font-medium">{'8th May 2025'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* T-shirt Details */}
            <Card>
            <CardHeader>
                <CardTitle>T-shirt Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                {order.tshirtDetails.map((tshirt, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Name:</span>
                        <span className="font-medium">{tshirt.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Size:</span>
                        <span className="font-medium">{tshirt.size}</span>
                    </div>
                    {tshirt.position && (
                        <div className="flex justify-between">
                        <span className="text-gray-500">Position:</span>
                        <span className="font-medium">{tshirt.position}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className="font-medium">
                        {tshirt.status ? tshirt.status : "Pending Approval"}
                        </span>
                    </div>
                    </div>
                ))}
                </div>
            </CardContent>
            </Card>


        {/* Tracking Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Tracking Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              {/* Status Updates */}
              <div className="space-y-8">
                {order.statusUpdates!.map((status, index) => (
                  <div key={index} className="relative flex items-start gap-4">
                    <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-white">
                      {getStatusIcon(status)}
                    </div>
                    <div className="ml-10 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{status.title}</h3>
                        {status.completed && (
                          <Badge variant="outline" className="text-xs">
                            Completed
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{status.description}</p>
                    </div>
                    {status.video && (
  <div className="relative mt-4 border rounded-md overflow-hidden bg-black/5">
    <VideoPlayerWithLoader src={status.video} />
  </div>
)}

                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1a3857]/10">
                  <Phone className="h-5 w-5 text-[#1a3857]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Call Us</p>
                  <p className="font-medium">+91 70085 77039</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1a3857]/10">
                  <Mail className="h-5 w-5 text-[#1a3857]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Us</p>
                  <p className="font-medium">secyweb,sg@iitbbs.ac.in</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function TrackingPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>

        {/* Order Details Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {Array(4)
                  .fill(null)
                  .map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
              </div>
              <div className="space-y-4">
                {Array(4)
                  .fill(null)
                  .map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Progress Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {Array(4)
                .fill(null)
                .map((_, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </div>
  )
}
