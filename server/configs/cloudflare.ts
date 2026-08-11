import FormData from "form-data";
import axios from "axios";
import sharp from "sharp";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
const apiToken = process.env.CLOUDFLARE_API_TOKEN!;

const prepareImage = async (imagePath: string) => {
  return await sharp(imagePath)
    .resize(512, 512, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg()
    .toBuffer();
};

export const generateImageWithCloudflare = async (
  productImagePath: string,
  modelImagePath: string,
  prompt: string,
  width = 576,
  height = 1024,
) => {
  const productImage = await prepareImage(productImagePath);
  const modelImage = await prepareImage(modelImagePath);

  const form = new FormData();

  form.append("prompt", prompt);

  form.append("input_image_0", productImage, {
    filename: "product.jpg",
    contentType: "image/jpeg",
  });

  form.append("input_image_1", modelImage, {
    filename: "model.jpg",
    contentType: "image/jpeg",
  });

  form.append("width", width.toString());
  form.append("height", height.toString());

  const url =
    `https://api.cloudflare.com/client/v4/accounts/${accountId}` +
    `/ai/run/@cf/black-forest-labs/flux-2-klein-4b`;

  try {
    const response = await axios.post(url, form, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        ...form.getHeaders(),
      },

      // IMPORTANT:
      // Cloudflare is returning JSON containing the image.
      responseType: "json",
    });

    console.log("Cloudflare response received");

    const result = response.data?.result;

    if (!result) {
      console.error("Cloudflare response:", response.data);
      throw new Error("Cloudflare returned no result");
    }

    const image = result.image;

    if (!image) {
      console.error("Cloudflare result:", result);
      throw new Error("Cloudflare returned no image");
    }

    console.log("Cloudflare image response type:", typeof image);

    // Cloudflare can return the generated image as a base64 string.
    const imageBuffer = Buffer.from(image, "base64");

    if (!imageBuffer.length) {
      throw new Error("Cloudflare returned an empty image");
    }

    console.log(
      "✅ Decoded Cloudflare image buffer:",
      imageBuffer.length,
    );

    return imageBuffer;
  } catch (error: any) {
    let errorData = error.response?.data;

    if (Buffer.isBuffer(errorData)) {
      errorData = errorData.toString("utf8");
    }

    console.error(
      "❌ CLOUDFLARE ERROR:",
      errorData || error.message,
    );

    throw error;
  }
};