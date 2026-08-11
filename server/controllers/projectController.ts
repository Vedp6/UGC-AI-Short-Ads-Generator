import { Request, Response } from "express";
import * as Sentry from "@sentry/node";
import { prisma } from "../configs/prisma.js";
import cloudinary from "../configs/cloudinary.js";
import {
  GenerateContentConfig,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/genai";
import fs from "fs";
import path from "path";
import { text } from "stream/consumers";
import ai from "../configs/ai.js";
import { error } from "console";
import axios from "axios";
import { generateImageWithCloudflare } from "../configs/cloudflare.js";

export const createProject = async (req: Request, res: Response) => {
  let tempProjectId: string | undefined;
  let isCreditDeducted = false;

  // Get authenticated user
  const { userId } = req.auth();

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const {
      name = "New Project",
      aspectRatio = "9:16",
      userPrompt = "",
      productName,
      productDescription = "",
      targetLength = 5,
    } = req.body;
    const images = req.files as Express.Multer.File[];

    if (!images || images.length < 2) {
      return res.status(400).json({
        message: "Please upload at least 2 images",
      });
    }

    if (!productName) {
      return res.status(400).json({
        message: "Product name is required",
      });
    }

  
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.credits < 5) {
      return res.status(401).json({
        message: "Insufficient credits",
      });
    }


    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        credits: {
          decrement: 5,
        },
      },
    });

    isCreditDeducted = true;



    const uploadedImages = await Promise.all(
      images.slice(0, 2).map(async (item) => {
       

        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });

    
        return result.secure_url;
      }),
    );

  
    const project = await prisma.project.create({
      data: {
        name,
        userId,
        productName,
        productDescription,
        userPrompt,
        aspectRatio,
        targetLength: parseInt(targetLength),
        uploadedImages,
        isGenerating: true,
      },
    });

    tempProjectId = project.id;

 

    const prompt = `
Create a realistic professional ecommerce and UGC advertisement photograph.

IMAGE 0 = PRODUCT IMAGE
IMAGE 1 = MODEL/PERSON IMAGE

Combine the product and person naturally into one realistic photograph.

Make the person naturally hold, wear, or use the product depending on what the product is.

IMPORTANT REQUIREMENTS:

- Preserve the exact appearance of the product.
- Preserve the product shape.
- Preserve the product colors.
- Preserve branding and important product details.
- Do not redesign the product.
- Do not distort the product.
- Do not create duplicate products.
- Preserve the person's appearance and identity.
- Make the interaction between the person and product physically realistic.
- Match lighting between the person and product.
- Match shadows naturally.
- Match scale naturally.
- Match perspective naturally.
- Use professional studio lighting.
- Natural skin texture.
- Realistic hands and fingers.
- Premium ecommerce photography.
- Photorealistic UGC advertisement.
- High-quality commercial product photography.
- Clean professional composition.

Aspect ratio:
${aspectRatio}

Product name:
${productName}

Product description:
${productDescription}

Additional user instructions:
${userPrompt || "No additional instructions."}
`;

    const finalBuffer =
      await generateImageWithCloudflare(
        images[0].path,
        images[1].path,
        prompt,
        aspectRatio === "16:9" ? 1024 : 576,
        aspectRatio === "16:9" ? 576 : 1024,
      );

  

    if (!finalBuffer || finalBuffer.length === 0) {
      throw new Error(
        "Cloudflare returned an empty image",
      );
    }

    // ----------------------------------------
    // UPLOAD GENERATED IMAGE TO CLOUDINARY
    // ----------------------------------------

    

    const base64Image = `data:image/jpeg;base64,${finalBuffer.toString(
      "base64",
    )}`;

    const uploadResult =
      await cloudinary.uploader.upload(
        base64Image,
        {
          resource_type: "image",
          folder: "ugc-generated",
        },
      );


    // ----------------------------------------
    // UPDATE PROJECT
    // ----------------------------------------

    await prisma.project.update({
      where: {
        id: project.id,
      },
      data: {
        generatedImage:
          uploadResult.secure_url,
        isGenerating: false,
        error: "",
      },
    });

    // ----------------------------------------
    // SUCCESS RESPONSE
    // ----------------------------------------

    return res.status(200).json({
      message: "Image generated successfully",
      projectId: project.id,
      generatedImage:
        uploadResult.secure_url,
    });
  } catch (error: any) {
    // ----------------------------------------
    // ERROR
    // ----------------------------------------

 
    Sentry.captureException(error);

    // ----------------------------------------
    // UPDATE PROJECT ERROR
    // ----------------------------------------

    if (tempProjectId) {
      try {
        await prisma.project.update({
          where: {
            id: tempProjectId,
          },
          data: {
            isGenerating: false,
            error:
              error?.message ||
              "Image generation failed",
          },
        });

      } catch (updateError) {
        console.error(
          "❌ Failed to update project error:",
          updateError,
        );
      }
    }

    // ----------------------------------------
    // REFUND CREDITS
    // ----------------------------------------

    if (isCreditDeducted) {
      try {
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            credits: {
              increment: 5,
            },
          },
        });

     
      } catch (refundError) {
        console.error(
          "❌ Failed to refund credits:",
          refundError,
        );
      }
    }

    // ----------------------------------------
    // ERROR RESPONSE
    // ----------------------------------------

    return res.status(500).json({
      message:
        error?.message ||
        "Image generation failed",
    });
  }
};



export const createVideo = async (req: Request, res: Response) => {
  const { userId } = req.auth();
  const { projectId } = req.body;

  let isCreditDeducted = false;


  try {
    // --------------------------------------------------
    // 1. Validate request
    // --------------------------------------------------

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!projectId) {
      return res.status(400).json({
        message: "Project ID is required",
      });
    }

    // --------------------------------------------------
    // 2. Find user
    // --------------------------------------------------

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // --------------------------------------------------
    // 3. Check credits
    // --------------------------------------------------

    if (user.credits < 10) {
      return res.status(401).json({
        message: "Insufficient Credits",
      });
    }

    // --------------------------------------------------
    // 4. Find project
    // --------------------------------------------------

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: userId,
      },
      include: {
        user: true,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

  

    // --------------------------------------------------
    // 5. Check generation status
    // --------------------------------------------------

    if (project.isGenerating) {
      return res.status(409).json({
        message: "Video generation already in progress",
      });
    }

    // --------------------------------------------------
    // 6. Check existing video
    // --------------------------------------------------

    if (project.generatedVideo) {
      return res.status(409).json({
        message: "Video already generated",
      });
    }

    // --------------------------------------------------
    // 7. Check generated image
    // --------------------------------------------------

    if (!project.generatedImage) {
      return res.status(400).json({
        message: "Generated image not found",
      });
    }

    // --------------------------------------------------
    // 8. Deduct 10 credits
    // --------------------------------------------------

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        credits: {
          decrement: 10,
        },
      },
    });

    isCreditDeducted = true;



    // --------------------------------------------------
    // 9. Mark project as generating
    // --------------------------------------------------

    await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        isGenerating: true,
        error: "",
      },
    });

   

    // --------------------------------------------------
    // 10. Create video prompt
    // --------------------------------------------------

    const prompt = `
Create a professional product advertisement video.

A person naturally showcases the product "${project.productName}".

${project.productDescription
        ? `Product description: ${project.productDescription}`
        : ""
      }

The person should interact naturally with the product.
Use smooth realistic movement.
Add subtle cinematic camera movement.
Keep the product clearly visible throughout the video.
Use realistic lighting and a premium commercial advertising style.
Do not distort the product.
`;



    // --------------------------------------------------
    // 11. Pixazo LTX 2.3 API
    // --------------------------------------------------

    const pixazoApiKey = process.env.PIXAZO_API_KEY;

    if (!pixazoApiKey) {
      throw new Error(
        "PIXAZO_API_KEY is missing from environment variables"
      );
    }

    const generateUrl =
      "https://gateway.pixazo.ai/ltx-2-3-image-to-video/v1/ltx-2-3-image-to-video-request";

  

    const generateResponse = await axios.post(
      generateUrl,
      {
        image_url: project.generatedImage,

        prompt: prompt,

        // LTX 2.3
        duration: 6,

        // Keep your project's aspect ratio logic.
        resolution: "1080p",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "Ocp-Apim-Subscription-Key": pixazoApiKey,
        },
        timeout: 30000,
      }
    );

    const requestId = generateResponse.data?.request_id;

    if (!requestId) {
      throw new Error(
        "Pixazo did not return a request ID"
      );
    }


    // --------------------------------------------------
    // 12. Poll Pixazo
    // --------------------------------------------------

    const statusUrl =
      `https://gateway.pixazo.ai/v2/requests/status/${requestId}`;

    let videoUrl: string | null = null;

    const maxAttempts = 60;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
     

      await new Promise((resolve) =>
        setTimeout(resolve, 5000)
      );

      const statusResponse = await axios.get(
        statusUrl,
        {
          headers: {
            "Ocp-Apim-Subscription-Key": pixazoApiKey,
          },
          timeout: 30000,
        }
      );

      const statusData = statusResponse.data;

  

      // -----------------------------
      // Completed
      // -----------------------------

      if (statusData.status === "COMPLETED") {
        videoUrl =
          statusData.output?.media_url?.[0] || null;

        if (!videoUrl) {
          throw new Error(
            "Pixazo completed but did not return video URL"
          );
        }

        

        break;
      }

      // -----------------------------
      // Failed
      // -----------------------------

      if (
        statusData.status === "FAILED" ||
        statusData.status === "ERROR"
      ) {
        throw new Error(
          statusData.error ||
          "Pixazo video generation failed"
        );
      }
    }

    // --------------------------------------------------
    // 13. Make sure video exists
    // --------------------------------------------------

    if (!videoUrl) {
      throw new Error(
        "Video generation timed out"
      );
    }

    // --------------------------------------------------
    // 14. Upload video directly to Cloudinary
    // --------------------------------------------------

    const uploadResult =
      await cloudinary.uploader.upload(
        videoUrl,
        {
          resource_type: "video",
          folder: "ai-ads/videos",
        }
      );


    // --------------------------------------------------
    // 15. Update project
    // --------------------------------------------------

    await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        generatedVideo:
          uploadResult.secure_url,

        isGenerating: false,

        error: "",
      },
    });

   

    // --------------------------------------------------
    // 16. Send response
    // --------------------------------------------------

    return res.status(200).json({
      message: "Video generation completed",
      videoUrl: uploadResult.secure_url,
    });

  } catch (error: any) {

    console.error("❌ CREATE VIDEO ERROR");

    console.error(
      error?.response?.data || error
    );

    // --------------------------------------------------
    // 17. Reset project generation status
    // --------------------------------------------------

    if (projectId && userId) {
      try {
        await prisma.project.update({
          where: {
            id: projectId,
          },
          data: {
            isGenerating: false,
            error:
              error?.response?.data?.message ||
              error?.response?.data?.error ||
              error?.message ||
              "Video generation failed",
          },
        });
      } catch (updateError) {
        console.error(
          "Failed to update project error status:",
          updateError
        );
      }
    }

    // --------------------------------------------------
    // 18. Refund credits
    // --------------------------------------------------

    if (isCreditDeducted && userId) {
      try {
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            credits: {
              increment: 10,
            },
          },
        });


      } catch (refundError) {
        console.error(
          "❌ Failed to refund credits:",
          refundError
        );
      }
    }

    // --------------------------------------------------
    // 19. Sentry
    // --------------------------------------------------

    Sentry.captureException(error);

    // --------------------------------------------------
    // 20. Return proper status
    // --------------------------------------------------

    const apiStatus =
      error?.response?.status;

    if (apiStatus === 429) {
      return res.status(429).json({
        message:
          "Video generation service is busy. Please try again later.",
      });
    }

    if (apiStatus === 402) {
      return res.status(402).json({
        message:
          "Video generation service has insufficient balance.",
      });
    }

    if (apiStatus === 403) {
      return res.status(403).json({
        message:
          "Video generation API authorization failed.",
      });
    }

    return res.status(500).json({
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Video generation failed",
    });
  }
};


export const getAllPublishedProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      where:{isPublished: true}
    })
    res.json({projects})
  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleProjects = async (req: Request, res: Response) => {
  try {
    const {userId} = req.auth()
    const projectId = req.params.projectId as string;

    const project = await prisma.project.findUnique({
      where:{id: projectId, userId}
    })

    if(!project){
      return res.status(404).json({message: 'Project not found'})
    }
    await prisma.project.delete({
      where:{id: projectId}
    })
    res.json({message: 'Project deleted'})

  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({ message: error.message });
  }
};
