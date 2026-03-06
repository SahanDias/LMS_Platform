type CreatePaymentSessionParams = {
  studentName: string;
  email: string;
  course: string;
  amount: number;
};

const PAYMENT_API_BASE =  "http://localhost:7788";

export const paymentApi = {
  async createPaymentSession(
    params: CreatePaymentSessionParams
  ): Promise<string> {
    const query = new URLSearchParams({
      studentName: params.studentName,
      email: params.email,
      course: params.course,
      amount: params.amount.toString(),
      _ts: Date.now().toString(),
    });

    const res = await fetch(
      `${PAYMENT_API_BASE}/create-payment-session?${query.toString()}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to create payment session");
    }

    const checkoutUrl = (await res.text()).trim();
    if (!checkoutUrl) {
      throw new Error("Payment session URL is empty");
    }
    return checkoutUrl;
  },
};
