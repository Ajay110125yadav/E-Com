// Fake payment for coding only
export const fakePaymentGateway = async (amount) => {
  return {
    success: true,
    paymentId: "FAKE_PAYMENT_" + Date.now(),
    status: "paid",
  };
};
