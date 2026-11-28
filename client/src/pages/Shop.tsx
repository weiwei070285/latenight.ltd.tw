/* ============================================================
   Shop Page — Late Night Ltd.
   Product catalogue + cart + order form.
   Orders are sent straight to a Google Apps Script web app, which
   writes a row to the company Google Sheet and emails a notification
   (and a confirmation to the customer).
   Set ORDER_ENDPOINT to the Apps Script /exec URL. While it is empty
   the page runs in preview mode and only simulates a successful order.
   ============================================================ */
import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Check, CheckCircle2, Loader2, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Layout from "@/components/Layout";
import { asset } from "@/lib/asset";
import { onCheckoutRequest, useCart } from "@/lib/cartStore";

const CASSETTE_IMAGE = asset("images/shop-cassette-naihe.webp");
const CASE_IMAGE = asset("images/shop-logo-case.webp");
const AREA_NIGHT_IMAGE = asset("images/shop-area-night-cassette.webp");
const TV_KEYCHAIN_IMAGE = asset("images/shop-tv-keychain.webp");
const LINE_PAY_QR_IMAGE = asset("images/line-pay-qr.webp");
const SHIPPING_FEE = 60;
const ORDER_EMAIL = "latenight.ltd.tw@gmail.com";
/** Google Apps Script web app URL (ends with /exec). Empty = preview mode. */
const ORDER_ENDPOINT = "https://script.google.com/macros/s/AKfycbyLcFjKZQMh73xmd26QezAq_JNC-MQhVTbvg-8oqfOxyKuvRqaZPwMnyfIKRxOug1gGDg/exec";
const BANK_ACCOUNT = "(807)-10301820033171";

type Product = {
  id: number;
  name: string;
  description: ReactNode;
  price: number;
  image: string | null; // null = 圖片準備中
};

// ⚠ 商品名稱與價格也寫在 Google Apps Script（Code.gs 的 PRICES），兩邊要一致
const products: Product[] = [
  {
    id: 3,
    name: "ALBUM《AREA NIGHT》CASSETTE",
    description: "LEIGHT NINE 首張專輯《AREA NIGHT》卡帶📼\n收錄9首曲目，內含歌詞小本",
    price: 850,
    image: AREA_NIGHT_IMAGE,
  },
  {
    id: 1,
    name: "SINGLE〈NAI HE〉CASSETTE",
    description: "LEIGHT NINE 首發單曲〈NAIHE〉卡帶，\n僅收錄一首曲目",
    price: 420,
    image: CASSETTE_IMAGE,
  },
  {
    id: 2,
    name: "LOGO CASE",
    description: "LEIGHT NINE 可掛身收納盒，\n收納小東西使用、亦可當作菸盒\n（尺寸：長10.5 寬6.5 厚2.5 CM）",
    price: 350,
    image: CASE_IMAGE,
  },
  {
    id: 4,
    name: "CO-BRANDED TV keychain",
    description: (
      <>
        與
        <a
          href="https://www.instagram.com/kirei_league/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white underline decoration-white/40 underline-offset-4 transition-colors hover:text-[oklch(0.88_0.14_88)]"
        >
          世界漂亮在台協會
        </a>
        聯名之小電視鑰匙圈📺
      </>
    ),
    price: 250,
    image: TV_KEYCHAIN_IMAGE,
  },
];

function ProductImage({ src, alt, className }: { src: string | null; alt: string; className: string }) {
  if (src) return <img src={src} alt={alt} className={className} />;
  return (
    <div className={`${className} flex items-center justify-center bg-[oklch(0.15_0.005_285)]`} aria-label={`${alt}（圖片準備中）`}>
      <span className="font-['ButlerCustom'] text-[10px] tracking-[0.3em] text-white/30">COMING SOON</span>
    </div>
  );
}


type CustomerInfo = {
  name: string;
  phone: string;
  store: string;
  email: string;
  paymentMethod: string;
  paymentReference: string;
};

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
  const [cart, setCart] = useCart(); // 和右上角購物車圖示共用，換頁也會保留
  const [customer, setCustomer] = useState<CustomerInfo>(emptyCustomer);
  const [submittedOrder, setSubmittedOrder] = useState<{ number: string; total: number; email: string } | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formError, setFormError] = useState("");
  const [hasPaid, setHasPaid] = useState(false);
  const [honeypot, setHoneypot] = useState(""); // hidden field; real visitors leave it empty

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

  // ---- 加入購物車的回饋：提示小視窗、按鈕「已加入」、浮動購物車列 ----
  const [toastProductId, setToastProductId] = useState<number | null>(null);
  const [justAddedId, setJustAddedId] = useState<number | null>(null);
  const [checkoutInView, setCheckoutInView] = useState(false);
  const toastTimer = useRef<number | undefined>(undefined);
  const justAddedTimer = useRef<number | undefined>(undefined);
  const checkoutRef = useRef<HTMLDivElement>(null);
  const cartBoxRef = useRef<HTMLDivElement>(null);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    // 只有「購物車清單」本身出現在畫面上時，才隱藏浮動購物車列
    const el = cartBoxRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setCheckoutInView(entry.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 從右上角購物車圖示點進來時，直接捲到結帳區
  useEffect(
    () =>
      onCheckoutRequest(() => {
        setToastProductId(null);
        window.setTimeout(() => checkoutRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      }),
    [],
  );

  useEffect(() => () => {
    window.clearTimeout(toastTimer.current);
    window.clearTimeout(justAddedTimer.current);
  }, []);

  const goToCheckout = () => {
    setToastProductId(null);
    checkoutRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const addToCart = (productId: number) => {
    updateQuantity(productId, (cart[productId] ?? 0) + 1);
    setSubmittedOrder(null);
    setIsConfirming(false);

    setToastProductId(productId);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastProductId(null), 4500);

    setJustAddedId(productId);
    window.clearTimeout(justAddedTimer.current);
    justAddedTimer.current = window.setTimeout(() => setJustAddedId(null), 1400);
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
    setIsConfirming(true);
  };

  const handleFinalSubmit = async () => {
    if (!hasPaid) {
      setFormError("請勾選已完成付款，再確認並送出訂單。");
      return;
    }
    if (isSending) return;
    const orderNumber = createOrderNumber();
    const payload = {
      orderNumber,
      createdAt: new Date().toISOString(),
      items: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      })),
      subtotal,
      shipping,
      total,
      name: customer.name.trim(),
      phone: normalizedPhone,
      store: customer.store.trim(),
      email: customer.email.trim(),
      paymentMethod: customer.paymentMethod,
      paymentReference: customer.paymentReference,
      website: honeypot,
    };

    setIsSending(true);
    setFormError("");
    try {
      if (ORDER_ENDPOINT) {
        // text/plain keeps this a "simple" request (no CORS preflight) for Apps Script
        const res = await fetch(ORDER_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      } else {
        await new Promise((r) => setTimeout(r, 900)); // preview mode
      }
      setSubmittedOrder({ number: orderNumber, total, email: payload.email });
      setCart({});
      setCustomer(emptyCustomer);
      setHasPaid(false);
      setIsConfirming(false);
      window.scrollTo({ top: document.getElementById("order-form")?.offsetTop ?? 0, behavior: "smooth" });
    } catch {
      setFormError(`訂單送出失敗，請稍後再試一次；若持續失敗，請將訂單內容寄到 ${ORDER_EMAIL}。`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Layout>
      <section className="relative overflow-hidden bg-black px-6 pb-6 pt-32 lg:px-10 lg:pb-8 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,oklch(0.88_0.14_88/0.10),transparent_34%)]" />
        <div className="relative z-10 mx-auto max-w-[1400px]">
          <p className="mb-4 font-['ButlerCustom'] text-xs tracking-[0.4em] text-[oklch(0.70_0.02_280)]">SHOP</p>
          <div className="mt-6 h-px w-16 bg-[oklch(0.70_0.02_280)]" />
        </div>
      </section>

      <section className="page-section pt-6! lg:pt-8!">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
            {products.map((product) => (
              <article key={product.id} className="group flex flex-col items-start">
                <div className="relative mb-6 aspect-square h-64 w-64 overflow-hidden lg:h-80 lg:w-80">
                  <ProductImage src={product.image} alt={product.name} className="image-fade-in h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-[oklch(0.10_0.005_285/0.3)] transition-colors duration-300 group-hover:bg-[oklch(0.10_0.005_285/0.15)]" />
                </div>
                <h2 className="font-['ButlerCustom'] text-lg text-white transition-colors duration-200 group-hover:text-[oklch(0.88_0.14_88)] lg:text-xl">{product.name}</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[oklch(0.75_0.005_65)]">{product.description}</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-['ButlerCustom'] text-xs tracking-[0.2em] text-[#ff0000]">Price</span>
                  <span className="font-['ButlerCustom'] text-xs tracking-[0.2em] text-[#ff0000]">{formatCurrency(product.price)}</span>
                </div>
                <div className="mt-5 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => addToCart(product.id)}
                    className={`btn-scale inline-flex min-w-[150px] items-center justify-center gap-2 px-5 py-3 font-['ButlerCustom'] text-xs tracking-[0.16em] transition-colors ${
                      justAddedId === product.id ? "bg-[#ff0000] text-white" : "bg-white text-black hover:bg-[#ff0000] hover:text-white"
                    }`}
                  >
                    {justAddedId === product.id ? (
                      <><Check className="h-4 w-4" aria-hidden="true" />已加入</>
                    ) : (
                      <><ShoppingBag className="h-4 w-4" aria-hidden="true" />Add to cart</>
                    )}
                  </button>
                  {cart[product.id] ? (
                    <button type="button" onClick={goToCheckout} className="font-['ButlerCustom'] text-xs tracking-[0.12em] text-white/60 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white">
                      購物車內 ×{cart[product.id]}
                    </button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>

          <div className="my-16 h-px bg-gradient-to-r from-transparent via-[oklch(1_0_0/20%)] to-transparent" />

          <div id="checkout" ref={checkoutRef} className="scroll-mt-24 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)] lg:gap-16">
            <div>
              <div className="mb-8">
                <p className="mb-4 font-['ButlerCustom'] text-xs tracking-[0.4em] text-[oklch(0.70_0.02_280)]">ORDER FORM</p>
                <h2 className="mb-4 font-['ButlerCustom'] text-[24px] text-white">購買與運送資訊</h2>
                <p className="whitespace-pre-line text-sm leading-7 text-[oklch(0.75_0.005_65)]">{"選擇商品加入購物車，系統會自動計算總金額（包含固定運費 NT$60）。\n選擇付款方式並完成付款，填寫資料後按下「送出訂單」，\n訂單會直接傳送給我們，同時寄一封訂單確認信到你的 Email。"}</p>
                <div className="mt-7 grid grid-cols-3 gap-2 border-y border-white/10 py-4 text-center text-[10px] tracking-[0.12em] text-white/45 sm:text-xs">
                  <span className="text-white">01 選商品</span><span>02 填資料與付款</span><span>03 確認送出</span>
                </div>
              </div>

              <div ref={cartBoxRef} className="overflow-hidden rounded-lg border border-[oklch(1_0_0/10%)] bg-[oklch(0.12_0.005_285)]">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <h3 className="font-['ButlerCustom'] text-xl text-white">Shopping cart</h3>
                  <span className="text-xs tracking-[0.12em] text-white/45">{cartItems.reduce((sum, item) => sum + item.quantity, 0)} ITEMS</span>
                </div>
                {cartItems.length > 0 ? (
                  <div className="divide-y divide-white/10">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 px-5 py-5">
                        <ProductImage src={item.image} alt={item.name} className="h-16 w-16 shrink-0 object-cover" />
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

            <form id="order-form" onSubmit={isConfirming ? (event) => { event.preventDefault(); handleFinalSubmit(); } : handleSubmit} className="glass-card h-fit p-6 sm:p-8">
              {submittedOrder && !isConfirming && cartItems.length === 0 ? (
                <div className="py-4 text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-[oklch(0.88_0.14_88)]" aria-hidden="true" />
                  <p className="mt-6 font-['ButlerCustom'] text-xs tracking-[0.3em] text-white/40">ORDER RECEIVED</p>
                  <h3 className="mt-3 text-[22px] font-semibold tracking-[1px] text-white">訂單已送出，謝謝你！</h3>
                  <div className="mx-auto mt-6 max-w-sm space-y-2 border-y border-white/10 py-5 text-sm text-white/65">
                    <div className="flex justify-between gap-4"><span>訂單編號</span><span className="font-['ButlerCustom'] text-white">{submittedOrder.number}</span></div>
                    <div className="flex justify-between gap-4"><span>訂單總額</span><span className="font-['ButlerCustom'] text-white">{formatCurrency(submittedOrder.total)}</span></div>
                  </div>
                  <p className="mx-auto mt-6 max-w-sm text-sm leading-7 text-white/60">
                    訂單確認信已寄到 <span className="text-white">{submittedOrder.email}</span>。<br />
                    我們確認款項後將於 5-7 個工作天出貨，<br />商品到店時 7-11 會另有簡訊通知。
                  </p>
                  <button type="button" onClick={() => setSubmittedOrder(null)} className="btn-scale mt-8 border border-white/20 px-5 py-3 font-['ButlerCustom'] text-xs tracking-[0.16em] text-white transition-colors hover:border-white">繼續選購</button>
                </div>
              ) : isConfirming ? (
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
                  {formError && <p role="alert" className="mt-4 text-sm leading-6 text-[#ff5555]">{formError}</p>}
                  <div className="mt-8 flex flex-wrap gap-3">
                    <button type="button" disabled={isSending} onClick={() => { setHasPaid(false); setIsConfirming(false); }} className="btn-scale border border-white/20 px-5 py-3 font-['ButlerCustom'] text-xs tracking-[0.16em] text-white transition-colors hover:border-white">返回修改</button>
                    <button type="submit" disabled={isSending} className="btn-scale inline-flex items-center gap-2 bg-white px-5 py-3 font-['ButlerCustom'] text-xs font-semibold tracking-[0.16em] text-black transition-colors hover:bg-[#ff0000] hover:text-white disabled:cursor-wait disabled:opacity-60">{isSending ? <>送出中 <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /></> : <>確認並送出訂單 <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></>}</button>
                  </div>
                </div>
              ) : (
                <>
              <div className="mb-8">
                <p className="mb-3 font-['ButlerCustom'] text-xs tracking-[0.2em] text-white/35">CUSTOMER INFORMATION</p>
                <h3 className="font-['ButlerCustom'] text-2xl text-white">顧客資料</h3>
              </div>
              <div className="space-y-5">
                <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden="true" />
                <label className="block"><span className="mb-2 block font-['ButlerCustom'] text-xs tracking-[0.16em] text-white/45">姓名 Name <em className="font-normal not-italic tracking-normal text-white/45">（請填寫身分證件上之本名，以確保後續取貨順利。）</em></span><input name="name" required value={customer.name} onChange={(event) => handleCustomerChange("name", event.target.value)} className="w-full border-b border-white/20 bg-transparent px-0 py-3 font-['ButlerCustom'] text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-white" placeholder="Your name" /></label>
                <label className="block"><span className="mb-2 block font-['ButlerCustom'] text-xs tracking-[0.16em] text-white/45">電話 Phone</span><input name="phone" required type="tel" value={customer.phone} onChange={(event) => { handleCustomerChange("phone", event.target.value); setFormError(""); }} aria-invalid={Boolean(customer.phone) && !isPhoneValid} className={`w-full border-b bg-transparent px-0 py-3 font-['ButlerCustom'] text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-white ${customer.phone && !isPhoneValid ? "border-[#ff5555]" : "border-white/20"}`} placeholder="09xx-xxx-xxx" />{customer.phone && !isPhoneValid && <span className="mt-2 block text-xs leading-5 text-[#ff5555]">格式請填 10 碼手機號碼，例如 09xx-xxx-xxx。</span>}{customer.phone && isPhoneValid && <span className="mt-2 block text-xs leading-5 text-white/45">手機格式正確。</span>}</label>
                <label className="block"><span className="mb-2 flex items-center justify-between gap-3 font-['ButlerCustom'] text-xs tracking-[0.16em] text-white/45"><span>7-ELEVEN 店到店門市</span><a href="https://emap.pcsc.com.tw/" target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1 text-white transition-colors hover:text-[oklch(0.88_0.14_88)]">查詢門市 <ArrowUpRight className="h-3 w-3" aria-hidden="true" /></a></span><input name="store" required value={customer.store} onChange={(event) => handleCustomerChange("store", event.target.value)} className="w-full border-b border-white/20 bg-transparent px-0 py-3 font-['ButlerCustom'] text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-white" placeholder="例如：台北市中正區 ○○門市（店號）" /></label>
                <label className="block"><span className="mb-2 block font-['ButlerCustom'] text-xs tracking-[0.16em] text-white/45">聯絡 Email <em className="font-normal not-italic tracking-normal text-white/45">（訂單確認信會寄到這裡）</em></span><input name="email" required type="email" value={customer.email} onChange={(event) => { handleCustomerChange("email", event.target.value); setFormError(""); }} aria-invalid={Boolean(customer.email) && !isEmailValid} className={`w-full border-b bg-transparent px-0 py-3 font-['ButlerCustom'] text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-white ${customer.email && !isEmailValid ? "border-[#ff5555]" : "border-white/20"}`} placeholder="you@example.com" />{customer.email && !isEmailValid && <span className="mt-2 block text-xs leading-5 text-[#ff5555]">請輸入正確的 Email，例如 you@example.com。</span>}{customer.email && isEmailValid && <span className="mt-2 block text-xs leading-5 text-white/45">Email 格式正確。</span>}</label>
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
                </>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* 加入購物車提示小視窗 */}
      {toastProductId !== null && (() => {
        const p = products.find((x) => x.id === toastProductId);
        if (!p) return null;
        return (
          <div
            role="status"
            aria-live="polite"
            className="fixed inset-x-3 bottom-3 z-50 rounded-lg border border-white/15 bg-[oklch(0.14_0.006_285/0.96)] p-4 shadow-2xl backdrop-blur-md sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[360px] animate-in fade-in slide-in-from-bottom-4 duration-300"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="flex items-center gap-2 font-['ButlerCustom'] text-xs tracking-[0.16em] text-white">
                <CheckCircle2 className="h-4 w-4 text-[oklch(0.88_0.14_88)]" aria-hidden="true" />
                已加入購物車
              </p>
              <button type="button" onClick={() => setToastProductId(null)} className="text-white/40 transition-colors hover:text-white" aria-label="關閉">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <ProductImage src={p.image} alt={p.name} className="h-14 w-14 shrink-0 object-cover" />
              <div className="min-w-0">
                <p className="truncate font-['ButlerCustom'] text-sm text-white">{p.name}</p>
                <p className="mt-0.5 text-xs text-white/50">{formatCurrency(p.price)} · 購物車內 ×{cart[p.id] ?? 0}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-white/60">
              <span>購物車共 {itemCount} 件</span>
              <span>商品小計 <span className="font-['ButlerCustom'] text-sm text-white">{formatCurrency(subtotal)}</span></span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setToastProductId(null)} className="border border-white/20 py-2.5 font-['ButlerCustom'] text-xs tracking-[0.12em] text-white transition-colors hover:border-white">
                繼續選購
              </button>
              <button type="button" onClick={goToCheckout} className="bg-white py-2.5 font-['ButlerCustom'] text-xs tracking-[0.12em] text-black transition-colors hover:bg-[#ff0000] hover:text-white">
                前往結帳
              </button>
            </div>
          </div>
        );
      })()}

      {/* 浮動購物車列：購物車有東西、且結帳區不在畫面上時顯示 */}
      {itemCount > 0 && !checkoutInView && toastProductId === null && !submittedOrder && (
        <button
          type="button"
          onClick={goToCheckout}
          className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-between gap-4 rounded-lg border border-white/15 bg-[oklch(0.14_0.006_285/0.96)] px-5 py-3.5 text-left shadow-2xl backdrop-blur-md transition-colors hover:border-white/40 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:min-w-[320px] animate-in fade-in slide-in-from-bottom-4 duration-300"
          aria-label={`購物車 ${itemCount} 件，商品小計 ${formatCurrency(subtotal)}，前往結帳`}
        >
          <span className="flex items-center gap-3">
            <span className="relative">
              <ShoppingBag className="h-5 w-5 text-white" aria-hidden="true" />
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff0000] px-1 text-[10px] font-semibold text-white">{itemCount}</span>
            </span>
            <span className="font-['ButlerCustom'] text-sm text-white">{formatCurrency(subtotal)}</span>
          </span>
          <span className="inline-flex items-center gap-1 font-['ButlerCustom'] text-xs tracking-[0.12em] text-white/80">
            前往結帳 <ArrowUpRight className="h-3.5 w-3.5 rotate-90" aria-hidden="true" />
          </span>
        </button>
      )}
    </Layout>
  );
}
