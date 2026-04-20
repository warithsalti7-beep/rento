import "server-only";

// Vipps ePayment + Vipps Login scaffolding.
// Activated only when VIPPS_* env vars are present.
// Docs: https://developer.vippsmobilepay.com

type VippsConfig = {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  subscriptionKey: string;
  msn: string;
};

function getVippsConfig(): VippsConfig | null {
  const {
    VIPPS_CLIENT_ID,
    VIPPS_CLIENT_SECRET,
    VIPPS_SUBSCRIPTION_KEY,
    VIPPS_MERCHANT_SERIAL_NUMBER,
    VIPPS_BASE_URL,
  } = process.env;

  if (
    !VIPPS_CLIENT_ID ||
    !VIPPS_CLIENT_SECRET ||
    !VIPPS_SUBSCRIPTION_KEY ||
    !VIPPS_MERCHANT_SERIAL_NUMBER
  ) {
    return null;
  }

  return {
    baseUrl: VIPPS_BASE_URL ?? "https://apitest.vipps.no",
    clientId: VIPPS_CLIENT_ID,
    clientSecret: VIPPS_CLIENT_SECRET,
    subscriptionKey: VIPPS_SUBSCRIPTION_KEY,
    msn: VIPPS_MERCHANT_SERIAL_NUMBER,
  };
}

export function isVippsEnabled(): boolean {
  return getVippsConfig() !== null;
}

async function vippsAccessToken(cfg: VippsConfig): Promise<string> {
  const res = await fetch(`${cfg.baseUrl}/accesstoken/get`, {
    method: "POST",
    headers: {
      "client_id": cfg.clientId,
      "client_secret": cfg.clientSecret,
      "Ocp-Apim-Subscription-Key": cfg.subscriptionKey,
      "Merchant-Serial-Number": cfg.msn,
    },
  });
  if (!res.ok) throw new Error(`Vipps access token failed (${res.status})`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export async function createVippsPayment(params: {
  reference: string;
  amountOere: number;
  description: string;
  returnUrl: string;
  fallbackRedirectUrl: string;
  customerPhone?: string;
}): Promise<{ url: string; reference: string } | null> {
  const cfg = getVippsConfig();
  if (!cfg) return null;

  const token = await vippsAccessToken(cfg);

  const body = {
    amount: { currency: "NOK", value: params.amountOere },
    paymentMethod: { type: "WALLET" },
    reference: params.reference,
    returnUrl: params.returnUrl,
    userFlow: "WEB_REDIRECT",
    paymentDescription: params.description,
    ...(params.customerPhone
      ? { customer: { phoneNumber: params.customerPhone } }
      : {}),
  };

  const res = await fetch(`${cfg.baseUrl}/epayment/v1/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Ocp-Apim-Subscription-Key": cfg.subscriptionKey,
      "Merchant-Serial-Number": cfg.msn,
      "Idempotency-Key": params.reference,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Vipps ePayment failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as { redirectUrl: string; reference: string };
  return { url: data.redirectUrl, reference: data.reference };
}
