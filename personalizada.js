gsap.set("body",{
    x:window.innerWidth,
    opacity:0
});

gsap.to("body",{
    x:0,
    opacity:1,
    duration:0.8,
    ease:"power2.inOut"
});
const upload = document.getElementById("upload");
const designContainer = document.getElementById("design-container");

let archivosUsuario = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let imagenesOriginales = [];

upload.addEventListener("change", function(){

   const nuevosArchivos = Array.from(this.files);

archivosUsuario.push(...nuevosArchivos);

console.log("Cantidad diseños:", archivosUsuario.length);

actualizarPrecio();



  nuevosArchivos.forEach(archivo => {

    const lector = new FileReader();

    lector.onload = function(e){
        crearDiseño(e.target.result);
    };

    lector.readAsDataURL(archivo);

});

Promise.all(
    nuevosArchivos.map(archivo => subirImagenCloudinary(archivo))
)
.then(res => {

    imagenesOriginales.push(
        ...res.map(img => img.secure_url)
    );

    console.log("Originales:", imagenesOriginales);

});

});



function crearDiseño(src){


    const img = document.createElement("img");


    img.src = src;

    img.classList.add("design");


    img.dataset.x = 0;
    img.dataset.y = 0;
    img.dataset.scale = 1;


    designContainer.appendChild(img);



    interact(img)

    .draggable({

        listeners:{


            move(event){


                let target = event.target;


                let x =
                (parseFloat(target.dataset.x)||0)
                + event.dx;


                let y =
                (parseFloat(target.dataset.y)||0)
                + event.dy;



                let scale =
                parseFloat(target.dataset.scale)||1;



                target.style.transform =
                `translate(${x}px,${y}px) scale(${scale})`;


                target.dataset.x=x;
                target.dataset.y=y;


            }


        }


    })


    .gesturable({


        listeners:{


            move(event){


                let target=event.target;


                let scale =
                parseFloat(target.dataset.scale)||1;



                scale += event.ds;


                scale=Math.min(
                    Math.max(scale,0.2),
                    3
                );


                let x=target.dataset.x||0;
                let y=target.dataset.y||0;


                target.style.transform =
                `translate(${x}px,${y}px) scale(${scale})`;


                target.dataset.scale=scale;


            }


        }


    });



    img.addEventListener("wheel",function(e){


        e.preventDefault();


        let scale =
        parseFloat(this.dataset.scale)||1;


        scale += e.deltaY < 0 ? .1 : -.1;


        scale=Math.min(
            Math.max(scale,.2),
            3
        );


        this.dataset.scale=scale;


        let x=this.dataset.x||0;
        let y=this.dataset.y||0;


        this.style.transform =
        `translate(${x}px,${y}px) scale(${scale})`;


    });



    img.addEventListener("click",function(e){

        e.stopPropagation();

        document.querySelector(".design-box")
        .classList.add("activo");

    });


}


emailjs.init("8EQTI5chcoZ0eA38d");





function subirImagenCloudinary(archivo){

    const formData = new FormData();

    formData.append("file", archivo);

    formData.append(
        "upload_preset",
        "MargaraDemo"
    );


    return fetch(
        "https://api.cloudinary.com/v1_1/et27eppk/image/upload",
        {
            method:"POST",
            body:formData
        }
    )
    .then(res => res.json());

}


const canvas = document.getElementById("shirtCanvas");
const ctx = canvas.getContext("2d");

const shirtImg = new Image();
shirtImg.src = "remera_blanca.png";

const colorSelect = document.getElementById("color");

let shirtColor = "#ffffff";


shirtImg.onload = () => {

    canvas.width = shirtImg.width;
    canvas.height = shirtImg.height;

    drawShirt();

};



function drawShirt(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    // dibujamos la remera original
    ctx.drawImage(shirtImg,0,0);


    let imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    );


    let pixels = imageData.data;


    for(let i=0; i<pixels.length; i+=4){

        let r = pixels[i];
        let g = pixels[i+1];
        let b = pixels[i+2];
        let a = pixels[i+3];


        // solo modifica zonas visibles
        if(a > 0){

            // conserva sombras
            let sombra = (r+g+b)/3 / 255;


            pixels[i]   = parseInt(
                parseInt(shirtColor.substring(1,3),16) * sombra
            );

            pixels[i+1] = parseInt(
                parseInt(shirtColor.substring(3,5),16) * sombra
            );

            pixels[i+2] = parseInt(
                parseInt(shirtColor.substring(5,7),16) * sombra
            );

        }

    }


    ctx.putImageData(imageData,0,0);

}



colorSelect.addEventListener("change",()=>{


    let color = colorSelect.value;


    if(color=="blanca"){
        shirtColor="#ffffff";
    }

    if(color=="negra"){
        shirtColor="#111111";
    }

    if(color=="roja"){
        shirtColor="#c62828";
    }

    if(color=="azul"){
        shirtColor="#1565c0";
    }

    if(color=="gris"){
        shirtColor="#777777";
    }


    drawShirt();

});
// =================
// PRECIO Y CARRITO
// =================

const precio = document.getElementById("precio");
const talle = document.getElementById("talle");
const botonCarrito = document.getElementById("agregarCarrito");







function actualizarPrecio() {
    precio.textContent = 1;
}
// ACTUALIZAR PRECIO




// CAMBIO DE TALLE

talle.addEventListener("change",()=>{

    actualizarPrecio();

});





// AGREGAR AL CARRITO

botonCarrito.addEventListener("click", () => {

    if (archivosUsuario.length === 0) {
        alert("Subí al menos un diseño antes de agregar al carrito");
        return;
    }

    html2canvas(document.querySelector(".remera"))
    .then(canvas => {
        // ... el resto queda igual
     canvas.toBlob(blob=>{

    const archivoPreview = new File(
        [blob],
        "preview.png",
        {
            type:"image/png"
        }
    );


    subirImagenCloudinary(archivoPreview)

    .then(resultado=>{


       console.log("Cantidad de originales:", imagenesOriginales.length);
console.log("Originales:", imagenesOriginales);

let remera = {
    talle: talle.value,
    color: document.getElementById("color").value,
    precio: Number(precio.textContent),
    imagen: resultado.secure_url,
    originales: [...imagenesOriginales]
};

carrito.push(remera);

        guardarCarrito();

        actualizarCarrito();

        limpiarEditor();

        abrirCarrito();


    });


},"image/png");


    });


});
function limpiarEditor(){
    designContainer.innerHTML = "";
    upload.value = "";

    archivosUsuario = [];
    imagenesOriginales = [];

    actualizarPrecio();

}
function guardarCarrito(){

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

}
const carritoPanel = document.getElementById("carritoPanel");
const listaCarrito = document.getElementById("listaCarrito");
const totalCarrito = document.getElementById("totalCarrito");


function actualizarCarrito(){


    listaCarrito.innerHTML = "";


    let total = 0;


    carrito.forEach((producto,index)=>{
console.log(producto);

        total += producto.precio;


        listaCarrito.innerHTML += `

        <div class="item-carrito">

            <h3>Remera personalizada</h3>

            <p>
            Talle: ${producto.talle}
            </p>

            <p>
            Color: ${producto.color}
            </p>

            <p>
            Precio: $${producto.precio}
            </p>


            <button onclick="eliminarProducto(${index})">
            Eliminar
            </button>


        </div>

        `;


    });


    totalCarrito.textContent = total;


    document.getElementById("contadorCarrito").textContent =
    carrito.length;


}


function eliminarProducto(index){

    carrito.splice(index,1);

    guardarCarrito();

    actualizarCarrito();

}


function abrirCarrito(){

    carritoPanel.classList.add("activo");

}



document
.getElementById("abrirCarrito")
.addEventListener("click",abrirCarrito);



document
.getElementById("cerrarCarrito")
.addEventListener("click",()=>{

    carritoPanel.classList.remove("activo");

});

document
.getElementById("comprar")
.addEventListener("click", async () => {

    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    const items = carrito.map(producto => ({
        title: `Remera personalizada (${producto.color} - ${producto.talle})`,
        quantity: 1,
        unit_price: producto.precio,
        currency_id: "ARS"
    }));

    try {

        const respuesta = await fetch("/api/crear-preferencia", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                items
            })
        });

        const data = await respuesta.json();

        window.location.href = data.init_point;

    } catch (error) {

        console.error(error);

        alert("No se pudo iniciar el pago.");

    }

});
function enviarCarrito(){


   let datosPedido = {

    nombre:"Compra desde carrito",

    email:"",

    remeras:"",

    originales:""

};



    carrito.forEach((producto,index)=>{


        datosPedido.remeras += `

REMERA ${index+1}

Talle: ${producto.talle}

Color: ${producto.color}

Precio: $${producto.precio}

Vista previa:
${producto.imagen}


-------------------

`;



        datosPedido.originales += `

REMERA ${index+1}


${(producto.originales || []).join("\n")}


-------------------

`;


    });



    emailjs.send(
        "service_9uxhhti",
        "template_jokv4mx",
        datosPedido
    )


    .then(()=>{

alert("¡Pedido enviado!");

carrito=[];
guardarCarrito();
actualizarCarrito();

})


    .catch(error=>{

        console.log(error);

        alert("Error enviando pedido");

    });


}