"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Download, Search, Filter, ChevronDown, CheckCircle, XCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import Image from "next/image"
import { AllOrders, UpdateStatus } from "@/lib/action"
import { Models } from "node-appwrite"

interface Order {
    $id:string;
  id: any;
  type: any;
  userName: any;
  userEmail: any;
  userRoll: any;
  nameToPrint: any;
  size: any;
  position: any;
  payment: any;
  status: any;
}

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await AllOrders();
      setOrders(response)
      setLoading(false)
    }

    fetchOrders()
  }, [])

  const handleDownloadCSV = () => {
    const dataToExport = orders.filter((order) => {
      const matchesSearch =
        searchTerm === "" ||
        order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userRoll.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === null || order.status === statusFilter

      return matchesSearch && matchesStatus
    })

    const headers = ["Order ID", "Merch Type", "Customer", "Roll Number", "Name to Print", "Size", "Position", "Payment Proof", "Status"]
    const csvContent = [
      headers.join(","),
      ...dataToExport.map((order) =>
        [
          order.id,
          order.type,
          `"${order.userName}"`,
          order.userRoll,
          `"${order.nameToPrint}"`,
          order.size,
          order.position,
          order.payment,
          order.status,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `webnd-orders-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchTerm === "" ||
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userRoll.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === null || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleAcceptReject = (id: string, accepted: boolean) => {
    UpdateStatus(id, accepted);

    setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.$id === id ? { ...order, status: accepted ? "accepted" : "rejected" } : order
        )
      )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Orders Dashboard</h1>
          <p className="text-gray-500">Manage and track all your orders</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search orders..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} />
                  {statusFilter ? `Status: ${statusFilter}` : "Filter by Status"}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>All Statuses</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("accepted")}>Accepted</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>Rejected</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" className="flex items-center gap-2" onClick={handleDownloadCSV}>
              <Download size={16} />
              Download CSV
            </Button>
          </div>
        </div>

        <div className="rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Merch Type</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Name to Print</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Payment Proof</TableHead>
                <TableHead>Accept / Reject</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5)
                  .fill(null)
                  .map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    </TableRow>
                  ))
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.$id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.type}</TableCell>
                    <TableCell>{order.userName}</TableCell>
                    <TableCell>{order.userRoll}</TableCell>
                    <TableCell>{order.nameToPrint}</TableCell>
                    <TableCell>{order.size}</TableCell>
                    <TableCell>{order.position}</TableCell>
                    <TableCell>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="link" className="text-blue-600">View Proof</Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                          <Image src={order.payment} alt="Payment Proof" width={400} height={400} />
                        </SheetContent>
                      </Sheet>
                    </TableCell>
                    <TableCell>
                      { order.status === null ? (
                        <div className="flex gap-4">
                          <CheckCircle
                            className="text-green-600 cursor-pointer"
                            size={18}
                            onClick={() => handleAcceptReject(order.$id, true)}
                          />
                          <XCircle
                            className="text-red-600 cursor-pointer"
                            size={18}
                            onClick={() => handleAcceptReject(order.$id, false)}
                          />
                        </div>
                      ) : (
                        <span className={`text-sm ${order.status ==='accepted' ? "text-green-600" : "text-red-600"}`}>
                          {order.status ==='accepted' ? "Accepted" : "Rejected"}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                    No orders found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
