// PURE GALLERY — настройки магазина. Изменяйте товары, остатки, размеры и контакты здесь.
 // Для фото замените images/work-01.svg и т. д. на ваши файлы, например images/my-art-01.jpg.
const STORE = {\n  shopName: "PURE GALLERY",
  currency: "USD", // замените на "RUB", если продаёте в рублях
  telegram: "https://t.me/your_telegram", // замените на свою ссылку
  email: "hello@example.com", // замените на свой email
  // Заявка отправляется через почтовое приложение покупателя. Для автоматического приёма
  // подключите Formspree / Netlify Forms или свой сервер.
  products: [
    {id:1,title:"Тихая форма",category:"abstract",categoryName:"Абстракция",price:89,image:"images/work-01.svg",stock:4,featured:1,sizes:[{label:"30 × 40 см",price:89},{label:"50 × 70 см",price:149},{label:"70 × 100 см",price:219}]},
    {id:2,title:"Тёплый горизонт",category:"nature",categoryName:"Природа",price:95,image:"images/work-02.svg",stock:2,featured:2,sizes:[{label:"30 × 40 см",price:95},{label:"50 × 70 см",price:155}]},
    {id:3,title:"Линия света",category:"minimal",categoryName:"Минимализм",price:79,image:"images/work-03.svg",stock:6,featured:3,sizes:[{label:"30 × 40 см",price:79},{label:"50 × 70 см",price:135},{label:"70 × 100 см",price:205}]},
    {id:4,title:"После дождя",category:"nature",categoryName:"Природа",price:109,image:"images/work-04.svg",stock:0,featured:4,sizes:[{label:"40 × 50 см",price:109},{label:"60 × 80 см",price:179}]},
    {id:5,title:"Смелый жест",category:"abstract",categoryName:"Абстракция",price:99,image:"images/work-05.svg",stock:3,featured:5,sizes:[{label:"30 × 40 см",price:99},{label:"50 × 70 см",price:159},{label:"70 × 100 см",price:229}]},
    {id:6,title:"Пауза",category:"minimal",categoryName:"Минимализм",price:85,image:"images/work-06.svg",stock:1,featured:6,sizes:[{label:"30 × 40 см",price:85},{label:"50 × 70 см",price:145}]}
  ]
};
const money = n => new Intl.NumberFormat("ru-RU",{style:"currency",currency:STORE.currency,maximumFractionDigits:0}).format(n);
let category="all", cart=[];
const grid=document.getElementById("product-grid");
function renderProducts(){
  let items=STORE.products.filter(p=>(category==="all"||p.category===category));
  const sort=document.getElementById("sort-select").value;
  if(sort==="price-asc")items.sort((a,b)=>a.price-b.price);
  if(sort==="price-desc")items.sort((a,b)=>b.price-a.price);
  if(sort==="featured")items.sort((a,b)=>a.featured-b.featured);
  document.getElementById("results-count").textContent=`${items.length} ${items.length===1?"работа":"работ"}`;
  grid.innerHTML=items.map(p=>`<article class="product-card">
    <div class="product-image"><img src="${p.image}" alt="${p.title}" loading="lazy"><span class="stock-badge ${p.stock===0?"out":""}">${p.stock===0?"Нет в наличии":`В наличии: ${p.stock}`}</span></div>
    <div class="product-info"><div class="product-top"><div><h3 class="product-title">${p.title}</h3><p class="product-category">${p.categoryName}</p></div><div class="product-price">${money(p.sizes[0].price)}<br><small style="font-size:8px;color:#777">от</small></div></div>
    <div class="product-controls"><select id="size-${p.id}" aria-label="Размер: ${p.title}">${p.sizes.map((s,i)=>`<option value="${i}">${s.label} · ${money(s.price)}</option>`).join("")}</select><button class="add-button" data-add="${p.id}" ${p.stock===0?"disabled":""}>${p.stock===0?"Нет в наличии":"+ В корзину"}</button></div></div></article>`).join("");
}
function renderCart(){
  const box=document.getElementById("cart-items");
  const count=cart.reduce((n,x)=>n+x.qty,0),total=cart.reduce((n,x)=>n+x.price*x.qty,0);
  document.getElementById("cart-count").textContent=count;
  document.getElementById("cart-label").textContent=`${count} позиций`;
  document.getElementById("cart-total").textContent=money(total);
  box.innerHTML=cart.length?cart.map((x,i)=>`<div class="cart-row"><img src="${x.image}" alt=""><div><strong>${x.title}</strong><small>${x.size} · ${money(x.price)} × ${x.qty}</small></div><button data-remove="${i}" aria-label="Удалить">×</button></div>`).join(""):`<div class="empty-cart">Пока здесь пусто.<br><a href="#catalog">Выбрать первый холст ↗</a></div>`;
}
grid.addEventListener("click",e=>{
 const id=Number(e.target.dataset.add);if(!id)return;
 const p=STORE.products.find(x=>x.id===id),size=p.sizes[Number(document.getElementById(`size-${id}`).value)];
 const existing=cart.find(x=>x.id===id&&x.size===size.label);
 if(existing)existing.qty++;else cart.push({id,title:p.title,size:size.label,price:size.price,image:p.image,qty:1});
 renderCart();const toast=document.getElementById("toast");toast.textContent="Добавлено в корзину";toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1800);
});
document.getElementById("cart-items").addEventListener("click",e=>{const i=e.target.dataset.remove;if(i!==undefined){cart.splice(Number(i),1);renderCart();}});
document.getElementById("category-filters").addEventListener("click",e=>{if(!e.target.dataset.category)return;category=e.target.dataset.category;document.querySelectorAll(".filter-chip").forEach(b=>b.classList.toggle("active",b===e.target));renderProducts();});
document.getElementById("sort-select").addEventListener("change",renderProducts);
document.getElementById("order-form").addEventListener("submit",e=>{
 e.preventDefault();if(!cart.length){document.getElementById("form-status").textContent="Сначала добавьте холст в корзину.";return;}
 const f=new FormData(e.target),lines=cart.map(x=>`${x.title} — ${x.size} — ${money(x.price)} × ${x.qty}`).join("\n");
 const body=`Здравствуйте! Хочу оформить заказ:\n\n${lines}\n\nИтого: ${document.getElementById("cart-total").textContent}\nИмя: ${f.get("name")}\nКонтакт: ${f.get("contact")}\nАдрес: ${f.get("address")||"не указан"}\nКомментарий: ${f.get("comment")||"—"}`;
 const subject=encodeURIComponent("Заявка на заказ холстов FORMA");
 const mail=`mailto:${STORE.email}?subject=${subject}&body=${encodeURIComponent(body)}`;
 document.getElementById("form-status").textContent="Откроется почтовое приложение с готовой заявкой. Проверьте адрес получателя в настройках сайта.";
 window.location.href=mail;
});
document.getElementById("contact-link").href=STORE.telegram;
document.getElementById("email-link").href=`mailto:${STORE.email}`;
document.getElementById("year").textContent=new Date().getFullYear();
document.getElementById("menu-toggle").addEventListener("click",()=>document.querySelector(".desktop-nav").classList.toggle("open"));
renderProducts();renderCart();
