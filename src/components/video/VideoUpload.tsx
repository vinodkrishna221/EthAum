"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Video, Upload, X } from "lucide-react"

interface VideoUploadProps {
    onVideoSelected: (file: File | null) => void
}

export function VideoUpload({ onVideoSelected }: VideoUploadProps) {
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
            onVideoSelected(file)
        }
    }

    const handleClear = () => {
        setPreviewUrl(null)
        onVideoSelected(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="relative flex aspect-video w-full max-w-sm flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 hover:bg-muted/80 transition-colors">
                    {previewUrl ? (
                        <div className="relative h-full w-full">
                            <video src={previewUrl} controls className="h-full w-full rounded-lg object-cover" />
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute -right-2 -top-2 h-8 w-8 rounded-full shadow-md"
                                onClick={handleClear}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center space-y-2 py-8 text-center text-sm text-muted-foreground" onClick={() => fileInputRef.current?.click()}>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                <Upload className="h-6 w-6 text-primary" />
                            </div>
                            <div className="font-medium">Upload Video Testimonial</div>
                            <div className="text-xs text-muted-foreground/75">MP4, WebM up to 50MB</div>
                            <Input
                                ref={fileInputRef}
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <Button type="button" variant="secondary" size="sm" className="mt-2">Select File</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
