
import React from 'react';
import { Navbar } from '@/components/ui/navbar';
import { PageSeo } from '@/components/seo/PageSeo';
import { Separator } from '@/components/ui/separator';

export default function Privacy() {
  return (
    <>
      <PageSeo 
        title="Privacy Policy | Recipe Alchemy"
        description="Learn about how Recipe Alchemy collects, uses, and protects your personal information."
      />
      <Navbar />
      <main className="container-page py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-6">Last updated: May 3, 2025</p>
          <Separator className="mb-8" />
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p className="mb-3">
                Recipe Alchemy ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
              </p>
              <p>
                By accessing or using our service, you acknowledge that you have read, understood, and agree to be bound by all the terms outlined in this Privacy Policy.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
              
              <h3 className="text-lg font-medium mt-4 mb-2">2.1 Personal Data</h3>
              <p className="mb-2">
                We may collect personally identifiable information, such as:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Name</li>
                <li>Email address</li>
                <li>Account credentials</li>
                <li>User preferences and dietary information</li>
                <li>Payment information when applicable</li>
              </ul>
              
              <h3 className="text-lg font-medium mt-4 mb-2">2.2 Usage Data</h3>
              <p className="mb-2">
                We may also collect information about how you access and use our service, including:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent</li>
                <li>Unique device identifiers</li>
                <li>IP addresses</li>
              </ul>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
              <p className="mb-2">
                We use the collected data for various purposes:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information so that we can improve our service</li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
                <li>To personalize your experience and deliver content relevant to your preferences</li>
              </ul>
            </section>

            <Separator />
            
            <section>
              <h2 className="text-xl font-semibold mb-3">4. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@recipealchemyapp.com" className="text-primary hover:underline">privacy@recipealchemyapp.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
