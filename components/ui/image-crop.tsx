"use client"

import { useState, useCallback } from "react"
import Cropper, { Area, Point } from "react-easy-crop"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"

interface ImageCropProps {
  image: string
  onCropComplete: (croppedImage: Blob) => void
  onCancel: () => void
  open: boolean
}

export function ImageCrop({ image, onCropComplete, onCancel, open }: ImageCropProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropCompleteHandler = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels) return

    const imageElement = new Image()
    imageElement.src = image

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    canvas.width = croppedAreaPixels.width
    canvas.height = croppedAreaPixels.height

    ctx.drawImage(
      imageElement,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    )

    canvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(blob)
      }
    }, 'image/jpeg', 0.95)
  }, [croppedAreaPixels, image, onCropComplete])

  const handleSave = async () => {
    await createCroppedImage()
  }

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-96 bg-muted">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteHandler}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Zoom</label>
          <Slider
            value={[zoom]}
            onValueChange={(value: number[]) => setZoom(value[0])}
            min={1}
            max={3}
            step={0.1}
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
