"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Info, ArrowLeft, ArrowRight, Upload, Check, ShoppingBag } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import QRCode from "react-qr-code"
import ImageUpload from "./ImageUpload"
import { toast } from "@/hooks/use-toast"
import { CreateMerchRequest, UploadFile } from "@/lib/action"

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: any
  quantity: number
  formData: any
}

export function CheckoutDialog({ open, onOpenChange, product, quantity, formData }: CheckoutDialogProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [tshirtDetails, setTshirtDetails] = useState<
    Array<{
      name: string
      size: string
      position?: string
    }>
  >(() =>
    Array(quantity)
      .fill(null)
      .map(() => ({
        name: "",
        size: "",
        position: "",
      })),
  )
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  
  const [preview, setPreview] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(`WD${Math.floor(10000 + Math.random() * 90000)}`)

  const totalSteps = quantity + 3 // Welcome + T-shirts + Confirmation + Payment
  const totalAmount = product.price * (quantity===6?5:quantity)



  // Generate UPI payment string
  const upiString = `upi://pay?pa=anshika.131.jain@okhdfcbank&pn=Web%20and%20Design%20Society&am=${totalAmount}&cu=INR&tn=Payment%20for%20${quantity}%20${product.name}%20t-shirt${quantity>1?'s':''}%20done%20by%20${formData.name}%20for%20order%20id%20${orderId}`

  // Generate payment message
  const paymentMessage = `Payment for ${quantity} ${product.name} t-shirt${quantity>1?'s':''} done by ${formData.name} for order id ${orderId}`

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateTshirtDetail = (index: number, field: string, value: string) => {
    const newDetails = [...tshirtDetails]
    newDetails[index] = {
      ...newDetails[index],
      [field]: value,
    }
    setTshirtDetails(newDetails)
  }


    // Handle image selection and preview generation
    const handleImageChange = (file: File | null) => {
        setPaymentProof(file);
    
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        } else {
          setPreview(null);
        }
      };

      

  const handleSubmit = async() => {
    setIsSubmitting(true)

      const order = {
        product,
        quantity,
        userInfo: formData,
        tshirtDetails,
        paymentProof: paymentProof,
      };




      try {
        if (order?.tshirtDetails?.length > 0 && paymentProof) {
            let paymentLink = null;

          for (const tshirt of order.tshirtDetails) {
            const formData = new FormData();
            formData.append("id", orderId || "");
            formData.append("type", order.product.name || "");
      formData.append("userName", order.userInfo.name || "");
      formData.append("userEmail", (order.userInfo.rollNumber || "").toLowerCase() + "@iitbbs.ac.in");
      formData.append("userRoll", order.userInfo.rollNumber || "");
      formData.append("nameToPrint", tshirt.name || "");
      formData.append("size", tshirt.size || "");
      formData.append("position", tshirt.position || "");
      formData.append("payment", order.paymentProof || ""); // Assuming this is URL or file
      formData.append("member", order.userInfo.isMember ? "true" : "false");
              let count = 1;
      
            const res = await CreateMerchRequest(formData, count, paymentLink);

            if (res.success) {
              toast({
                title: "Order Submitted!",
                description: `Your t-shirt #${count} request has been recorded successfully.`,
              });
            } else {
              toast({
                title: "Submission Failed!",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
              });
              setIsSubmitted(false)
            }
            count++;
          }
          
        setIsSubmitted(true);
        } else {
          toast({
            title: "No T-shirt Details Found",
            description: "Please add all details before submitting.",
            variant: "destructive",
          });
          setIsSubmitted(false);
        }
      } catch (error) {
        console.error("Error submitting merch request:", error);
        toast({
          title: "Submission Error",
          description: "An error occurred while submitting your request.",
          variant: "destructive",
        });
        setIsSubmitted(false)
      } finally {
        setIsSubmitting(false);
        setShowSuccessDialog(true)
      }
      



  }


  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-0 overflow-hidden max-h-[90vh] max-w-[80dvw] rounded-md">
          <div className="relative">
            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 z-10">
              <div
                className="h-full bg-[#1a3857] transition-all duration-300"
                style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
              ></div>
            </div>

            {/* Content */}
            <div className="p-6 pt-8 overflow-y-auto max-h-[calc(90vh-80px)] scrollbar-hide">
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-[#1a3857]/10 flex items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-[#1a3857]" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-center">Welcome to Checkout</h2>
                  <p className="text-center text-gray-600">
                    Let's get all the details of you!! Only one of these can have a position.
                  </p>
                </div>
              )}

              {currentStep > 0 && currentStep <= quantity && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">T-shirt #{currentStep} Details</h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`name-${currentStep}`}>Name to be printed</Label>
                      <input
                        id={`name-${currentStep}`}
                        className="w-full mt-1 px-3 py-2 border rounded-md text-sm md:text-base"
                        value={tshirtDetails[currentStep - 1]?.name || ""}
                        onChange={(e) => updateTshirtDetail(currentStep - 1, "name", e.target.value)}
                      />
                    </div>

                    <div>
                    <div className="flex items-center space-x-2">
                        <Label htmlFor={`size-${currentStep}`} className="text-sm sm:text-base">
                            Size
                        </Label>
                        
                        </div>

                      <Select
                        onValueChange={(value) => updateTshirtDetail(currentStep - 1, "size", value)}
                        value={tshirtDetails[currentStep - 1]?.size || ""}
                      >
                        <SelectTrigger id={`size-${currentStep}`}>
                          <SelectValue placeholder="Select Size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="XS">XS</SelectItem>
                          <SelectItem value="S">S</SelectItem>
                          <SelectItem value="M">M</SelectItem>
                          <SelectItem value="L">L</SelectItem>
                          <SelectItem value="XL">XL</SelectItem>
                          <SelectItem value="XXL">XXL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {currentStep === 1 && (
                      <div>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="position">Position to be printed</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info size={16} className="text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent side="right" sideOffset={5}>
                                <p className="w-80">The secretary can dismiss this tag if deemed necessary.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <input
                          id="position"
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          value={tshirtDetails[currentStep - 1]?.position || ""}
                          onChange={(e) => updateTshirtDetail(currentStep - 1, "position", e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === quantity + 1 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-center">Order Summary</h2>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Customer Information</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Name:</div>
                        <div>{formData.name}</div>
                        <div>Roll Number:</div>
                        <div>{formData.rollNumber}</div>
                        <div>Degree:</div>
                        <div>{formData.degree}</div>
                        <div>Year:</div>
                        <div>{formData.year}</div>
                        <div>Hostel:</div>
                        <div>{formData.hostel}</div>
                        <div>WebnD Member:</div>
                        <div>{formData.isMember ? "Yes" : "No"}</div>
                      </div>
                    </div>

                    <div className="bg-gray-200 p-4 rounded-lg border-gray-600">
                      <h3 className="font-semibold mb-2">Order Details</h3>
                      <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>
                            {product.name} x {quantity}
                        </span>
                        <span className="text-right">
                            {quantity === 6 ? (
                            <>
                                <span className="line-through text-gray-400 mr-2">₹{product.price * 6}</span>
                                <span className="font-bold text-green-600">₹{product.price * 5}</span>
                            </>
                            ) : (
                            <>₹{product.price * quantity}</>
                            )}
                        </span>
                        </div>

                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">T-shirt Details</h3>
                      <div className="space-y-3">
                        {tshirtDetails.map((tshirt, index) => (
                          <div key={index} className="border-b pb-2 last:border-b-0 last:pb-0">
                            <div className="font-medium">T-shirt #{index + 1}</div>
                            <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                              <div>Name:</div>
                              <div>{tshirt.name}</div>
                              <div>Size:</div>
                              <div>{tshirt.size.toUpperCase()}</div>
                              {index === 0 && tshirt.position && (
                                <>
                                  <div>Position:</div>
                                  <div>{tshirt.position}</div>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === quantity + 2 && (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-center">Payment</h2>

    <div className="space-y-6">
    <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-2xl shadow-lg">
  {/* QR Code Section */}
  <div className="bg-gray-100 p-4 rounded-xl flex items-center justify-center">
    <QRCode value={upiString} size={180} />
  </div>

  {/* Payment Details */}
  <div className="w-full bg-gray-50 p-5 rounded-xl text-center">
    <h3 className="text-base md:text-lg font-bold text-gray-800 mb-2">Payment Details</h3>
    <p className="text-sm text-gray-600 mb-4">
      Scan the QR code above to pay <span className="font-semibold">₹{totalAmount}</span>
    </p>
    <div className="text-xs md:text-sm bg-white border border-gray-200 p-3 rounded-md break-words">
      "{paymentMessage}"
    </div>
  </div>

  {/* OR Divider */}
  <div className="flex items-center w-full my-4">
    <div className="flex-grow border-t border-gray-300"></div>
    <span className="mx-3 text-gray-500 text-sm font-medium">OR</span>
    <div className="flex-grow border-t border-gray-300"></div>
  </div>

  {/* UPI Payment Button */}
  <div>
    <a
      href={upiString}
      className="inline-block bg-[#1a3857] hover:bg-[#12263a] text-white font-semibold text-sm py-3 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
    >
      Pay ₹{totalAmount} with UPI
    </a>
  </div>
</div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Upload Payment Proof (Required)</Label>
        <ImageUpload onChange={handleImageChange} preview={preview} />
      </div>
    </div>
  </div>
)}


              {/* Navigation buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 0 && !isSubmitted && (
                  <Button variant="outline" onClick={handlePrevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                )}

                {currentStep < totalSteps - 1 && (
                  <Button className="ml-auto bg-[#1a3857] hover:bg-[#0f2540]" onClick={handleNextStep}>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}

                {currentStep === totalSteps - 1 && !isSubmitted && (
                  <Button
                    className="ml-auto bg-[#1a3857] hover:bg-[#0f2540]"
                    onClick={handleSubmit}
                    disabled={!paymentProof || isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                )}
              </div>

              {/* Success message */}
              {isSubmitted && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Request Sent!</h3>
                  <p className="text-gray-600 mb-4">
                    Your order has been successfully submitted. We'll process it shortly.
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Request Sent!</h2>
            <p className="text-gray-600 mb-6">Your order #{orderId} has been successfully submitted.</p>
            <h3 className="text-xl font-semibold mb-4">Wanna shop more?</h3>
            <Button
              className="bg-[#1a3857] hover:bg-[#0f2540] w-full"
              onClick={() => {
                setShowSuccessDialog(false)
                window.location.href = "/"
              }}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Buy Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
