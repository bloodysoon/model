"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { ImageCrop } from "@/components/ui/image-crop"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState(value)
  const [cropImage, setCropImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      setCropImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    setCropImage(null)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', croppedBlob)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setPreview(data.url)
      onChange(data.url)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview('')
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <div className="space-y-2">
        <Label>Avatar Image</Label>
        <div className="flex items-start gap-4">
          {preview ? (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
                sizes="128px"
              />
              {!disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ) : (
            <div className="w-32 h-32 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={disabled || isUploading}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {preview ? 'Change Image' : 'Upload Image'}
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Upload an image (max 5MB). Image will be cropped to 1:1 aspect ratio.
            </p>
          </div>
        </div>
      </div>

      {cropImage && (
        <ImageCrop
          image={cropImage}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropImage(null)}
          open={!!cropImage}
        />
      )}
    </>
  )
}
