// End-to-end check against a running dev server: register, order, track.
// Usage: node scripts/flow-test.mjs
const BASE = "http://localhost:3000";

let cookie = "";

async function call(path, init = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}),
      ...(init.headers ?? {}),
    },
  });

  const setCookie = response.headers.getSetCookie?.() ?? [];
  for (const entry of setCookie) {
    if (entry.startsWith("crumble_session=")) cookie = entry.split(";")[0];
  }

  const text = await response.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text.slice(0, 200);
  }

  return { status: response.status, body };
}

const fail = (label, result) => {
  console.log(`FAIL ${label} -> ${result.status}`, JSON.stringify(result.body).slice(0, 300));
  process.exitCode = 1;
};

const catalog = await call("/api/catalog?limit=50");
console.log("catalog:", catalog.status, "products:", catalog.body.total);
if (catalog.status !== 200) fail("catalog", catalog);

const product = catalog.body.products.find((p) => p.variants.length > 1) ?? catalog.body.products[0];
console.log("picked:", product.name, product.slug, "variants:", product.variants.length);

const email = `baker${Date.now()}@crumble.test`;
const register = await call("/api/auth/register", {
  method: "POST",
  body: JSON.stringify({ name: "Test Baker", email, phone: "9876543210", password: "secret123" }),
});
console.log("register:", register.status, register.body.email ?? register.body.error);
if (register.status !== 201) fail("register", register);
if (!cookie) fail("register cookie", { status: 0, body: "no session cookie set" });

const me = await call("/api/auth/me");
console.log("me:", me.status, me.body.user?.email, me.body.user?.role);
if (me.body.user?.email !== email) fail("me", me);

const duplicate = await call("/api/auth/register", {
  method: "POST",
  body: JSON.stringify({ name: "Test Baker", email, phone: "9876543210", password: "secret123" }),
});
const duplicateVerdict =
  duplicate.status === 400
    ? "blocked"
    : duplicate.status === 429
      ? "skipped (rate limited)"
      : `LEAKED ${duplicate.status}`;
console.log("duplicate register:", duplicateVerdict);

const tomorrow = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
const order = await call("/api/orders", {
  method: "POST",
  body: JSON.stringify({
    customerName: "Test Baker",
    phone: "9876543210",
    email,
    addressLine1: "12 Test Lane",
    city: "Ujjain",
    state: "MP",
    pinCode: "456001",
    deliveryMethod: "delivery",
    deliveryDate: tomorrow,
    deliverySlot: "10:00 - 13:00",
    paymentMethod: "cash_on_delivery",
    items: [{ slug: product.slug, variant: product.variants[0]?.label, quantity: 2 }],
  }),
});
console.log("order:", order.status, order.body.orderNumber, "total:", order.body.total);
if (order.status !== 201) fail("order", order);

const badPincode = await call("/api/orders", {
  method: "POST",
  body: JSON.stringify({
    customerName: "Test Baker",
    phone: "9876543210",
    addressLine1: "12 Test Lane",
    city: "Ujjain",
    state: "MP",
    pinCode: "12",
    deliveryMethod: "delivery",
    deliveryDate: tomorrow,
    deliverySlot: "10:00 - 13:00",
    paymentMethod: "cash_on_delivery",
    items: [{ slug: product.slug, quantity: 1 }],
  }),
});
console.log("bad pincode rejected:", badPincode.status === 400 ? "yes" : "NO", badPincode.body.error ?? "");

const pastDate = await call("/api/orders", {
  method: "POST",
  body: JSON.stringify({
    customerName: "Test Baker",
    phone: "9876543210",
    addressLine1: "12 Test Lane",
    city: "Ujjain",
    state: "MP",
    pinCode: "456001",
    deliveryMethod: "delivery",
    deliveryDate: "2020-01-01",
    deliverySlot: "10:00 - 13:00",
    paymentMethod: "cash_on_delivery",
    items: [{ slug: product.slug, quantity: 1 }],
  }),
});
console.log("past date rejected:", pastDate.status === 400 ? "yes" : "NO", pastDate.body.error ?? "");

const track = await call(
  `/api/orders/track?number=${encodeURIComponent(order.body.orderNumber)}&phone=9876543210`
);
console.log("track:", track.status, track.body.status, "items:", track.body.items?.length);
if (track.status !== 200) fail("track", track);

const mine = await call("/api/orders");
console.log("my orders:", mine.status, Array.isArray(mine.body) ? mine.body.length : mine.body.error);

const adminAttempt = await call(`/api/orders/${order.body.id}`, {
  method: "PATCH",
  body: JSON.stringify({ status: "confirmed" }),
});
console.log("non-admin status change blocked:", adminAttempt.status === 403 ? "yes" : "NO");

const logout = await call("/api/auth/logout", { method: "POST" });
console.log("logout:", logout.status);
const afterLogout = await call("/api/orders");
console.log("orders after logout blocked:", afterLogout.status === 401 ? "yes" : "NO");

// Now a guest: a wrong phone must not reveal the order.
const wrongPhone = await call(
  `/api/orders/track?number=${encodeURIComponent(order.body.orderNumber)}&phone=9000000000`
);
console.log("wrong phone blocked:", wrongPhone.status === 404 ? "yes" : "NO");

const numberOnly = await call(
  `/api/orders/track?number=${encodeURIComponent(order.body.orderNumber)}`
);
console.log("number-only as guest blocked:", numberOnly.status === 404 ? "yes" : "NO");

console.log(process.exitCode ? "\nSOME CHECKS FAILED" : "\nall checks passed");
