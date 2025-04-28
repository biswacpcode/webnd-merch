"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Info, Minus, Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckoutDialog } from "@/components/buy/checkout-dialog"
import { products } from "@/lib/data"

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [showFreeShirtPopup, setShowFreeShirtPopup] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    degree: "",
    year: "",
    hostel: "",
    isMember: null as boolean | null,
  })
  const [isFormValid, setIsFormValid] = useState(false)
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showSizeChartModal, setShowSizeChartModal] = useState(false);
  

  // Simulate data fetching
  useEffect(() => {
    const fetchProduct = async () => {
      // Simulate API call
      setTimeout(() => {
        const foundProduct = products.find((p) => p.id === productId)
        setProduct(foundProduct || products[0]) // Fallback to first product if not found
        setLoading(false)
      }, 1500)
    }

    fetchProduct()
  }, [productId])

  // Check form validity
  useEffect(() => {
    const { name, rollNumber, degree, year, hostel, isMember } = formData
    setIsFormValid(!!name && !!rollNumber && !!degree && !!year && !!hostel && isMember !== null)
  }, [formData])

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity === 5 && quantity !== 5) {
      setShowFreeShirtPopup(true)
      setQuantity(6)
    } else {
      setQuantity(newQuantity)
    }
  }

  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleBuyNow = () => {
    setShowCheckoutDialog(true)
  }

  if (loading) {
    return <ProductSkeleton />
  }
  

  const handleModalToggle = () => {
    setShowSizeChartModal(!showSizeChartModal);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left side - Product Image */}
        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            {!imageLoaded && <Skeleton className="w-full h-full absolute inset-0" />}
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-110"
              onLoad={() => setImageLoaded(true)}
              style={{ opacity: imageLoaded ? 1 : 0 }}
            />
          </div>
        </div>

        {/* Right side - Product Details */}
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-500 mt-1">{product.description}</p>
            <p className="text-2xl font-bold text-[#1a3857] mt-4">₹{product.price}</p>
          </div>

          <div className="space-y-4">
          <div className="flex items-center space-x-2">
        <Label>Size Chart</Label>
        <Button variant="outline" onClick={handleModalToggle} className="flex items-center space-x-2">
          <Info size={16} className="text-gray-400" />
          <span>View Size Chart</span>
        </Button>
      </div>

      {/* Modal for Size Chart Download */}
      {showSizeChartModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-4">
            <h3 className="text-xl font-bold mb-2">Size Chart</h3>
            <p className="mb-4">
              Click below to download the size chart for your reference.
            </p>
            <a
              href={product.sizechart}
              download
              className="inline-block bg-[#1a3857] text-white px-4 py-2 rounded-md hover:bg-[#0f2540] text-center w-full"
            >
              Download Size Chart
            </a>
            <Button className="w-full mt-4" onClick={handleModalToggle}>
              Close
            </Button>
          </div>
        </div>
      )}

            <div className="flex items-center space-x-4">
              <Label>Quantity</Label>
              <div className="flex gap-4">
                <Button
                    variant={quantity === 1 ? "default" : "outline"}
                    onClick={() => handleQuantityChange(1)}
                    className="flex-1"
                >
                    1 T-shirt
                </Button>
                <Button
                    variant={quantity >= 5 ? "default" : "outline"}
                    onClick={() => handleQuantityChange(5)}
                    className="flex-1"
                >
                    5 T-shirts
                </Button>
                </div>

            </div>
          </div>

          <div className="space-y-4 pt-6 border-t">
            <h2 className="text-xl font-semibold">Who is Ordering?</h2>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <input
                  id="name"
                  className="w-full mt-1 px-3 py-2 border rounded-md text-sm md:text-base"
                  value={formData.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="rollNumber">Roll Number</Label>
                <input
                  id="rollNumber"
                  className="w-full mt-1 px-3 py-2 border rounded-md text-sm md:text-base"
                  value={formData.rollNumber}
                  onChange={(e) => handleFormChange("rollNumber", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="degree">Degree</Label>
                  <Select onValueChange={(value) => handleFormChange("degree", value)}>
                    <SelectTrigger id="degree">
                      <SelectValue placeholder="Select Degree" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="B.Tech">B.Tech</SelectItem>
                      <SelectItem value="M.Tech">M.Tech</SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                      <SelectItem value="MSc">MSc</SelectItem>
                      <SelectItem value="ITEP">ITEP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="year">Year</Label>
                  <Select onValueChange={(value) => handleFormChange("year", value)}>
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                      <SelectItem value="5">5th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="hostel">Hostel</Label>
                <Select onValueChange={(value) => handleFormChange("hostel", value)}>
                  <SelectTrigger id="hostel">
                    <SelectValue placeholder="Select Hostel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BHR">BHR</SelectItem>
                    <SelectItem value="MHR">MHR</SelectItem>
                    <SelectItem value="RHR">RHR</SelectItem>
                    <SelectItem value="SHR">SHR</SelectItem>
                    <SelectItem value="GHR">GHR</SelectItem>
                    <SelectItem value="Sangam">Sangam</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Are you a WebnD member?</Label>
                <div className="flex gap-4 mt-1">
                    <Button
                        variant={formData.isMember === true ? "default" : "outline"}
                        onClick={() => handleFormChange("isMember", true)}
                        className="flex-1"
                    >
                        Hell Yeah Baby
                    </Button>
                    <Button
                        variant={formData.isMember === false ? "default" : "outline"}
                        onClick={() => handleFormChange("isMember", false)}
                        className="flex-1"
                    >
                        No 😭
                    </Button>
                    </div>

              </div>
            </div>
          </div>

          <Button
            className="w-full bg-[#1a3857] hover:bg-[#0f2540]"
            size="lg"
            disabled={!isFormValid}
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>
        </div>
      </div>

      {/* Free T-shirt Popup */}
      {showFreeShirtPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-4">
            <h3 className="text-xl font-bold mb-2">🎉 Congratulations! 🎉</h3>
            <p className="mb-4">
              U r getting an extra FREEEE tshirt on the house. That bring it upto SIX!
              <br />
              Only one of you can be a member though!
            </p>
            <Button className="w-full" onClick={() => setShowFreeShirtPopup(false)}>
              Awesome!
            </Button>
          </div>
        </div>
      )}

      {/* Checkout Dialog */}
      {showCheckoutDialog && (
        <CheckoutDialog
          open={showCheckoutDialog}
          onOpenChange={setShowCheckoutDialog}
          product={product}
          quantity={quantity}
          formData={formData}
        />
      )}
    </div>
  )
}

function ProductSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Skeleton className="aspect-square w-full rounded-lg" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-1/4 mt-4" />

          <div className="pt-6 space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full mt-4" />
          </div>
        </div>
      </div>
    </div>
  )
}
