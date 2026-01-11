"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Linkedin, CheckCircle, Loader2 } from "lucide-react"

interface LinkedInConnectProps {
    onConnect?: () => void
    connected?: boolean
}

export function LinkedInConnect({ onConnect, connected = false }: LinkedInConnectProps) {
    const [loading, setLoading] = React.useState(false)
    const [isConnected, setIsConnected] = React.useState(connected)

    const handleConnect = () => {
        setLoading(true)
        // Simulate API call / OAuth window
        setTimeout(() => {
            setLoading(false)
            setIsConnected(true)
            if (onConnect) onConnect()
        }, 1500)
    }

    if (isConnected) {
        return (
            <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded-md border border-blue-100">
                <Linkedin className="h-4 w-4 fill-current" />
                <span className="font-medium">Connected as Sarah Chen</span>
                <CheckCircle className="h-4 w-4 ml-auto text-green-600" />
            </div>
        )
    }

    return (
        <Button
            type="button"
            variant="outline"
            className="gap-2 text-[#0077b5] border-[#0077b5]/20 hover:bg-[#0077b5]/5 w-full sm:w-auto"
            onClick={handleConnect}
            disabled={loading}
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Linkedin className="h-4 w-4 fill-current" />
            )}
            {loading ? "Connecting..." : "Verify with LinkedIn"}
        </Button>
    )
}
