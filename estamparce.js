gsap.registerPlugin(ScrollToPlugin);

const wrapper = document.querySelector(".foto-wrapper");
const servicios = document.querySelector(".servicios");
const titulo = document.querySelector(".titulo");

let animando = false;

document.documentElement.style.overflow = "hidden";
document.body.style.overflow = "hidden";

function iniciarTransicion() {

    if (animando) return;
    animando = true;
gsap.timeline({
    defaults: { ease: "power3.inOut" },

    onComplete() {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
    }
})

.to(window, {
    scrollTo: servicios,
    duration: 3
}, 0)

.to(wrapper, {
    scale: 0.35,
    y: 250,
    duration: 3
}, 0)

.to(titulo, {
    top: "40px",
    duration: 3
}, 0);
}
setTimeout(iniciarTransicion, 1000);
const links = document.querySelectorAll(".item a");

links.forEach(link => {

    link.addEventListener("click", function(e){

        e.preventDefault();

        const destino = this.href;

        gsap.to("body",{
            x:-window.innerWidth,
            opacity:0,
            duration:1.5,
            ease:"power2.inOut",
            onComplete(){
                window.location.href = destino;
            }
        });

    });

});