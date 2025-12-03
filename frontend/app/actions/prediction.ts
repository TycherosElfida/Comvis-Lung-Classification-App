'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const predictionSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File must be < 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type),
      'Only JPG/PNG images allowed'
    )
})

export async function predictLungPathology(formData: FormData, enableGradCAM: boolean = false) {
  try {
    // Validate input
    const file = formData.get('file')
    const validation = predictionSchema.safeParse({ file })
    
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message
      }
    }

    // Call backend API (with or without Grad-CAM)
    const apiFormData = new FormData()
    apiFormData.append('file', file as File)
    
    const endpoint = enableGradCAM 
      ? 'http://localhost:8000/api/predict-with-gradcam'
      : 'http://localhost:8000/api/predict'
    
    const response = await fetch(endpoint, {
      method: 'POST',
      body: apiFormData
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    // Revalidate cache
    revalidatePath('/demo')
    
    return {
      success: true,
      data: {
        predictions: data.predictions,
        inferenceTime: data.inference_time_ms,
        gradcam: data.gradcam || null  // Include Grad-CAM if available
      }
    }
  } catch (error) {
    console.error('Prediction error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Prediction failed'
    }
  }
}
