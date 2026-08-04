import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido"
    });
  }

  try {

    const preference = new Preference(client);

    const resultado = await preference.create({
      body: {

        items: req.body.items,

        back_urls: {
          success: "https://estamparcee.vercel.app",
          failure: "https://estamparcee.vercel.app",
          pending: "https://estamparcee.vercel.app"
        },

        auto_return: "approved"

      }
    });

    res.status(200).json({
      id: resultado.id,
      init_point: resultado.init_point
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }

}