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

upload.addEventListener("change", function () {

    console.log("Se eligió un archivo");

    const archivo = this.files[0];

    if (!archivo) return;

    const lector = new FileReader();

    lector.onload = function (e) {

        console.log("Imagen cargada");

        design.src = e.target.result;
        design.style.display = "block";

    };

    lector.readAsDataURL(archivo);

});
// MOVER Y AGRANDAR DISEÑO

interact("#design")
.draggable({

    listeners:{
        move(event){

            let target = event.target;

            let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
            let y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

            target.style.transform =
            `translate(${x}px, ${y}px) scale(${target.getAttribute("data-scale") || 1})`;

            target.setAttribute("data-x",x);
            target.setAttribute("data-y",y);

        }
    }

})


.gesturable({

    listeners:{
        move(event){

            let target = event.target;

            let scale = parseFloat(target.getAttribute("data-scale")) || 1;

            scale += event.ds;

            target.style.transform =
            `translate(${target.getAttribute("data-x") || 0}px,
            ${target.getAttribute("data-y") || 0}px)
            scale(${scale})`;

            target.setAttribute("data-scale",scale);

        }
    }

});
design.addEventListener("wheel", function(e){

    e.preventDefault();

    let scale = parseFloat(this.dataset.scale) || 1;

    if(e.deltaY < 0){
        scale += 0.1; // agranda
    } else {
        scale -= 0.1; // achica
    }

    // límites para que no desaparezca ni sea gigante
    scale = Math.min(Math.max(scale,0.2),3);

    this.dataset.scale = scale;

    let x = this.dataset.x || 0;
    let y = this.dataset.y || 0;

    this.style.transform =
    `translate(${x}px, ${y}px) scale(${scale})`;

});
const formulario = document.getElementById("formulario");


formulario.addEventListener("submit", function(e){

    e.preventDefault();


    html2canvas(document.querySelector(".remera"))
    .then(canvas => {

        const imagen = canvas.toDataURL("image/png");

        console.log(imagen);

        // acá después se envía por mail

    });

});