/* ============================================================
   Shop Page — Late Night Ltd.
   Product catalogue, cart checkout, and order email flow
   ============================================================ */
import { FormEvent, useMemo, useState } from "react";
import { ArrowUpRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Layout from "@/components/Layout";
import { asset } from "@/lib/asset";

const CASSETTE_IMAGE = asset("images/shop-cassette-naihe.webp");
const CASE_IMAGE = asset("images/shop-logo-case.webp");
const LINE_PAY_QR_IMAGE = asset("images/line-pay-qr.webp");
const SHIPPING_FEE = 60;
const ORDER_EMAIL = "latenight.ltd.tw@gmail.com";
const BANK_ACCOUNT = "(807)-10301820033171";

const products = [
  {
    id: 1,
    name: "CASSETTE SINGLE〈NAIHE〉",
    description: "LEIGHT NINE 首發單曲〈NAIHE〉卡帶\n（僅收錄一首曲目）",
    price: 400,
    image: CASSETTE_IMAGE,
  },
  {
    id: 2,
    name: "LOGO CASE",
    description: "LEIGHT NINE 可掛身收納盒\n收納小東西使用、亦可當作菸盒\n（尺寸：長10.5 寬6.5 厚2.5 CM）",
    price: 300,
    image: CASE_IMAGE,
  },
];

type Cart = Record<number, number>;

type CustomerInfo = {
  name: string;
  phone: string;
  store: string;
  email: string;
  paymentMethod: string;
  paymentReference: string;
};

type EmailMethod = "" | "default" | "gmail" | "outlook" | "copy";

const emptyCustomer: CustomerInfo = {
  name: "",
  phone: "",
  store: "",
  email: "",
  paymentMethod: "",
  paymentReference: "",
};

const createOrderNumber = () => {
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `LNL-${timestamp}-${suffix}`;
};

const formatCurrency = (amount: number) => `NT$${amount.toLocaleString("en-US")}`;

export default function Shop() {
  const [cart, setCart] = useState<Cart>({});
  const [customer, setCustomer] = useState<CustomerInfo>(emptyCustomer);
  const [submittedOrder, setSubmittedOrder] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [formError, setFormError] = useState("");
  const [emailMethod, setEmailMethod] = useState<EmailMethod>("default");
  const [showOtherEmailMethods, setShowOtherEmailMethods] = useState(false);
  const [copiedOrder, setCopiedOrder] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);

  const cartItems = useMemo(
    () =>
      products
        .filter((product) => (cart[product.id] ?? 0) > 0)
        .map((product) => ({ ...product, quantity: cart[product.id] })),
    [cart],
  );

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = cartItems.length > 0 ? SHIPPING_FEE : 0;
  const total = subtotal + shipping;
  const normalizedPhone = customer.phone.replace(/\D/g, "");
  const isPhoneValid = /^09\d{8}$/.test(normalizedPhone);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email);

  const updateQuantity = (productId: number, quantity: number) => {
    setHasPaid(false);
    setCart((current) => {
      const next = { ...current };
      if (quantity <= 0) {
        delete next[productId];
      } else {
        next[productId] = quantity;
      }
      return next;
    });
  };

  const addToCart = (productId: number) => {
    updateQuantity(productId, (cart[productId] ?? 0) + 1);
    setSubmittedOrder(null);
    setIsConfirming(false);
  };

  const handleCustomerChange = (field: keyof CustomerInfo, value: string) => {
    setCustomer((current) => ({ ...current, [field]: value }));
    if (field === "paymentMethod" || field === "paymentReference") {
      setHasPaid(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (cartItems.length === 0) {
      setFormError("請先將商品加入購物車。");
      return;
    }
    if (!isPhoneValid) {
      setFormError("請輸入正確的台灣手機格式，例如 09xx-xxx-xxx。");
      return;
    }
    if (!isEmailValid) {
      setFormError("請輸入正確的 Email 格式，例如 you@example.com。");
      return;
    }
    if (!customer.paymentMethod) {
      setFormError("請先選擇付款方式。");
      return;
    }
    const referencePattern = customer.paymentMethod === "銀行轉帳" ? /^\d{5}$/ : /^\d{3}$/;
    if (!referencePattern.test(customer.paymentReference)) {
      setFormError(customer.paymentMethod === "銀行轉帳" ? "匯款末五碼必須是 5 位數字。" : "電話末三碼必須是 3 位數字。");
      return;
    }
    setFormError("");
    setEmailMethod("default");
    setShowOtherEmailMethods(false);
    setCopiedOrder(false);
    setIsConfirming(true);
  };

  const handleFinalSubmit = async () => {
    if (!hasPaid) {
      setFormError("請勾選已完成付款，再確認並寄出訂單。");
      return;
    }
    const orderNumber = createOrderNumber();
    const itemLines = cartItems
      .map((item) => `${item.name} × ${item.quantity} = ${formatCurrency(item.price * item.quantity)}`)
      .join("\n");
    const subject = `[SHOP訂單] ${orderNumber}`;
    const body = [
      `訂單編號：${orderNumber}`,
      "",
      "訂購商品：",
      itemLines,
      "",
      `商品小計：${formatCurrency(subtotal)}`,
      `運費：${formatCurrency(shipping)}`,
      `訂單總額：${formatCurrency(total)}`,
      "",
      "顧客資料：",
      `姓名：${customer.name}`,
      `電話：${customer.phone}`,
      `7-ELEVEN 店到店門市：${customer.store}`,
      `聯絡 Email：${customer.email}`,
      `付款方式：${customer.paymentMethod}`,
      `${customer.paymentMethod === "銀行轉帳" ? "匯款末五碼" : "LINE PAY 電話末三碼"}：${customer.paymentReference}`,
    ].join("\n");

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    if (emailMethod === "copy") {
      try {
        await navigator.clipboard.writeText(`${subject}\n\n${body}`);
      } catch {
        setFormError("目前無法自動複製，請改選其他寄信方式。");
        return;
      }
      setCopiedOrder(true);
      setSubmittedOrder(orderNumber);
      return;
    }

    setSubmittedOrder(orderNumber);
    if (emailMethod === "gmail") {
      window.location.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(ORDER_EMAIL)}&su=${encodedSubject}&body=${encodedBody}`;
    } else if (emailMethod === "outlook") {
      window.location.href = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(ORDER_EMAIL)}&subject=${encodedSubject}&body=${encodedBody}`;
    } else {
      window.location.href = `mailto:${ORDER_EMAIL}?subject=${encodedSubject}&body=${encodedBody}`;
    }
  };

  return (
    <Layout>
      <section className="relative overflow-hidden bg-black px-6 pb-20 pt-32 lg:px-10 lg:pb-28 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,oklch(0.88_0.14_88/0.10),transparent_34%)]" />
        <div className="relative z-10 mx-auto max-w-[1400px]">
          <p className="mb-4 font-['ButlerCustom'] text-xs tracking-[0.4em] text-[oklch(0.70_0.02_280)]">SHOP</p>
          <div className="mt-6 h-px w-16 bg-[oklch(0.70_0.02_280)]" />
        </div>
      </section>

      <section className="page-section">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
            {products.map((product) => (
              <article key={product.id} className="group flex flex-col items-start">
                <div className="relative mb-6 aspect-square h-64 w-64 overflow-hidden lg:h-80 lg:w-80">
                  <img src={product.image} alt={product.name} className="image-fade-in h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-[oklch(0.10_0.005_285/0.3)] transition-colors duration-300 group-hover:bg-[oklch(0.10_0.005_285/0.15)]" />
                </div>
                <h2 className="font-['ButlerCustom'] text-lg text-white transition-colors duration-200 group-hover:text-[oklch(0.88_0.14_88)] lg:text-xl">{product.name}</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[oklch(0.75_0.005_65)]">{product.description}</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-['ButlerCustom'] text-xs tracking-[0.2em] text-[#ff0000]">Price</span>
                  <span className="font-['ButlerCustom'] text-xs tracking-[0.2em] text-[#ff0000]">{formatCurrency(product.price)}</span>
                </div>
                <button type="button" onClick={() => addToCart(product.id)} className="btn-scale mt-5 inline-flex items-center gap-2 bg-white px-5 py-3 font-['ButlerCustom'] text-xs tracking-[0.16em] text-black transition-colors hover:bg-[#ff0000] hover:text-white">
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  Add to cart
                </button>
              </article>
            ))}
          </div>

          <div className="my-16 h-px bg-gradient-to-r from-transparent via-[oklch(1_0_0/20%)] to-transparent" />

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)] lg:gap-16">
            <div>
              <div className="mb-8">
                <p className="mb-4 font-['ButlerCustom'] text-xs tracking-[0.4em] text-[oklch(0.70_0.02_280)]">ORDER FORM</p>
                <h2 className="mb-4 font-['ButlerCustom'] text-3xl text-white lg:text-4xl">購買與運送資訊</h2>
                <p className="whitespace-pre-line text-sm leading-7 text-[oklch(0.75_0.005_65)]">{"選擇商品加入購物車，系統會協助計算總金額（包含固定運費NT$60）；\n請選擇付款方式先付款，並填寫所有相關資料後，按下「送出訂單」。\n訂單內容寄至 latenight.ltd.tw@gmail.com 即完成訂單，後續將接續由客服回覆。"}</p>
                <div className="mt-7 grid grid-cols-3 gap-2 border-y border-white/10 py-4 text-center text-[10px] tracking-[0.12em] text-white/45 sm:text-xs">
                  <span className="text-white">01 選商品</span><span>02 填資料與付款</span><span>03 確認寄出</span>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-[oklch(1_0_0/10%)] bg-[oklch(0.12_0.005_285)]">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <h3 className="font-['ButlerCustom'] text-xl text-white">Shopping cart</h3>
                  <span className="text-xs tracking-[0.12em] text-white/45">{cartItems.reduce((sum, item) => sum + item.quantity, 0)} ITEMS</span>
                </div>
                {cartItems.length > 0 ? (
                  <div className="divide-y divide-white/10">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 px-5 py-5">
                        <img src={item.image} alt="" className="h-16 w-16 object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="font-['ButlerCustom'] text-sm text-white">{item.name}</p>
                          <p className="mt-1 text-xs text-white/45">{formatCurrency(item.price)} / each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Decrease ${item.name}`} className="rounded-full border border-white/15 p-1 text-white/70 transition-colors hover:border-white hover:text-white"><Minus className="h-3 w-3" /></button>
                          <span className="w-5 text-center font-['ButlerCustom'] text-sm text-white">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Increase ${item.name}`} className="rounded-full border border-white/15 p-1 text-white/70 transition-colors hover:border-white hover:text-white"><Plus className="h-3 w-3" /></button>
                        </div>
                        <button type="button" onClick={() => updateQuantity(item.id, 0)} aria-label={`Remove ${item.name}`} className="ml-2 text-white/35 transition-colors hover:text-[#ff0000]"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="px-5 py-10 text-sm text-white/40">購物車目前是空的，請先選擇商品。</p>
                )}
                <div className="space-y-2 border-t border-white/10 px-5 py-5 text-sm">
                  <div className="flex justify-between text-white/50"><span>商品小計</span><span>{formatCurrency(subtotal)}</span></div>
                  <div className="flex justify-between text-white/50"><span>運費</span><span>{formatCurrency(shipping)}</span></div>
                  <div className="flex justify-between border-t border-white/10 pt-3 font-['ButlerCustom'] text-lg text-white"><span>Total</span><span>{formatCurrency(total)}</span></div>
                </div>
              </div>

            </div>

            <form onSubmit={isConfirming ? (event) => { event.preventDefault(); handleFinalSubmit(); } : handleSubmit} className="glass-card h-fit p-6 sm:p-8">
              {isConfirming ? (
                <div>
                  <p className="mb-3 font-['ButlerCustom'] text-xs tracking-[0.2em] text-white/35">ORDER REVIEW</p>
                  <h3 className="font-['ButlerCustom'] text-2xl text-white">確認訂單內容</h3>
                  <div className="mt-6 space-y-3 border-y border-white/10 py-5 text-sm text-white/65">
                    {cartItems.map((item) => <div key={item.id} className="flex justify-between gap-4"><span>{item.name} × {item.quantity}</span><span>{formatCurrency(item.price * item.quantity)}</span></div>)}
                    <div className="flex justify-between gap-4"><span>商品小計</span><span>{formatCurrency(subtotal)}</span></div>
                    <div className="flex justify-between gap-4"><span>運費</span><span>{formatCurrency(shipping)}</span></div>
                    <div className="flex justify-between gap-4 border-t border-white/10 pt-3 font-['ButlerCustom'] text-lg text-white"><span>訂單總額</span><span>{formatCurrency(total)}</span></div>
                  </div>
                  <div className="mt-6 space-y-2 text-sm leading-7 text-white/65">
                    <p>姓名：{customer.name}</p>
                    <p>電話：{customer.phone}</p>
                    <p>7-ELEVEN 店到店門市：{customer.store}</p>
                    <p>聯絡 Email：{customer.email}</p>
                    <p>付款方式：{customer.paymentMethod}</p>
                    <p>{customer.paymentMethod === "銀行轉帳" ? "匯款末五碼" : "LINE PAY 電話末三碼"}：{customer.paymentReference}</p>
                  </div>
                  <label className="mt-7 flex cursor-pointer items-start gap-3 border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/75"><input type="checkbox" checked={hasPaid} onChange={(event) => { setHasPaid(event.target.checked); setFormError(""); }} className="mt-1 h-4 w-4 accent-[#ff0000]" /><span>我確認已完成付款，並已填寫正確的付款末碼。</span></label>
                  <div className="mt-7">
                    <div className="flex items-center justify-between gap-4"><span className="font-['ButlerCustom'] text-xs tracking-[0.16em] text-white/45">寄信方式</span><button type="button" onClick={() => { setShowOtherEmailMethods((current) => !current); setCopiedOrder(false); }} className="font-['ButlerCustom'] text-xs tracking-[0.1em] text-white underline decoration-white/30 underline-offset-4 transition-colors hover:text-[oklch(0.88_0.14_88)]">{showOtherEmailMethods ? "收合寄信方式" : "其他寄信方式"}</button></div>
                    {showOtherEmailMethods ? <select aria-label="其他寄信方式" value={emailMethod} onChange={(event) => { setEmailMethod(event.target.value as EmailMethod); setFormError(""); setCopiedOrder(false); }} className="mt-3 w-full border-b border-white/20 bg-[oklch(0.15_0.005_285)] px-0 py-3 font-['ButlerCustom'] text-sm text-white outline-none transition-colors focus:border-white"><option value="default">使用預設郵件程式</option><option value="gmail">使用 Gmail 網頁版</option><option value="outlook">使用 Outlook 網頁版</option><option value="copy">複製訂單內容</option></select> : <p className="mt-3 border-b border-white/20 py-3 font-['ButlerCustom'] text-sm text-white">使用預設郵件程式</p>}
                    <p className="mt-3 text-xs leading-6 text-[oklch(0.70_0.02_280)]">畫面跳轉後，請務必將信件按下寄出，才算下單完成喔！</p>
                  </div>
                  {formError && <p role="alert" className="mt-4 text-sm leading-6 text-[#ff5555]">{formError}</p>}
                  {copiedOrder && <p className="mt-4 border-l-2 border-[#ff0000] pl-4 text-sm leading-6 text-white/65">訂單內容已複製，請貼到你使用的 Email 系統寄出。</p>}
                  <div className="mt-8 flex flex-wrap gap-3">
                    <button type="button" onClick={() => { setHasPaid(false); setIsConfirming(false); }} className="btn-scale border border-white/20 px-5 py-3 font-['ButlerCustom'] text-xs tracking-[0.16em] text-white transition-colors hover:border-white">返回修改</button>
                    <button type="submit" className="btn-scale inline-flex items-center gap-2 bg-white px-5 py-3 font-['ButlerCustom'] text-xs font-semibold tracking-[0.16em] text-black transition-colors hover:bg-[#ff0000] hover:text-white">確認並寄出訂單 <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></button>
                  </div>
                </div>
              ) : (
                <>
              <div className="mb-8">
                <p className="mb-3 font-['ButlerCustom'] text-xs tracking-[0.2em] text-white/35">CUSTOMER INFORMATION</p>
                <h3 className="font-['ButlerCustom'] text-2xl text-white">顧客資料</h3>
              </div>
              <div className="space-y-5">
                <label className="block"><span className="mb-2 block font-['ButlerCustom'] text-xs tracking-[0.16em] text-white/45">姓名 Name <em className="font-normal not-italic tracking-normal text-white/45">（請填寫身分證件上之本名，以確保後續取貨順利。）</em></span><input name="name" required value={customer.name} onChange={(event) => handleCustomerChange("name", event.target.value)} className="w-full border-b border-white/20 bg-transparent px-0 py-3 font-['ButlerCustom'] text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-white" placeholder="Your name" /></label>
                <label className="block"><span className="mb-2 block font-['ButlerCustom'] text-xs tracking-[0.16em] text-white/45">電話 Phone</span><input name="phone" required type="tel" value={customer.phone} onChange={(event) => { handleCustomerChange("phone", event.target.value); setFormError(""); }} aria-invalid={Boolean(customer.phone) && !isPhoneValid} className={`w-full border-b bg-transparent px-0 py-3 font-['ButlerCustom'] text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-white ${customer.phone && !isPhoneValid ? "border-[#ff5555]" : "border-white/20"}`} placeholder="09xx-xxx-xxx" />{customer.phone && !isPhoneValid && <span className="mt-2 block text-xs leading-5 text-[#ff5555]">格式請填 10 碼手機號碼，例如 09xx-xxx-xxx。</span>}{customer.phone && isPhoneValid && <span className="mt-2 block text-xs leading-5 text-white/45">手機格式正確。</span>}</label>
                <label className="block"><span className="mb-2 flex items-center justify-between gap-3 font-['ButlerCustom'] text-xs tracking-[0.16em] text-white/45"><span>7-ELEVEN 店到店門市</span><a href="https://emap.pcsc.com.tw/" target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1 text-white transition-colors hover:text-[oklch(0.88_0.14_88)]">查詢門市 <ArrowUpRight className="h-3 w-3" aria-hidden="true" /></a></span><input name="store" required value={customer.store} onChange={(event) => handleCustomerChange("store", event.target.value)} className="w-full border-b border-white/20 bg-transparent px-0 py-3 font-['ButlerCustom'] text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-white" placeholder="例如：台北市中正區 ○○門市（店號）" /></label>
                <label className="block"><span className="mb-2 block font-['ButlerCustom'] text-xs tracking-[0.16em] text-white/45">聯絡 Email</span><input name="email" required type="email" value={customer.email} onChange={(event) => { handleCustomerChange("email", event.target.value); setFormError(""); }} aria-invalid={Boolean(customer.email) && !isEmailValid} className={`w-full border-b bg-transparent px-0 py-3 font-['ButlerCustom'] text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-white ${customer.email && !isEmailValid ? "border-[#ff5555]" : "border-white/20"}`} placeholder="you@example.com" />{customer.email && !isEmailValid && <span className="mt-2 block text-xs leading-5 text-[#ff5555]">請輸入正確的 Email，例如 you@example.com。</span>}{customer.email && isEmailValid && <span className="mt-2 block text-xs leading-5 text-white/45">Email 格式正確。</span>}</label>
                <label className="block"><span className="mb-2 block font-['ButlerCustom'] text-xs tracking-[0.16em] text-white/45">付款方式</span><select name="paymentMethod" required value={customer.paymentMethod} onChange={(event) => handleCustomerChange("paymentMethod", event.target.value)} className="w-full border-b border-white/20 bg-[oklch(0.15_0.005_285)] px-0 py-3 font-['ButlerCustom'] text-sm text-white outline-none transition-colors focus:border-white"><option value="" disabled>請選擇付款方式</option><option value="LINE PAY">LINE PAY</option><option value="銀行轉帳">銀行轉帳</option></select></label>
                {customer.paymentMethod === "" ? (
                  <div className="border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/55">請先選擇付款方式，選擇後會顯示對應的付款資訊。</div>
                ) : customer.paymentMethod === "銀行轉帳" ? (
                  <div className="border border-white/10 bg-black/20 p-4">
                    <p className="font-['ButlerCustom'] text-sm text-white">銀行轉帳帳號</p>
                    <p className="mt-2 font-['ButlerCustom'] text-lg tracking-[0.12em] text-[oklch(0.88_0.14_88)]">{BANK_ACCOUNT}</p>
                    <label className="mt-5 block"><span className="mb-2 block font-['ButlerCustom'] text-xs tracking-[0.16em] text-white/45">匯款末五碼</span><input name="paymentReference" required inputMode="numeric" maxLength={5} value={customer.paymentReference} onChange={(event) => handleCustomerChange("paymentReference", event.target.value.replace(/\D/g, "").slice(0, 5))} className="w-full border-b border-white/20 bg-transparent px-0 py-3 font-['ButlerCustom'] text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-white" placeholder="請輸入 5 碼" /></label>
                  </div>
                ) : (
                  <div className="border border-white/10 bg-black/20 p-4">
                    <p className="font-['ButlerCustom'] text-sm text-white">請先完成 LINE PAY 付款</p>
                    <img src={LINE_PAY_QR_IMAGE} alt="Late Night Ltd. LINE PAY 付款 QR Code" className="mx-auto mt-4 h-48 w-48 object-contain bg-white p-2" />
                    <label className="mt-5 block"><span className="mb-2 block font-['ButlerCustom'] text-xs tracking-[0.16em] text-white/45">付款後請填寫電話末三碼</span><input name="paymentReference" required inputMode="numeric" maxLength={3} value={customer.paymentReference} onChange={(event) => handleCustomerChange("paymentReference", event.target.value.replace(/\D/g, "").slice(0, 3))} className="w-full border-b border-white/20 bg-transparent px-0 py-3 font-['ButlerCustom'] text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-white" placeholder="請輸入 3 碼" /></label>
                  </div>
                )}
              </div>
              <button type="submit" disabled={cartItems.length === 0} className="btn-scale mt-8 inline-flex items-center gap-2 bg-white px-6 py-3 font-['ButlerCustom'] text-xs font-semibold tracking-[0.16em] text-black transition-colors hover:bg-[#ff0000] hover:text-white disabled:cursor-not-allowed disabled:opacity-30">送出訂單 <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></button>
              {formError && <p role="alert" className="mt-4 text-sm leading-6 text-[#ff5555]">{formError}</p>}
              {submittedOrder && <p className="mt-5 border-l-2 border-[#ff0000] pl-4 text-sm leading-6 text-white/65">訂單已建立，訂單編號為 <strong className="font-['ButlerCustom'] text-white">{submittedOrder}</strong>。請在郵件程式中確認並寄出訂單內容。</p>}
                </>
              )}
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
