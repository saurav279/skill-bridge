"use client";

import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export default function TestToast() {
    return (
        <div className="flex flex-wrap gap-3">
            <Button onClick={() => toast.success("Success", "User created successfully")}>
                Success
            </Button>

            <Button onClick={() => toast.error("Error", "Something went wrong")}>
                Error
            </Button>

            <Button onClick={() => toast.warning("Warning", "Please review your information")}>
                Warning
            </Button>

            <Button onClick={() => toast.info("Info", "A new update is available")}>
                Info
            </Button>
            <Button onClick={() => toast.loading("Loading", "Processing your request...")}>
                Loading</Button>
        </div>
    );
}
