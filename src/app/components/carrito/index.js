document.addEventListener("DOMContentLoaded", function () {
  // Tu código JavaScript aquí
  console.log("Hola desde index.js");
});

const mercadopago = new MercadoPago("APP_USR-238d3b3e-176d-4613-a832-882c24b4fdcd", {
    locale: "es-AR" 
});

document.getElementById("checkout-btn").addEventListener("click", function () {

    const orderData = {
        // quantity: document.getElementById("quantity").innerHTML,
        // description: document.getElementById("product-description").innerHTML,
        // price: document.getElementById("unit-price").innerHTML
        quantity: 2,
        description: "libro",
        price: 50
    };
  
    fetch("http://localhost:8080/create_preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (preference) {
        createCheckoutButton(preference.id);
  
        // $(".shopping-cart").fadeOut(500);
        // setTimeout(() => {
        //   $(".container_payment").show(500).fadeIn();
        // }, 500);
      })
      .catch(function () {
        alert("Unexpected error");
        $('#checkout-btn').attr("disabled", false);
      });
  });


  function createCheckoutButton(preferenceId) {
    // Initialize the checkout
    const bricksBuilder = mercadopago.bricks();
  
    const renderComponent = async (bricksBuilder) => {
      if (window.checkoutButton) window.checkoutButton.unmount();
      await bricksBuilder.create(
        'wallet',
        'button-checkout', // class/id where the payment button will be displayed
        {
          initialization: {
            preferenceId: preferenceId
          },
          callbacks: {
            onError: (error) => console.error(error),
            onReady: () => {}
          }
        }
      );
    };
    window.checkoutButton =  renderComponent(bricksBuilder);
  }

  function sumar1(){
    // let valor = 0
    // let cantidad = parseInt(document.getElementById('vinos').value)
    // valor = parseInt(cantidad) + 1
    // colocarValor = document.getElementById('vinos').innerHTML= valor
    // console.log(`Cantidad: ${cantidad}`)
    
    // console.log(`Valor: ${valor}`)
  
  }

  function nivelar(){
    let resultado = 0
    let primero = parseInt(document.getElementById('vinos').value)
    let segundo = parseInt(document.getElementById('carne').value)
    console.log(`primero: ${primero}`)
    console.log(`segundo ${segundo}`)
    resultado = primero + segundo
    console.log(resultado)

    cambio = document.getElementById('unit-price').innerHTML = resultado

  }