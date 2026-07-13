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
const design = document.getElementById("design");
const designBox = document.querySelector(".design-box");
let archivoUsuario = null;

upload.addEventListener("change", function () {

    archivoUsuario = this.files[0];

    if (!archivoUsuario) return;


    const lector = new FileReader();


    lector.onload = function(e){

        design.src = e.target.result;
        design.style.display = "block";

    };


    lector.readAsDataURL(archivoUsuario);


    // PRUEBA CLOUDINARY
    subirImagenCloudinary(archivoUsuario)
    .then(res => {

        console.log("Respuesta Cloudinary:");
        console.log(res);

    })
    .catch(error => {

        console.log("Error Cloudinary:");
        console.log(error);

    });


});
// MOVER Y AGRANDAR DISEÑO
interact("#design")
.draggable({

    listeners: {

        move(event){

            let target = event.target;

            let x = (parseFloat(target.dataset.x) || 0) + event.dx;
            let y = (parseFloat(target.dataset.y) || 0) + event.dy;

            let scale = parseFloat(target.dataset.scale) || 1;


            target.style.transform =
            `translate(${x}px, ${y}px) scale(${scale})`;


            target.dataset.x = x;
            target.dataset.y = y;

        }

    }

})


.gesturable({

    listeners: {

        move(event){

            let target = event.target;

            let scale =
            parseFloat(target.dataset.scale) || 1;


            scale += event.ds;


            scale = Math.min(
                Math.max(scale,0.2),
                3
            );


            let x = target.dataset.x || 0;
            let y = target.dataset.y || 0;


            target.style.transform =
            `translate(${x}px, ${y}px) scale(${scale})`;


            target.dataset.scale = scale;

        }

    }

});



// ZOOM CON RUEDA EN PC

design.addEventListener("wheel", function(e){

    e.preventDefault();


    let scale =
    parseFloat(this.dataset.scale) || 1;


    if(e.deltaY < 0){

        scale += 0.1;

    }else{

        scale -= 0.1;

    }


    scale = Math.min(
        Math.max(scale,0.2),
        3
    );


    this.dataset.scale = scale;


    let x = this.dataset.x || 0;
    let y = this.dataset.y || 0;


    this.style.transform =
    `translate(${x}px, ${y}px) scale(${scale})`;

});



// MODO EDICIÓN

design.addEventListener("click", function(e){

    e.stopPropagation();

    document.querySelector(".design-box")
    .classList.add("activo");

});


document.addEventListener("click", function(){

    document.querySelector(".design-box")
    .classList.remove("activo");

});



emailjs.init("8EQTI5chcoZ0eA38d");

const formulario = document.getElementById("formulario");



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




formulario.addEventListener("submit", function(e){

    e.preventDefault();


    html2canvas(document.querySelector(".remera"))
    .then(canvas => {


        canvas.toBlob(function(blob){


            const remeraFinal = new File(
                [blob],
                "remera_final.png",
                {
                    type:"image/png"
                }
            );


            Promise.all([

                subirImagenCloudinary(archivoUsuario),

                subirImagenCloudinary(remeraFinal)

            ])

            .then(resultado => {


                const urlOriginal = resultado[0].secure_url;

                const urlRemera = resultado[1].secure_url;



                const datos = {

                    nombre:
                    document.getElementById("nombre").value,


                    email:
                    document.getElementById("email").value,


                    talle:
                    document.getElementById("talle").value,


                    color:
                    document.getElementById("color").value,


                    original:
                    urlOriginal,


                    remera:
                    urlRemera

                };



                emailjs.send(
                    "service_9uxhhti",
                    "template_jokv4mx",
                    datos
                )

                .then(()=>{

                    alert("¡Pedido enviado!");

                })


                .catch(error=>{

                    console.log(error);

                    alert("Error enviando mail");

                });



            });



        }, "image/png");



    });


});