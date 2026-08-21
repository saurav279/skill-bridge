import React from 'react'
import Link from 'next/link'

const PrivacyAndTermsConsent = () => {
  return (
    <p className="mx-auto mt-4 max-w-2xl text-left text-sm text-muted-foreground">
    By submitting this form, you agree to our{" "}
    <Link href="/terms" target="_blank" className="font-medium text-primary hover:underline">
      Terms of Service
    </Link>
    {" "}and{" "} acknowledge that you have read and understood our{" "}
    <Link href="/privacy" target="_blank" className="font-medium text-primary hover:underline">
      Privacy Policy
    </Link>
  </p>
  )
}

export default PrivacyAndTermsConsent