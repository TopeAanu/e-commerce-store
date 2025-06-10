// Note: This would typically be a server-side function
// For demo purposes, we're showing the structure
export const createPaymentIntent = async (data: {
  amount: number
  orderId: string
}): Promise<{ clientSecret: string }> => {
  try {
    // In a real app, this would be a server-side API call
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to create payment intent")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating payment intent:", error)
    throw new Error("Failed to create payment intent")
  }
}
