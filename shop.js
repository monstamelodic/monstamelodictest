(() => {
const products = [
 {id:'pearl',name:'Pearl Logo Pin',kind:'physical',price:400,image:'pearl-pin.jpg',tag:'POCKET-SIZE CHAOS',description:'A pearly little logo button for your bag, jacket, or growing pin collection.',options:['Pearl / sample size']},
 {id:'midnight',name:'Midnight Logo Pin',kind:'physical',price:400,image:'midnight-pin.jpg',tag:'THE LOGO COLLECTION',description:'Our signature logo, with a deep-purple twist. Tiny merch, big personality.',options:['Midnight purple / sample size']},
 {id:'case',name:'Lilac Logo Case',kind:'physical',price:1800,image:'lilac-case.jpg',tag:'EVERYDAY MONSTA',description:'A soft lilac look for your everyday sidekick. Device options are illustrative.',options:['iPhone 15 — demo','iPhone 16 — demo','iPhone 17 — demo']},
 {id:'wallpaper',name:'Monsta Wallpaper Pack',kind:'digital',price:300,image:'Logo.png',tag:'DIGITAL CONCEPT',description:'An example digital extra for your lock screen. No download files included.',options:['Phone wallpaper / digital concept']}
];
const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n/100);
const grid=document.querySelector('#product-grid'),dialog=document.querySelector('#cart-dialog'),content=document.querySelector('#cart-content');
let cart=[];try{const saved=JSON.parse(sessionStorage.getItem('mm-demo-bag')||'[]');if(Array.isArray(saved)) cart=saved.filter(x=>products.some(p=>p.id===x.id&&p.options.includes(x.option))&&Number.isInteger(x.qty)&&x.qty>0&&x.qty<=99).map(x=>({id:x.id,option:x.option,qty:x.qty}));}catch{}
const product=id=>products.find(p=>p.id===id);
const persist=()=>{try{sessionStorage.setItem('mm-demo-bag',JSON.stringify(cart));}catch{}document.querySelector('#bag-count').textContent=cart.reduce((s,x)=>s+x.qty,0);};
let toastTimer;
function toast(text){const t=document.querySelector('#shop-status');t.textContent=text;t.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('visible'),2600);}
function renderProducts(category='all'){
 grid.innerHTML=products.filter(p=>category==='all'||p.kind===category).map(p=>`<article class="product-card"><div class="product-image">${p.kind==='digital'?`<div class="digital-art"><img src="Logo.png" alt="Monsta Melodic logo"><strong>YOUR SCREEN.<br>OUR WORLD.</strong><small>WALLPAPER PACK / CONCEPT</small></div>`:`<img src="${p.image}" alt="${p.name}" loading="lazy">`}<span class="product-tag">${p.tag}</span></div><div class="product-details"><span class="product-kind">${p.kind==='digital'?'DIGITAL DOWNLOAD · DEMO':'PHYSICAL MERCH · DEMO'}</span><h3>${p.name}</h3><p class="product-description">${p.description}</p><label for="option-${p.id}">${p.id==='case'?'Device (sample options)':'Edition'}<select id="option-${p.id}">${p.options.map(o=>`<option>${o}</option>`).join('')}</select></label><div class="product-bottom"><span class="product-price">${money(p.price)}</span><button class="add-button" data-add="${p.id}" aria-label="Add ${p.name} to demo bag">Add to bag +</button></div></div></article>`).join('');
 document.querySelector('#result-count').textContent=`${grid.children.length} products`;
}
function renderCart(){
 if(!cart.length){content.innerHTML='<div class="empty-bag"><div class="success-star" aria-hidden="true">✧</div><h3>Your bag is waiting.</h3><p>A little room for something monstrous.</p><button class="checkout-button" data-continue>Explore the collection</button></div>';return;}
 const subtotal=cart.reduce((s,x)=>s+product(x.id).price*x.qty,0),shipping=cart.some(x=>product(x.id).kind==='physical')?500:0;
 content.innerHTML=cart.map((x,i)=>{const p=product(x.id);return `<div class="cart-line"><img class="cart-thumb" src="${p.image}" alt=""><div><div class="cart-name">${p.name}</div><div class="cart-option">${x.option}</div><div class="cart-controls"><button data-change="-1" data-index="${i}" aria-label="Decrease ${p.name} quantity">−</button><span aria-label="Quantity">${x.qty}</span><button data-change="1" data-index="${i}" aria-label="Increase ${p.name} quantity" ${x.qty===99?'disabled':''}>+</button><button class="remove" data-remove="${i}" aria-label="Remove ${p.name}">Remove</button><strong>${money(p.price*x.qty)}</strong></div></div></div>`;}).join('')+`<div class="cart-totals"><div><span>Subtotal</span><span>${money(subtotal)}</span></div><div><span>Demo shipping estimate</span><span>${shipping?money(shipping):'No shipping'}</span></div><div class="total"><span>Demo total</span><span>${money(subtotal+shipping)}</span></div></div><p class="cart-note">Illustrative USD prices. Taxes are not calculated. ${shipping?'$5 is a sample shipping charge, not a carrier quote.':'Digital-only bag: no shipping required.'}</p><button class="checkout-button" id="demo-checkout">Try demo checkout ↗</button><p class="cart-note">No payment details, address, or email required.</p>`;
}
grid.addEventListener('click',e=>{const button=e.target.closest('[data-add]');if(!button)return;const p=product(button.dataset.add),option=document.querySelector('#option-'+p.id).value;const existing=cart.find(x=>x.id===p.id&&x.option===option);if(existing&&existing.qty>=99){toast('Demo quantity limit: 99 per option.');return;}if(existing)existing.qty++;else cart.push({id:p.id,option,qty:1});persist();toast(p.name+' added to your demo bag.');});
document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderProducts(button.dataset.category);}));
document.querySelector('#open-cart').addEventListener('click',()=>{renderCart();dialog.showModal();});
document.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
content.addEventListener('click',e=>{
 const change=e.target.closest('[data-change]'),remove=e.target.closest('[data-remove]');
 if(change){const i=Number(change.dataset.index);cart[i].qty+=Number(change.dataset.change);cart=cart.filter(x=>x.qty>0);persist();renderCart();const buttons=content.querySelectorAll('[data-change]');(buttons[Math.min(i*2,buttons.length-1)]||content.querySelector('button'))?.focus();}
 if(remove){cart.splice(Number(remove.dataset.remove),1);persist();renderCart();content.querySelector('button')?.focus();}
 if(e.target.closest('[data-continue]'))dialog.close();
 if(e.target.closest('#demo-checkout')){content.innerHTML='<div class="order-success"><div class="success-star" aria-hidden="true">✦</div><span class="eyebrow">DEMO COMPLETE</span><h3>A little more monstrous.</h3><p>That’s what placing an order could feel like!</p><p><strong>No payment was taken. No order was placed.</strong><br>No products will be shipped or downloaded.</p><button class="checkout-button" data-continue>Keep exploring</button></div>';cart=[];persist();content.querySelector('button').focus();}
});
renderProducts();persist();
})();
