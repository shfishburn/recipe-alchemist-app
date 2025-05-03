
import React from 'react';
import { Navbar } from '@/components/ui/navbar';
import { PageSeo } from '@/components/seo/PageSeo';
import { Separator } from '@/components/ui/separator';

export default function Terms() {
  return (
    <>
      <PageSeo 
        title="Terms of Service | Recipe Alchemy"
        description="Review the Terms of Service for using Recipe Alchemy."
      />
      <Navbar />
      <main className="container-page py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-6">Last updated: May 3, 2025</p>
          <Separator className="mb-8" />
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Recipe Alchemy ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
              <p>
                Recipe Alchemy provides a platform for AI-powered recipe creation, personalization, and nutrition tracking. The Service may include various features and tools that are subject to change at our discretion.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
              <p className="mb-3">
                When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password and for all activities that occur under your account.
              </p>
              <p>
                You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-semibold mb-3">4. User Content</h2>
              <p className="mb-3">
                Our Service allows you to post, link, store, share, and otherwise make available certain information, text, graphics, or other material. You retain any and all of your rights to any content you submit, post, or display on or through the Service.
              </p>
              <p>
                By posting content to the Service, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the Service.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-semibold mb-3">5. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at <a href="mailto:terms@recipealchemyapp.com" className="text-primary hover:underline">terms@recipealchemyapp.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
